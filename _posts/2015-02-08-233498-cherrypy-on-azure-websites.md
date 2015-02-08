---
title: "CherryPy on Azure Websites"
date: 2015-02-08T17:45:00Z
tags:
  - Python
  - Azure
category: none
layout: post
---
Let me state that upfront: I'm a Python newbie. I started playing with slightly over half a year ago as a way to expand my view. Lately I was looking for something new to try among simple scripts that do this or that. I thought something web based is a good way to start. Web is now everywhere and it's easier than packing up some desktop or mobile application (IMO).

So I started some small research for some web frameworks. Given I'm a newbie I wanted something smart but bare enough to focus on result and not on plumbing. After research where my criteria are obviously skewed I found [CherryPy][1]. Reading some tutorials and examples I liked the way it looks and it seemed intuitive.

<!-- excerpt -->

After some playing locally and on my Raspberry Pi I wanted to do some "real" (don't miss the quotes ;)) stuff. [Azure][2] or [Azure Websites][3] to be precise was my target. Mostly because all my fun Python projects are using [Azure Storage][4] for something.

Again some research and learning (I love how steep the learning curve is for something completely new for me). Going through documentation on Azure I spotted something I knew I saw in CherryPy's documentation - WSGI. Apparently you can [create WSGI compatible application from CherryPy application][5] in just single line of code. Awesome. Azure seemes to be [doing something with it][6] as well so let's jump in.

To make the story short (longer version below) _it works_. And it _works nicely_, _without any hacks_. Go to my [`CherryPy_Azure` repository][7] and check the code. The result runs at [cherrypy.azurewebsites.net][8].

So what do you need. First you need [`ptvs_virtualenv_proxy.py`][9] and [`web.config`][10] files. Both can be copy-pasted from documentation, without thinking. Then you need to tell Azure what runtime you want. That's done using [`runtime.txt`][11] file. In my case the content is `python-3.4` because I don't bother with 2.x Python versions. The deployment script collects by default static files for Django. Unless you want to rewrite the deployment script completely (by creating `.deployment` and `deploy.cmd`), just create empty `.skipDjango` file in root of your repository and you're done. It probably doesn't matter for CherryPy application anyway, but why do something more. Finally because the application uses CherryPy we add it as requirement. Putting `cherrypy` (the `pip` name) into [`requirements.txt`][12].

Almost there. Now just put your `*.py` etc. files there and in main initialize the WSGI handler for Azure. Something like:

<pre class="brush:python">
wsgi_app = cherrypy.Application(Hello(), '/')

if __name__ == '__main__':
	from wsgiref.simple_server import make_server

	httpd = make_server('', 6600, wsgi_app)
	httpd.serve_forever()
</pre> 

The hostname/IP and port doesn't matter for Azure (at least it works with whatever (valid) combination for me). The whole is [`app.py`][13] in [my repository][7].

Done. Now if you wait a few seconds for deployment to happen and head to your URL you'll the application running. On Azure Websites. No problem.

Check the [cherrypy.azurewebsites.net][8] to see the code from my repository running. You can also see the current Python and CherryPy versions (3.4.1 and 3.6.0 respectively in time of writing).

Nothing difficult really. I was just following breadcrumbs and putting together A and B. Also happy to see I can play with Python on different "places". 

[1]: http://www.cherrypy.org/
[2]: http://azure.microsoft.com/
[3]: http://azure.microsoft.com/en-us/services/websites/
[4]: http://azure.microsoft.com/en-us/services/storage/
[5]: http://docs.cherrypy.org/en/latest/advanced.html#wsgi-support
[6]: http://azure.microsoft.com/en-us/documentation/articles/web-sites-python-configure/
[7]: https://github.com/cincuranet/CherryPy_Azure
[8]: http://cherrypy.azurewebsites.net/
[9]: https://github.com/cincuranet/CherryPy_Azure/blob/master/ptvs_virtualenv_proxy.py
[10]: https://github.com/cincuranet/CherryPy_Azure/blob/master/web.config
[11]: https://github.com/cincuranet/CherryPy_Azure/blob/master/runtime.txt
[12]: https://github.com/cincuranet/CherryPy_Azure/blob/master/requirements.txt
[13]: https://github.com/cincuranet/CherryPy_Azure/blob/master/app.py