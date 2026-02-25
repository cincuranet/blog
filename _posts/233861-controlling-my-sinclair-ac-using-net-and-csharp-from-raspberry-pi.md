---
title: |-
  Controlling my Sinclair AC using .NET and C# (from Raspberry Pi)
date: 2021-05-10T06:00:00Z
tags:
  - IoT
  - Home Automation
---
As I speculated in my [previous post][2], I eventually decided to try the Wi-Fi option first, because I can try that right here and right now.

<!-- excerpt -->

My unit is _Sinclair ASH-09BIF2_ and the first step was connecting the module to home Wi-Fi. My original plan was to use the mobile app to do that and then block the unit from internet access on firewall. But the mobile app wanted me to sign in first, before doing anything and I didn't want to do that. 

#### Connect to Wi-Fi

The [repo with reverse engineered protocol][1] was a tremendous help in implementing the protocol my - opinionated - way. But for some reason I missed the description of how the initial connection to Wi-Fi is done. Luckily, I was able to find it somewhere else (and later in the repo as well).

It's pretty simple, the unit creates a Wi-Fi network with password `12345678`, you connect to it and send UDP packet to `192.168.1.1:7000`. The packet is just a plain text ` "{\"psw\": \"" + Password + "\",\"ssid\": \"" + SSID + "\",\"t\": \"wlan\"}"`, where `Password` and `SSID` should be self-descriptive values. After that the unit connects to new network and the old one is no longer available. Full C# code.

```csharp
static void Connect()
{
	const string SSID = "";
	const string Password = "";
	var endpoint = new IPEndPoint(IPAddress.Parse("192.168.1.1"), 7000);
	var message = "{\"psw\": \"" + Password + "\",\"ssid\": \"" + SSID + "\",\"t\": \"wlan\"}";
	var data = Encoding.UTF8.GetBytes(message);
	using var udp = new UdpClient();
	Console.WriteLine("Sending...");
	Console.WriteLine(message);
	if (udp.Send(data, data.Length, endpoint) != data.Length)
	{
		Console.WriteLine("ERROR");
		return;
	}
	Console.WriteLine("OK");
}
```

Worked like a charm for me and filled me with hope that my unit might be actually compatible with the reverse engineered protocol.

#### My protocol implementation

As I mentioned above, I have my own, mostly opinionated, idea how I want the methods, parameters, parsing, etc. and how it should be exposed. For example, in my setup I know the MAC and IP address in advance, hence I can skip some discovery dance.

The protocol is fairly simple, though bit weird to me. If you want to get full description, I strongly recommend checking the [repo][1], because it's really great.

For my usage I'm interested only in getting the unit's state and setting few variables. The rest is hardcoded (in case somebody would fiddle with the remote). 

My complete implementation follows. Let's check some parts that are worth mentioning.

```csharp
public class SinclairService
{
	public sealed record Status(Power Power, Mode Mode, int Temp, FanSpeed FanSpeed, SwingLeftRight SwingLeftRight, SwingUpDown SwingUpDown);
	public enum Power { Off, On }
	public enum Mode { Auto, Cool, Dry, Fan, Heat }
	public enum FanSpeed { Auto, Low, MediumLow, Medium, MediumHigh, High }
	public enum SwingLeftRight { Default, Full, FixedLeft, FixedMidLeft, FixedMid, FixedMidRight, FixedRight }
	public enum SwingUpDown { Default, Full, FixedTop, FixedMidTop, FixedMid, FixedMidBottom, FixedBottom, SwingBottom, SwingMidBottom, SwingMid, SwingMidTop, SwingTop }

	const string PowerKey = "Pow";
	const string ModeKey = "Mod";
	const string TempKey = "SetTem";
	const string TempUnitKey = "TemUn";
	const int TempUnitValueCelsius = 0;
	const string TempRecKey = "TempRec";
	const int TempRecValueNothing = 0;
	const string FanSpeedKey = "WdSpd";
	const string SwingLeftRightKey = "SwingLfRig";
	const string SwingUpDownKey = "SwUpDn";
	const string XFanKey = "Blo";
	const int XFanValueOff = 0;
	const string PlasmaKey = "Health";
	const int PlasmaValueOn = 1;
	const string SleepModeKey = "SwhSlp";
	const int SleepModeValueOff = 0;
	const string DisplayKey = "Lig";
	const int DisplayValueOff = 0;
	const string QuietKey = "Quiet";
	const int QuietValueOff = 0;
	const string TurboKey = "Tur";
	const int TurboValueOff = 0;
	const string AntiFreezingModeKey = "StHt";
	const int AntiFreezingModeValueOff = 0;
	const string EnergySavingModeKey = "SvSt";
	const int EnergySavingModeValueOff = 0;

	IPAddress _address;
	string _mac;
	string _key;

	public SinclairService()
	{ }

	public async Task Bind(IPAddress address, PhysicalAddress mac)
	{
		_address = address;
		_mac = mac.ToString().Replace(":", string.Empty).ToLowerInvariant();

		var pack = JsonConvert.SerializeObject(new
		{
			mac = _mac,
			t = "bind",
			uid = 0,
		});
		var message = JsonConvert.SerializeObject(new
		{
			cid = "app",
			i = 1,
			pack = Encryption.Encrypt(pack, Encryption.GenericKey),
			t = "pack",
			tcid = _mac,
			uid = 0,
		});
		var response = Response.Parse(await SendAndReceive(message, _address), Encryption.GenericKey);
		response.EnsureSuccess();
		_key = response.Pack.Value<string>("key");
	}

	public async Task<Status> ReadStatus()
	{
		var pack = JsonConvert.SerializeObject(new
		{
			cols = new[] { PowerKey, ModeKey, TempKey, FanSpeedKey, SwingLeftRightKey, SwingUpDownKey },
			mac = _mac,
			t = "status",
		});
		var message = JsonConvert.SerializeObject(new
		{
			cid = "app",
			i = 0,
			pack = Encryption.Encrypt(pack, _key),
			t = "pack",
			tcid = _mac,
			uid = 0,
		});
		var response = Response.Parse(await SendAndReceive(message, _address), _key);
		response.EnsureSuccess();
		var cols = response.Pack.Value<JArray>("cols").Values<string>();
		var dat = response.Pack.Value<JArray>("dat").Values<int>();
		var data = cols.Zip(dat).ToDictionary(x => x.First, x => x.Second);
		return new Status(
			(Power)data[PowerKey],
			(Mode)data[ModeKey],
			data[TempKey],
			(FanSpeed)data[FanSpeedKey],
			(SwingLeftRight)data[SwingLeftRightKey],
			(SwingUpDown)data[SwingUpDownKey]);
	}

	public async Task SetStatus(Status status)
	{
		var data = new Dictionary<string, int>()
		{
			{ PowerKey, (int)status.Power },
			{ ModeKey , (int)status.Mode },
			{ TempKey , status.Temp },
			{ TempUnitKey, TempUnitValueCelsius },
			{ TempRecKey, TempRecValueNothing },
			{ FanSpeedKey , (int)status.FanSpeed },
			{ SwingLeftRightKey , (int)status.SwingLeftRight },
			{ SwingUpDownKey , (int)status.SwingUpDown },
			{ XFanKey , XFanValueOff },
			{ PlasmaKey, PlasmaValueOn },
			{ SleepModeKey, SleepModeValueOff },
			{ DisplayKey, DisplayValueOff },
			{ QuietKey, QuietValueOff },
			{ TurboKey, TurboValueOff },
			{ AntiFreezingModeKey, AntiFreezingModeValueOff },
			{ EnergySavingModeKey, EnergySavingModeValueOff },
		};
		var pack = JsonConvert.SerializeObject(new
		{
			opt = data.Keys.ToList(),
			p = data.Values.ToList(),
			t = "cmd",
		});
		var message = JsonConvert.SerializeObject(new
		{
			cid = "app",
			i = 0,
			pack = Encryption.Encrypt(pack, _key),
			t = "pack",
			tcid = _mac,
			uid = 0,
		});
		var response = Response.Parse(await SendAndReceive(message, _address), _key);
		response.EnsureSuccess();
	}

	static async Task<string> SendAndReceive(string message, IPAddress address)
	{
		var data = Encoding.UTF8.GetBytes(message);
		using (var udp = new UdpClient())
		{
			var sent = await udp.SendAsync(data, data.Length, new IPEndPoint(address, 7000));
			if (sent != data.Length)
				throw new IOException($"Expected to send '{data.Length}' bytes, but only '{sent}' bytes sent.");
			var receive = await udp.ReceiveAsync();
			return Encoding.UTF8.GetString(receive.Buffer);
		}
	}

	sealed class Response
	{
		private Response()
		{ }

		public static Response Parse(string message, string key)
		{
			return new Response()
			{
				Pack = JObject.Parse(Encryption.Decrypt(JObject.Parse(message).Value<string>("pack"), key)),
			};
		}

		public JObject Pack { get; init; }

		public void EnsureSuccess()
		{
			if (Pack.Value<int>("r") != 200)
				throw new InvalidOperationException();
		}
	}

	static class Encryption
	{
		public static readonly string GenericKey = "a3K8Bx%2r8Y7#xDh";

		public static string Encrypt(string input, string key)
		{
			using (var aes = CreateAes(key))
			{
				var encryptor = aes.CreateEncryptor();
				var inputBuffer = Encoding.UTF8.GetBytes(input);
				var encrypted = encryptor.TransformFinalBlock(inputBuffer, 0, inputBuffer.Length);
				return Convert.ToBase64String(encrypted, Base64FormattingOptions.None);
			}
		}

		public static string Decrypt(string input, string key)
		{
			var encrypted = Convert.FromBase64String(input);
			using (var aes = CreateAes(key))
			{
				var decryptor = aes.CreateDecryptor();
				var decrypted = decryptor.TransformFinalBlock(encrypted, 0, encrypted.Length);
				return Encoding.UTF8.GetString(decrypted);
			}
		}

		static Aes CreateAes(string key)
		{
			var aes = Aes.Create();
			aes.BlockSize = 128;
			aes.KeySize = 256;
			aes.Key = Encoding.UTF8.GetBytes(key);
			aes.Mode = CipherMode.ECB;
			aes.Padding = PaddingMode.PKCS7;
			return aes;
		}
	}

	static void Connect()
	{
		const string SSID = "";
		const string Password = "";
		var endpoint = new IPEndPoint(IPAddress.Parse("192.168.1.1"), 7000);
		var message = "{\"psw\": \"" + Password + "\",\"ssid\": \"" + SSID + "\",\"t\": \"wlan\"}";
		var data = Encoding.UTF8.GetBytes(message);
		using var udp = new UdpClient();
		Console.WriteLine("Sending...");
		Console.WriteLine(message);
		if (udp.Send(data, data.Length, endpoint) != data.Length)
		{
			Console.WriteLine("ERROR");
			return;
		}
		Console.WriteLine("OK");
	}
}
```

I'm using new feature from C# 9 called records (record/class named `Status`). That allows me to have succinct _data object_ implementation and it feels like a great fit here.

Although I originally had all the messages created using plain string interpolation, it felt too fragile. Thus, I used _Newtonsoft.Json_ and kind of abused anonymous classes to together create the JSONs for sending. But with proper serialization instead of blindly composing strings.

#### Summary

Although the summer is not in full swing yet, I tried controlling the unit couple of times using my implementation, and everything seems to be running smooth from Raspberry Pi. The unit is fine without access to internet, no delays or anything. The few commands I'm sending are doing what I expect, and the responses are instantaneous. Overall, I call this a successful home automation project.

[1]: https://github.com/tomikaa87/gree-remote
[2]: {{ include "post_link" 233857 }}