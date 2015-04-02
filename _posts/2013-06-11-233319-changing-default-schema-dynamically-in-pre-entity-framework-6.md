---
title: "Changing default schema dynamically in pre-Entity Framework 6 "
date: 2013-06-11T12:03:40Z
tags:
  - Entity Framework
category: none
layout: post
---
If you're using 3<sup>rd</sup> party database where `dbo` is not the default you might hit the wall with default conventions. Why? Because even if you didn't configured the schema by calling [`EntityTypeConfiguration.ToTable`][1] overload it will result in `dbo`. It's simply hard-coded there. Entity Framework 6 solves this by adding `DbModelBuilder.HasDefaultSchema` property. Or you can write your own convention. In time of writing the version 6 is in beta stage, hence probably not something you should use in production. But there's still a way.

<!-- excerpt -->

If there's an overload where I can specify the schema explicitly I can call it, right? But that's a lot of work. Especially is you're relying heavily on "conventions". But the heavy work can be done by machine right? Because a lot of APIs we need to dive in is not public and (also partly because of generics) we need to dive into reflection. Not good for readability. But, ..., could be worse. ;)

<pre class="brush:csharp">
static class SchemaRewriteHelper
{
	const BindingFlags RewriteSchemaBindingFlags = BindingFlags.Instance | BindingFlags.NonPublic;

	public static void RewriteSchema(DbModelBuilder modelBuilder, string schema)
	{
		var modelBuilderType = modelBuilder.GetType();
		var modelConfiguration = modelBuilderType.GetProperty("ModelConfiguration", RewriteSchemaBindingFlags).GetValue(modelBuilder);
		var activeEntityConfigurations = (IList)modelConfiguration.GetType().GetProperty("ActiveEntityConfigurations", RewriteSchemaBindingFlags).GetValue(modelConfiguration);
		foreach (var item in activeEntityConfigurations)
		{
			RewriteSchemaForEntityTypeConfiguration(item, schema);
		}
	}

	static void RewriteSchemaForEntityTypeConfiguration(object entityTypeConfiguration, string schema)
	{
		// not bulletproof, but better than nothing
		if (entityTypeConfiguration.GetType().Name != "EntityTypeConfiguration")
			throw new ArgumentException();

		var entityTypeConfigurationType = entityTypeConfiguration.GetType();
		var entityMappingConfigurations = ((IList)entityTypeConfigurationType.GetField("_entityMappingConfigurations", RewriteSchemaBindingFlags).GetValue(entityTypeConfiguration));
		foreach (var entityMappingConfiguration in entityMappingConfigurations)
		{
			var navigationPropertyConfigurations = (IDictionary)entityTypeConfigurationType.GetField("_navigationPropertyConfigurations", RewriteSchemaBindingFlags).GetValue(entityTypeConfiguration);
			foreach (var val in navigationPropertyConfigurations.Values)
			{
				var associationMappingConfiguration = val.GetType().GetProperty("AssociationMappingConfiguration", RewriteSchemaBindingFlags).GetValue(val);
				if (associationMappingConfiguration == null)
					continue;
				var tableNameAssociation = associationMappingConfiguration.GetType().GetField("_tableName", RewriteSchemaBindingFlags).GetValue(associationMappingConfiguration);
				var schemaAssociation = (string)tableNameAssociation.GetType().GetProperty("Schema").GetValue(tableNameAssociation);
				var nameAssociation = (string)tableNameAssociation.GetType().GetProperty("Name").GetValue(tableNameAssociation);
				ToTableHelper(associationMappingConfiguration, nameAssociation, schemaAssociation ?? schema);
			}
			var tableNameEntity = entityMappingConfiguration.GetType().GetProperty("TableName").GetValue(entityMappingConfiguration);
			var schemaEntity = (string)tableNameEntity.GetType().GetProperty("Schema").GetValue(tableNameEntity);
			var nameEntity = (string)tableNameEntity.GetType().GetProperty("Name").GetValue(tableNameEntity);
			ToTableHelper(entityTypeConfiguration, nameEntity, schemaEntity ?? schema);
		}
	}

	static void ToTableHelper(object configuration, string name, string schema)
	{
		configuration.GetType().GetMethod("ToTable", new[] { typeof(string), typeof(string) }).Invoke(configuration, new[] { name, schema });
	}
}
</pre>

You can pass the `DbModelBuilder` into the `RewriteSchema` method in [`OnModelCreating`][2] and let the magic happen. Because usual the [`EntityTypeConfiguration`][3] is not used internally I'm hacking slightly different objects. But the idea is the same. Get all mapped entities, get the schema name and table name. And call `ToTable` with defined schema if it was previously `null`. Also do it for tables used for `M:N` associations. With `M:N` associations there's a small glitch. These are probably configured even more dynamically and hence if not configured explicitly the schema will not be rewritten, because at this stage I was not able to spot where I can find it for rewriting (I because my case contained explicit `M:N` configuration I was not too eager to dig deeper 8-)).

Again no warranty. It worked in my case for application with fairly big model with about 100 tables/entities. ;)

[1]: http://msdn.microsoft.com/en-us/library/gg679488(v=vs.103).aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext.onmodelcreating(v=vs.103).aspx
[3]: http://msdn.microsoft.com/en-us/library/gg696117(v=vs.103).aspx