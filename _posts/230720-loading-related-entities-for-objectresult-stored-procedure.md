---
title: |-
  Loading related entities for ObjectResult (stored procedure)
date: 2009-07-08T22:07:32Z
tags:
  - .NET
  - Entity Framework
  - Entity SQL
  - LINQ
---
There're two kinds of people. 1) people doing almost everything in code; 2) people doing everything on database side. I'm in neither of these buckets. ;) I like doing a lot of stuff on database side, because sometimes expressing something in set operations (these are good for RDBMS) is really challenging. On the other way, when it's easy and fast to do it in code, why bother...

From this few sentences you can guess that I like writing stored procedures. Because of this in project I'm currently working on I created some stored procedures for difficult and expensive searching and I'm [mapping][1] results back to entities in Entity Framework. The problem is that this particular entity has a lot of associations. Thus it's more than likely somebody will need the related entities too. Sadly there's no Include (stored procedures are not composable by default, so you cannot create left join to fetch the related data). But that was a problem, because loading - using [Load][2] method - `x` related entries for even small with i.e. 20 items results in `20×x` calls to database. Although these queries are in most cases cheap, it's not good for performance.

So I started creating extension methods to get this solved in a little bit better way. My goal was to have one query for one related end for all items in result. Hence there will be only `x` additional queries. The result is here:

_Disclaimer: The code is not general purpose and contains some assumptions based on my conditions and rules._

```csharp
public static IEnumerable<T> LoadRelated<T>(this ObjectResult<T> result, MergeOption mergeOption, params Func<T, IRelatedEnd>[] relatedEnds)
	where T : EntityObject
{
	return LoadRelatedStarter(result, mergeOption, relatedEnds);
}
public static IEnumerable<T> LoadRelated<T>(this ObjectResult<T> result, params Func<T, IRelatedEnd>[] relatedEnds)
	where T : EntityObject
{
	return LoadRelatedStarter(result, MergeOption.AppendOnly, relatedEnds);
}
private static IEnumerable<TEntity> LoadRelatedStarter<TEntity>(ObjectResult<TEntity> result, MergeOption mergeOption, params Func<TEntity, IRelatedEnd>[] relatedEnds)
	where TEntity : EntityObject
{
	result.EnsureNotNull();
	TEntity[] tmp = result.ToArray();
	relatedEnds.EnsureNotNull();
	relatedEnds.EnsureEachNotNull();
	if (tmp.Any())
	{
		for (int i = 0; i < relatedEnds.Length; i++)
		{
			ObjectQuery query = relatedEnds[i](tmp[0]).CreateSourceQuery() as ObjectQuery;
			Type related = query.GetType().GetGenericArguments()[0];
			typeof(Extensions)
				.GetMethod("LoadRelatedHelper", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static)
				.MakeGenericMethod(typeof(TEntity), related)
				.Invoke(null, new object[] { tmp, query, mergeOption });
			if (i == relatedEnds.Length - 1)
			{
				FixAssociations(query.Context, tmp);
			}
		}
	}
	foreach (TEntity item in tmp)
	{
		yield return item;
	}
}
private static void FixAssociations<TEntity>(ObjectContext context, IEnumerable<TEntity> entities)
{
	// this is a workaround to make associations wire up properly
	context.Refresh(RefreshMode.ClientWins, entities);
}
private static void LoadRelatedHelper<TEntity, TRelated>(ICollection<TEntity> entities, ObjectQuery<TRelated> query, MergeOption mergeOption)
	where TEntity : EntityObject
	where TRelated : EntityObject
{
	string separator = string.Format("{0}) union ({0}", Environment.NewLine);
	// In general this may produce wrong results
	string queryTemplate = query.CommandText.Replace(query.Parameters.First().Name, "{0}");
	StringBuilder newQuery = new StringBuilder();
	newQuery.AppendLine("(");
	for (int i = 0; i < entities.Count; i++)
	{
		if (i > 0)
			newQuery.Append(separator);
		newQuery.Append(string.Format(queryTemplate, string.Format("p{0}", i)));
	}
	newQuery.AppendLine();
	newQuery.Append(")");
	// I know (from my design rules) that there's only one (key) param
	ObjectParameter[] parameters = entities.Select((x, i) => new ObjectParameter(string.Format("p{0}", i), x.EntityKey.EntityKeyValues[0].Value)).ToArray();
	query.Context.CreateQuery<TRelated>(newQuery.ToString(), parameters).Execute(mergeOption).ToArray();
}
```

The idea is pretty simple. For each related end, grab the query and instead of using one parameter, add there all the value for all items in result - the primary key columns. I'm actually parsing the Entity SQL query returned to me, although with [MetadataWorkspace][3] one should be able to create it yourself (you can do it as a homework ;)). Then I modify the query, fill the parameters and execute it. Again, the parsing isn't perfect, as well as the work with keys for parameters - there's a simplification based on my conditions and rules.

With the automatic association wiring (used also in [this trick][4]) this should work nicely. It works like a charm for [ObjectQuery][5], but not for [ObjectResult][6] (in EFv1). I don't know, maybe it's a problem on my side - anyway it's reported in [EF forum][7], so far without reply. If you read the second post there from me, you'll find the workaround I found. This idea is captured in `FixAssociations` method (and may result in a huge `or` clause for big results).

These methods are taking array/params of related ends to get all in one method. And finally you get the result back and you can start processing it. The result is, for me, acceptable, I ended up with `x+1` queries (with i.e. [EFExtensions][8], I think, one can be able to do this with even lower number of queries).

Anyway, hope this helps and hope I find why the associations are not wired up properly. Maybe some considerations to improve this scenario are worth to discuss for post-EF4, as as far as I know, there's no improvement on this in EF4.

<small>Note: EnsureXxx are my runtime validation extension methods, similar to [Code Contracts][9].</small>

[1]: http://msdn.microsoft.com/en-us/library/bb896279.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.irelatedend.load.aspx
[3]: {{ include "post_link" 230583 }}
[4]: {{ include "post_link" 229660 }}
[5]: http://msdn.microsoft.com/en-us/library/bb345303.aspx
[6]: http://msdn.microsoft.com/en-us/library/bb739113.aspx
[7]: http://social.msdn.microsoft.com/Forums/en-US/adodotnetentityframework/thread/d2dbc9fa-6574-4cb7-a98d-900a2d449f66
[8]: http://code.msdn.microsoft.com/EFExtensions
[9]: http://msdn.microsoft.com/en-us/devlabs/dd491992.aspx