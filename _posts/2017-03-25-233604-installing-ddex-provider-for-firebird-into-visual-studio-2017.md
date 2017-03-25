---
title: |
  Installing DDEX provider for Firebird into Visual Studio 2017
date: 2017-03-25T05:55:00Z
tags:
  - .NET
  - Databases in general
  - Firebird
  - Visual Studio
layout: post
---
Visual Studio hit the shelves few weeks ago and it would be nice to install DDEX provider into it, isn't it? Sadly, with the revamped setup experience some changes in configuration inside also came. Thus it's going to be manual process for now. I know there's an installer program for DDEX, but it's going to take some time before it's updated - I'm doing this in my free time and it's all about priorities (unless somebody with $$$ prioritizes its own request). Let's get into it.

<!-- excerpt -->

Before the Visual Studio stored its configuration in registry in `HKLM` and `HKCU`. Not anymore. Now the configuration in stored in private registry. It's the `privateregistry.bin` file in `%AppData%\Local\Microsoft\VisualStudio\15.0_<something>`. The rest is the same as previous versions.

You can still use the installer and just do the last step or you can copy the `FirebirdSql.VisualStudio.DataTools.dll` and `FirebirdSql.VisualStudio.DataToolsUI.dll` and modify the `machine.config`/`devenv.exe.config` [yourself][1] and then do this last step.

Open `regedit` and load the `privateregistry.bin` file using the `File > Load Hive...` menu and load it i.e. into `HKEY_USERS` under some name. I'll use `VS2017PrivateRegistry` here. Take a copy of [`FirebirdDDEXProvider64.reg`][2] (or [`FirebirdDDEXProvider32.reg`][3]) and change the registry paths `HKEY_CURRENT_USER\Software\Microsoft\VisualStudio\14.0_Config` to `HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config`. Don't forget to properly change the `%Path%` variable too in this file. At the end, it might look like this.

```text
Windows Registry Editor Version 5.00

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataSources\{2979569E-416D-4DD8-B06B-EBCB70DE7A4E}]
@="Firebird Data Source"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataSources\{2979569E-416D-4DD8-B06B-EBCB70DE7A4E}\SupportingProviders\{92421248-F044-483A-8237-74C7FBC62971}]

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}]
@=".NET Framework Data Provider for Firebird"
"DisplayName"="Provider_DisplayName, FirebirdSql.VisualStudio.DataTools.Properties.Resources"
"ShortDisplayName"="Provider_ShortDisplayName, FirebirdSql.VisualStudio.DataTools.Properties.Resources"
"Description"="Provider_Description, FirebirdSql.VisualStudio.DataTools.Properties.Resources"
"CodeBase"="C:\\Program Files (x86)\\FirebirdDDEX\\FirebirdSql.VisualStudio.DataTools.dll"
"InvariantName"="FirebirdSql.Data.FirebirdClient"
"Technology"="{77AB9A9D-78B9-4ba7-91AC-873F5338F1D2}"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}\SupportedObjects]

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}\SupportedObjects\DataConnectionSupport]
@="FirebirdSql.VisualStudio.DataTools.FbDataConnectionSupport"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}\SupportedObjects\DataConnectionProperties]
@="FirebirdSql.VisualStudio.DataTools.FbDataConnectionProperties"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}\SupportedObjects\DataConnectionUIControl]
@="FirebirdSql.VisualStudio.DataTools.FbDataConnectionUIControl"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}\SupportedObjects\DataSourceInformation]
@="FirebirdSql.VisualStudio.DataTools.FbDataSourceInformation"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}\SupportedObjects\DataObjectSupport]
@="FirebirdSql.VisualStudio.DataTools.FbDataObjectSupport"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\DataProviders\{92421248-F044-483A-8237-74C7FBC62971}\SupportedObjects\DataViewSupport]
@="FirebirdSql.VisualStudio.DataTools.FbDataViewSupport"

[HKEY_USERS\VS2017PrivateRegistry\Software\Microsoft\VisualStudio\15.0_21a5f3d6_Config\Services\{AEF32AEC-2167-4438-81FF-AE6603341536}]
@="{8d9358ba-ccc9-4169-9fd6-a52b8aee2d50}"
"Name"="Firebird Provider Object Factory"
```

Merge this file using regedit and then unload the hive.

That's it and you can enjoy DDEX for Firebird in Visual Studio 2017.

![DDEX for Firebird in Visual Studio 2017](/i/233604/ddex_vs2017.png)

> I'm planning to change the DDEX provider from installer, which was acceptable with Visual Studio 2005 (yes, you can still use it there), to VSIX. That will not only make easier to install but also easier to manage. Because my free time is limited it's not going to be immediate (you can [help][4]). 

[1]: https://raw.githubusercontent.com/cincuranet/FirebirdSql.Data.FirebirdClient/master/DDEX/readme.txt
[2]: https://raw.githubusercontent.com/cincuranet/FirebirdSql.Data.FirebirdClient/master/DDEX/reg_files/VS2015/FirebirdDDEXProvider64.reg
[3]: https://raw.githubusercontent.com/cincuranet/FirebirdSql.Data.FirebirdClient/master/DDEX/reg_files/VS2015/FirebirdDDEXProvider32.reg
[4]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/pulls