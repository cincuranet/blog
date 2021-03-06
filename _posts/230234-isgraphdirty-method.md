---
title: |-
  IsGraphDirty method
date: 2009-05-15T08:34:00Z
tags:
  - Entity Framework
  - LINQ
---
Probably one of the first methods you've seen/wrote while playing with Entity Framework is IsDirty method. It's a great example how to use [ObjectStateManager][1]. While [doing consultancy work][2] I was asked to create method IsGraphDirty. Handy if you have i.e. some editing form with couple of related entities like Order and OrderLines.

The problem itself can be divided into three parts. First you'll check the entity itself, of course. Then all the related enties and finally all the associations. Why the associations?

The associations are first class citizens in EF. And when you i.e. assign one OrderLine to different Order, then the association is changed (in fact added and deleted), not the OrderLine (in database the OrderLine will be changed, but you're not thinking in behavior of store).

The method below is using exactly this way. When first dirty element is found, false is returned. Method is storing already checked entities in a collection to avoid spinning in a circle.

```csharp
private static IEnumerable<ObjectStateEntry> GetObjectStateEntries(this ObjectStateManager osm)
{
    return osm.GetObjectStateEntries(EntityState.Added | EntityState.Deleted | EntityState.Modified | EntityState.Unchanged);
}
private static bool IsModifiedEntityModified(this ObjectStateManager osm, EntityObject entity)
{
    if (entity.EntityState != EntityState.Modified)
        throw new ArgumentException("Entity isn't modified.");
    ObjectStateEntry ost = osm.GetObjectStateEntry(entity);
    for (int i = 0; i < ost.OriginalValues.FieldCount; i++)
    {
        object original = ost.OriginalValues.GetValue(i);
        object current = ost.CurrentValues.GetValue(i);
        if (!original.Equals(current))
            return true;
    }
    return false;
}
public static bool IsDirty(this ObjectContext context, EntityObject entity)
{
    return
        (entity.EntityState == EntityState.Added)
        ||
        (entity.EntityState == EntityState.Deleted)
        ||
        (entity.EntityState == EntityState.Modified && context.ObjectStateManager.IsModifiedEntityModified(entity));
}
public static bool IsDirty(this EntityObject entity, ObjectContext context)
{
    return context.IsDirty(entity);
}
```

One of the improvements that's left, is to save also the associations checked, to avoid checking it twice and thus (maybe) finish sooner. Another may be to rewrite it without recursion.

I'm using there couple of other helper methods.

```csharp
private static IEnumerable<ObjectStateEntry> GetObjectStateEntries(this ObjectStateManager osm)
{
    return osm.GetObjectStateEntries(EntityState.Added | EntityState.Deleted | EntityState.Modified | EntityState.Unchanged);
}
private static bool IsModifiedEntityModified(this ObjectStateManager osm, EntityObject entity)
{
    if (entity.EntityState != EntityState.Modified)
        throw new ArgumentException("Entity isn't modified.");
    ObjectStateEntry ost = osm.GetObjectStateEntry(entity);
    for (int i = 0; i < ost.OriginalValues.FieldCount; i++)
    {
        object original = ost.OriginalValues.GetValue(i);
        object current = ost.CurrentValues.GetValue(i);
        if (!original.Equals(current))
            return true;
    }
    return false;
}
public static bool IsDirty(this ObjectContext context, EntityObject entity)
{
    return
        (entity.EntityState == EntityState.Added)
        ||
        (entity.EntityState == EntityState.Deleted)
        ||
        (entity.EntityState == EntityState.Modified && context.ObjectStateManager.IsModifiedEntityModified(entity));
}
public static bool IsDirty(this EntityObject entity, ObjectContext context)
{
    return context.IsDirty(entity);
}
```

The IsModifiedEntityModified method is checking whether the entity has been "really" modified. I.e. you can change some values and then change it back. The entity is marked as modified, but you may not to consider it as modified (depends on you needs). Anyway you can remove it form IsDirty and the code will work fine.

The last couple of methods are extension methods taken from [Danny Simmons's post][3] with handy methods, just to make my life easier.

```csharp
private static bool IsRelationshipForKey(this ObjectStateEntry entry, EntityKey key)
{
    if (!entry.IsRelationship)
        throw new ArgumentException("Entry isn't for relationship.");
    return ((EntityKey)entry.UsableValues()[0] == key) || ((EntityKey)entry.UsableValues()[1] == key);
}
private static IExtendedDataRecord UsableValues(this ObjectStateEntry entry)
{
    switch (entry.State)
    {
        case EntityState.Added:
        case EntityState.Detached:
        case EntityState.Unchanged:
        case EntityState.Modified:
            return (IExtendedDataRecord)entry.CurrentValues;
        case EntityState.Deleted:
            return (IExtendedDataRecord)entry.OriginalValues;
        default:
            throw new InvalidOperationException("This entity state should not exist.");
    }
}
private static EntityKey OtherEndKey(this ObjectStateEntry relationshipEntry, EntityKey thisEndKey)
{
    if ((EntityKey)relationshipEntry.UsableValues()[0] == thisEndKey)
    {
        return (EntityKey)relationshipEntry.UsableValues()[1];
    }
    else if ((EntityKey)relationshipEntry.UsableValues()[1] == thisEndKey)
    {
        return (EntityKey)relationshipEntry.UsableValues()[0];
    }
    else
    {
        throw new InvalidOperationException("Neither end of the relationship contains the passed in key.");
    }
}
```

[1]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectstatemanager.aspx
[2]: http://www.x2develop.com/
[3]: http://blogs.msdn.com/dsimmons/archive/2008/01/17/ef-extension-methods-extravaganza-part-ii-relationship-entry-irelatedend.aspx