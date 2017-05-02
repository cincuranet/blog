---
title: |-
  Workaround for using HTTPS with custom domain on Azure Blob Storage
date: 2017-05-02T19:00:00Z
tags:
  - Cloud
  - Azure
  - Azure Storage
  - CDN
layout: post
---
[Azure Blob Storage][4] is my favorite cloud service in Azure. Among it's purpose of storing data, it allows you to set custom domain instead of using `<account>.blob.core.windows.net`. Which is handy. On the other hand it does not allow you (currently) to use it with HTTPS because you can't upload your own certificate, which sucks, sucks donkey balls.

<!-- excerpt -->

What to do about it? It's time for combining multiple services together and hoping it fits. Of course I don't want to put i.e. Web App in front of it because that's another piece to take care about. I want something Azure manages for me. 

#### Solution

One service that allows using HTTPS with custom domain (and certificate) is [Azure CDN][5] (only Verizon currently). Although you can't upload your own certificate, you'll get a valid certificate from DigiCert for free once you enable HTTPS. Because you can put CDN in front of blob storage, it's almost solved.

The [CDN pricing][2] is very similar to [blob storage pricing][1], thus from cost perspective it's not going to burn hole in your pocket.

#### Limitations

The limitation is of course the nature of CDN - it's caching the data in _PoP_ locations. That means if your data is changing often you're pretty much out of luck.

And similarly, if you're using _Shared Access Signatures_, it's not going to work well either.

#### Summary

Honestly I hate finding workarounds for such basic tasks. I know handling and scaling HTTPS isn't easy. So isn't building cloud infrastructure. That's why I'm building apps on top of Azure and not buildnig my own Azure.

If you can fit your needs in between the limitations, this might be viable solution. Else you're out of luck and you have to [wait until the HTTPS with custom domain is supported directly on blob storage][3].

[1]: https://azure.microsoft.com/en-us/pricing/details/storage/blobs/
[2]: https://azure.microsoft.com/en-us/pricing/details/cdn/
[3]: https://feedback.azure.com/forums/217298-storage/suggestions/3007732-make-it-possible-to-use-ssl-on-blob-storage-using
[4]: https://azure.microsoft.com/en-us/services/storage/blobs/
[5]: https://azure.microsoft.com/en-us/services/cdn/