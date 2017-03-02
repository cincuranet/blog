---
title: |
  Creating Append Blob only if it does not exists safely
date: 2017-03-01T17:58:00Z
tags:
  - Azure
  - Azure Storage
layout: post
---
I'm working on a small side-project where I need some multiple-writers-safe storage for storing logging-like events. For this the Azure's [Append Blob][1] is a good match.

<!-- excerpt -->

But the blob itself is limited in size and number of blocks. Thus I have to, from time to time, create a new one. And I decided to do it regularly. Every month in my case. Only problem is how to reliably create these blob... The container has a handy [`CreateIfNotExistsAsync`][2] method. But [`AppendBlob`][3] has only [`CreateOrReplaceAsync`][4] and for my scenario the "replace" part is really not desired. Although I can use the [`ExistsAsync`][5] method, the race condition alarm triggers immediately.

Luckily there's a way to do kind of [optimistic locking][8]. I can use the [`CreateOrReplaceAsync` overload with `AccessCondition`][6] and use [`GenerateIfNotExistsCondition`][7]. That way I'll get an exception, which I can handle, when the blob already exists and it will not be replaced.

```csharp
var blob = container.GetAppendBlobReference("foobar.txt");
try
{
    await blob.CreateOrReplaceAsync(
			AccessCondition.GenerateIfNotExistsCondition(), 
			new BlobRequestOptions() { RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(1), 10) }, 
			new OperationContext());
}
catch (StorageException ex) when (ex.RequestInformation?.HttpStatusCode == (int)HttpStatusCode.Conflict)
{ }
```

Here I'm using the mentioned `GenerateIfNotExistsCondition` (together with `LinearRetry` policy as one should, in case something is not healthy in the cloud at the moment), then catching the `StorageException` and checking whether the status was `409 Conflict`. If so I can be 99% sure the blob exists and I can safely continue. Else it was just created. Given that I'm trying it and handling the "already exists" state, not the other way around, I don't have the race condition anymore.

The `GenerateIfNotExistsCondition` is not limited only to this method. You can use it on other places too. Although in this particular case it fits nicely (maybe that's why it's also mentioned in the overload's description - if you'd ever look at that overload).

For me now, to find good format for "streaming" or appending, respectively. I think CSV will do.

[1]: https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/understanding-block-blobs--append-blobs--and-page-blobs
[2]: https://msdn.microsoft.com/en-us/library/dn435311.aspx
[3]: https://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.blob.cloudappendblob.aspx
[4]: https://msdn.microsoft.com/en-us/library/mt423069.aspx
[5]: https://msdn.microsoft.com/en-us/library/mt423366.aspx
[6]: https://msdn.microsoft.com/en-us/library/mt423097.aspx
[7]: https://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.accesscondition.generateifnotexistscondition.aspx
[8]: https://en.wikipedia.org/wiki/Optimistic_concurrency_control