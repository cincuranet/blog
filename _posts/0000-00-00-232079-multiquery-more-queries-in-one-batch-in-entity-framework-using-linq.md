---
title: |-
  MultiQuery (more queries in one batch) in Entity Framework using LINQ
date: 2010-10-11T11:23:58Z
tags:
  - Entity Framework
  - LINQ
  - NHibernate
layout: post
---
I recently discovered nice feature of [NHibernate][1]. It's called [MultiQuery][2] (but the name doesn't matter). The idea behind is simple. Instead of sending multiple queries one by one and melting performance of your application in network latency, send all in one batch.

I read couple of articles about it. Later something in my head started to working and I had an idea about trying to do it in [Entity Framework][3]. :) I had a basic concept in my head in couple of minutes and I told myself I'll try to do it, but I'll not invest too much time into it. Just quick'n'dirty brain exercise for Saturday (alike [Bart de Smet][4]'s [Crazy Sundays][5]).

The concept was simple. Record couple of [ObjectQuery][6] objects, get commands out of these, create one huge batch, re-wire parameters (more about that later) and get results.

```csharp
public class MultiQuery
{
	struct QueryRecord
	{
		public ObjectQuery Query { get; set; }
		public Type Type { get; set; }
		public static QueryRecord Create<T>(ObjectQuery<T> query)
		{
			return new QueryRecord() { Query = query, Type = typeof(T) };
		}
	}
	
	#region Fields
	ObjectContext _context;
	List<QueryRecord> _queries;
	#endregion
	
	#region Constructors
	public MultiQuery(ObjectContext context)
	{
		_queries = new List<QueryRecord>();
		_context = context;
	}
	#endregion
	
	#region Public Methods
	public MultiQuery Add<T>(ObjectQuery<T> query)
	{
		if (query == null)
			throw new ArgumentNullException("query");
		_queries.Add(QueryRecord.Create(query));
		return this;
	}
	
	public MultiQuery Add<T>(IQueryable<T> query)
	{
		return this.Add(query as ObjectQuery<T>);
	}
	
	public IEnumerable<ObjectResult> Execute()
	{
		IDbConnection storeConnection = ((EntityConnection)_context.Connection).StoreConnection;
		using (IDbCommand cmd = storeConnection.CreateCommand())
		{
			IDataParameterCollection parameters = cmd.Parameters;
			cmd.CommandText = CreateCommand(_queries.Select(q => q.Query), cmd.CreateParameter, ref parameters);
			bool shouldClose = (_context.Connection.State == ConnectionState.Closed);
			try
			{
				storeConnection.Open();
				using (IDataReader reader = cmd.ExecuteReader())
				{
					int cnt = 0;
					do
					{
						yield return _context.Translate(_queries[cnt].Type, reader);
						cnt++;
					} while (reader.NextResult());
				}
			}
			finally
			{
				if (shouldClose)
					storeConnection.Close();
			}
		}
	}
	#endregion
	
	#region Private Methods
	string CreateCommand(IEnumerable<ObjectQuery> queries, Func<IDataParameter> parameterCreator, ref IDataParameterCollection parameters)
	{
		List<string> commands = new List<string>();
		int cnt = 0;
		foreach (var q in _queries.Select(q => q.Query))
		{
			string query = q.ToTraceString();
			foreach (var p in q.Parameters)
			{
				IDataParameter parameter = parameterCreator();
				parameter.ParameterName = string.Format("@p{0}", cnt++);
				parameter.Value = p.Value;
				parameters.Add(parameter);
				// Not good. Better (and still easy) idea?
				query = query.Replace(string.Format("@{0}", p.Name), parameter.ParameterName);
			}
			commands.Add(query);
		}
		return string.Join(";" + Environment.NewLine, commands);
	}
	#endregion
}

static class MultiQueryExt
{
	internal static ObjectResult Translate(this ObjectContext context, Type type, IDataReader reader)
	{
		// ObjectResult<TElement> Translate<TElement>(DbDataReader reader)
		object result =
			context
			.GetType()
			.GetMethod("Translate", new[] { typeof(DbDataReader) })
			.MakeGenericMethod(type)
			.Invoke(context, new object[] { reader });
		return (ObjectResult)result;
	}
}
```

I'm here fully utilizing new [Translate method][7] in Entity Framework 4 (for v1 similar method is available in [EFExtensions][8]). The rest is done using pure [ADO.NET][9]. It's worth noting, that this code, same as in NHibernate, works only if the database and the underlying provider supports processing more queries in one command (i.e. [Microsoft SQL Server][10] does, but [Firebird][11] does not).

Also small notice to parameters. I'm doing simple replace and that's dumb. It may fail and produce wrong results, but in very rare cases. So you should test thoroughly. The case when it produces wrong results is, when you write query in where you use _directly_ (not as a variable etc.) string that is same as parameter name (i.e. `p__linq__<number>` for [SqlClient][12] or `p<number>` for [FirebirdClient][13]). As you are in control of these strings you can change the code to use a variable, for instance.

A lot of "fetching" methods in Entity Framework supports also [MergeOption][14]. Adding overload for `Execute` I'm leaving as exercise for readers. Likewise for the [Entity SQL][15] queries.

[1]: http://www.nhforge.org/
[2]: http://nhforge.org/doc/nh/en/index.html#performance-multi-query
[3]: http://msdn.microsoft.com/en-us/library/bb399572.aspx
[4]: http://community.bartdesmet.net/blogs/bart/Default.aspx
[5]: http://community.bartdesmet.net/blogs/bart/archive/tags/Crazy+Sundays/default.aspx
[6]: http://msdn.microsoft.com/en-us/library/bb345303.aspx
[7]: {% include post_id_link.txt id="231337" %}
[8]: http://code.msdn.microsoft.com/EFExtensions
[9]: http://msdn.microsoft.com/en-us/library/h43ks021.aspx
[10]: http://www.microsoft.com/sqlserver/
[11]: http://www.firebirdsql.org
[12]: http://msdn.microsoft.com/en-us/library/system.data.sqlclient.aspx
[13]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[14]: http://msdn.microsoft.com/en-us/library/system.data.objects.mergeoption.aspx
[15]: http://msdn.microsoft.com/en-us/library/bb387145.aspx