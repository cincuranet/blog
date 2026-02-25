---
title: |-
  Simple WebSocket client and server application using .NET
date: 2022-01-24T08:00:00Z
tags:
  - .NET
  - ASP.NET Core
  - WebSocket
---
Couple months back when teaching a course in Gopas, colleague William Ischanoe came to me and asked me, whether it would be possible to create a simple WebSocket server (and later client) in .NET. As far as I understood he wanted to use it to command process on victim's computer (as he's an expert in hacking and security). Might be useful for others as well, therefore I'm posting it here.

<!-- excerpt -->

Let's start with a server. I'm using here .NET 6 and ASP.NET Core, nothing extra is needed. It's really a barebone application, without any bells and whistles.

```csharp
Console.Title = "Server";
var builder = WebApplication.CreateBuilder();
builder.WebHost.UseUrls("http://localhost:6666");
var app = builder.Build();
app.UseWebSockets();
app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using (var webSocket = await context.WebSockets.AcceptWebSocketAsync())
        {
            while (true)
            {
                await webSocket.SendAsync(Encoding.ASCII.GetBytes($"Test - {DateTime.Now}"), WebSocketMessageType.Text, true, CancellationToken.None);
                await Task.Delay(1000);
            }
        }
    }
    else
    {
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
    }
});
await app.RunAsync();
```

The `/ws` endpoint is where the WebSocket communication happens, in this case simply sending a `$"Test - {DateTime.Now}"` string every second.

The client is similarly simple. Just opening the connection (without any error handling 8-)) and reading into predefined fixed buffer (in a real world the usage of `EndOfMessage` property is good idea) until the connection is closed.

```csharp
Console.Title = "Client";
using (var ws = new ClientWebSocket())
{
    await ws.ConnectAsync(new Uri("ws://localhost:6666/ws"), CancellationToken.None);
    var buffer = new byte[256];
    while (ws.State == WebSocketState.Open)
    {
        var result = await ws.ReceiveAsync(buffer, CancellationToken.None);
        if (result.MessageType == WebSocketMessageType.Close)
        {
            await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, null, CancellationToken.None);
        }
        else
        {
            Console.WriteLine(Encoding.ASCII.GetString(buffer, 0, result.Count));
        }
    }
}
```

And that's it. It is really easy to do it nowadays with .NET.

I don't know how he ended up using the code, but if you see him doing a session hacking a computer and commanding it via WebSocket connection, the communication is probably built on top of this code. :)
