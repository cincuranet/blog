---
title: "TcpListener and TcpClient (an easy-to-use example)"
date: 2005-06-21T11:22:00Z
tags:
  - .NET
redirect_from: /id/6188
category: none
layout: post
---
> [Follow up post available.][1]

During the weekend I needed some tool: Have to be able to listen on some port and to do something "useful". First I was trying to use sockets. But I've found useful classes: `TcpListener` and `TcpClient`. It was exactly what I was looking for. Here you can "taste" the example.

<pre class="brush:csharp">
using System;
using System.Net.Sockets;
using System.Net;
using System.IO;
using System.Threading;

namespace port_listen
{
  class MainClass
  {
    public static void Main(string[] args)
    {
      Console.WriteLine("Starting...");
      TcpListener server = new TcpListener(IPAddress.Parse("0.0.0.0"), 66);
      server.Start();
      Console.WriteLine("Started.");
      while (true)
      {
        ClientWorking cw = new ClientWorking(server.AcceptTcpClient());
        new Thread(new ThreadStart(cw.DoSomethingWithClient)).Start();
      }
      server.Stop();
    }
  }

  class ClientWorking
  {
    private Stream ClientStream;
    private TcpClient Client;

    public ClientWorking(TcpClient Client)
    {
      this.Client = Client;
      ClientStream = Client.GetStream();
    }

    public void DoSomethingWithClient()
    {
      StreamWriter sw = new StreamWriter(ClientStream);
      StreamReader sr = new StreamReader(sw.BaseStream);
      sw.WriteLine("Hi. This is x2 TCP/IP easy-to-use server");
      sw.Flush();
      string data;
      try
      {
        while ((data = sr.ReadLine()) != "exit")
        {
          sw.WriteLine(data);
          sw.Flush();
        }
      }
      finally
      {
        sw.Close();
      }
    }
  }
}
</pre>

[1]: {{ site.url }}{% post_url 2014-07-22-233470-tcplistener-and-tcpclient-an-easy-to-use-example %}