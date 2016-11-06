---
title: "AWS Simple Storage Service (S3) pain"
date: 2012-11-15T09:36:39Z
tags:
  - .NET
  - AWS
  - Cloud
  - Storage &amp; Backup
redirect_from: /id/233069/
layout: post
---
When we worked together with [Aleš Roubíček][1] using Windows Azure cloud, we faced quite a few surprises with applications in cloud. Especially when the application isn't small and is using a lot of "cloud" services. Sometimes we used hashtag on Twitter for it: [_#cloudlife_][2].

Last week I was creating fairly simple tool that allows (or should allow) me to copy some files to S3 bucket. I had some special needs because the folder where the files were was heavily changed and the tool needed to handle that. Because [AWS][3] has [SDK for .NET][4] I was not expecting that to be extremely difficult. How wrong I was.

Every file in S3 has [ETag][5] associated. And you will get it with almost every request, i.e. when you're listing bucket. Good candidate for decision whether to copy the file (because it was changed) or not. The SDK contains [`AmazonS3Util`][6] class which allows you to compute the checksum/ETag. Great, should be piece of cake. Not so fast. The SDK and S3 itself has some gotchas - _#cloudlife_.

First the ETag returned from SDK is inside double quotes. But the value from `AmazonS3Util` is not. I can fix that. Could be worse. Let's move forward. For big or huge files the new multipart upload (you are uploading the file in smaller chunks) is recommended. Boom. Checksum/ETag is then different. For same file uploaded "normal" way and multipart the ETag differs. Sadly the `AmazonS3Util` can compute only the checksum for "normal" type of upload. Never mind. Next. Every file can have some metadata associated, I can store my own checksum there. I will need to request metadata in separate call, but I can live with that. So let's use [`WithMetadata`][7] method to add some key/value. Good no problem so far. Retrieving metadata. Suspicious method [`GetObjectMetadata`][8] (and the [`BeginGetObjectMetadata`][9]/[`EndGetObjectMetadata`][10] counterparts) returns [NameValueCollection][11], I can probably find the same key as I stored there. Not so fast. My key originally stored as i.e. `foobar` is now `x-amz-meta-foobar`. Maybe the `WithMetadata` could enforce that in input, so I know there's always this prefix. I don't like hidden magic. Almost there. Every request is also signed (that's, also, why we have the key and secret) to be sure the request was not changed on the way etc. (headers, parameters etc. are part or the input for signature). SDK handles the signature for me. Badly. As long as you use US-ASCII characters in filenames/paths or better to say keys for storing the data, you're fine. Try to put there some "special" characters, like in my case diacritics. Suddenly the signature doesn't match what's expected and server will not allow me proceed further. Yes you're right, the encoding issue. Sadly I don't know currently workaround. Hope it'll be fixed soon. Hitting wall every while.

And you know what? Some limitations and challenges I like (ETag issue. These are reasons why I like development and creating software. Some I don't like (encoding issue), I shows somebody wasn't doing own work properly. And why _#cloudlife_? From marketing we're told the cloud is so cool and so ... best, it'll solve all our problems and we expect it to be perfect. But it's not. It's piece of architecture as every other component in your solution. You should expect issues.

Have fun, develop for fun.

[1]: http://rarous.net/
[2]: https://twitter.com/search?q=%23cloudlife
[3]: http://aws.amazon.com
[4]: http://aws.amazon.com/sdkfornet/
[5]: http://en.wikipedia.org/wiki/HTTP_ETag
[6]: http://docs.amazonwebservices.com/sdkfornet/latest/apidocs/html/T_Amazon_S3_Util_AmazonS3Util.htm
[7]: http://docs.amazonwebservices.com/sdkfornet/latest/apidocs/html/M_Amazon_S3_Transfer_TransferUtilityUploadRequest_WithMetadata_1.htm
[8]: http://docs.amazonwebservices.com/sdkfornet/latest/apidocs/html/M_Amazon_S3_AmazonS3Client_GetObjectMetadata.htm
[9]: http://docs.amazonwebservices.com/sdkfornet/latest/apidocs/html/M_Amazon_S3_AmazonS3Client_BeginGetObjectMetadata.htm
[10]: http://docs.amazonwebservices.com/sdkfornet/latest/apidocs/html/M_Amazon_S3_AmazonS3Client_EndGetObjectMetadata.htm
[11]: http://msdn.microsoft.com/en-us/library/system.collections.specialized.namevaluecollection.aspx