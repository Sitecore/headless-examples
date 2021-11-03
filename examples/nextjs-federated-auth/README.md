# NextJsAndAzureB2C

| | |
|--|--|
| **Framework** | JavaScript Rendering SDK (Next.js) |
| **Sitecore Version** | 10.1 |
| **Author** | Sitecore |


## Description
This is a modifed version of the OOB starter template for NextJS which includes an example of how to use Azure B2C and next-auth together.

You can clone this repo and run it, alternatively here is a log of the changes from standard and some steps on how to test the solution.

Changes to platform code...

1. Added - App_Config\Include\Security
2. Added - AzureAdB2CIdentityProviderProcessor.cs
3. Added - OpenIdConnectCachingSecurityTokenProvider.cs
2. Add Sitecore.Owin.Authentication nuget package
3. Add Microsoft.Owin.Security.OpenIdConnect package
4. Fixed package.props and remove the version from the .proj file

Changes to rendering (React\NextJS) code...

- Added npm package next-auth
- Modified - page-props.ts
- Modified - page-props-factory.ts
- Add - rest-with-headers-layout-service.ts
- Add folder - pages\api\auth
- Make changes to use SSR 
- Modified - _app.tsx
- Modified - layout.tsx
- Add folder - types
- Add - Unauthorized.tsx
- Modified - .env

To deploy the solution

- Copy App_config from platform to .\docker\deploy\platform
- Copy platform dlls to .\docker\deploy\platform\bin (NextJsAndAzureB2C.dll)
- Watcher should deploy files to cm, otherwise rebuild CM

To test the solution

- Go to content editor, select the graphql route in the site (/sitecore/content/NextJsAndAzureB2C/home/graphql)
- Select security tab and select "require login", save, publish.
- From the renderings folder run jss start:connected
- Try go to localhost:3000\graphql, you will be presented with a "protected" page
- Sign in with Azure B2c from the login link on the home page
- try go to localhost:3000\graphql, it should work.

## About this Solution
This solution is designed to help developers learn and get started quickly
with Sitecore Containers, the Sitecore Next.js SDK, and Sitecore
Content Serialization.

For simplicity, this solution does not implement Sitecore Helix conventions for
solution architecture. As you begin building your Sitecore solution,
you should review [Sitecore Helix](https://helix.sitecore.net/) and the
[Sitecore Helix Examples](https://sitecore.github.io/Helix.Examples/) for guidance
on implementing a modular solution architecture.

## Configured for Sitecore-based workflow
On first run, the JSS Styleguide sample will be imported via `jss deploy items`, then serialized via `sitecore ser pull`. It is intended that you work directly in Sitecore to define templates and renderings, instead of using the code-first approach. This is also known as "Sitecore-first" JSS workflow. To support this:

* The JSS content workflow is disabled
* Imported items will not be marked as 'protected'
* JSS import warnings in the Content Editor and Experience Editor have been disabled

The code-first Sitecore definitions and routes remain in the JSS project, in case you wish to use them for local development / mocking. You can remove these from `/data` and `/sitecore` if desired. You may also wish to remove the [initial import logic in the `up.ps1` script](./up.ps1#L44).


## Support
The template output as provided is supported by Sitecore. Once changed or amended,
the solution becomes a custom implementation and is subject to limitations as
defined in Sitecore's [scope of support](https://kb.sitecore.net/articles/463549#ScopeOfSupport).

## Prerequisites
* NodeJs 14.x
* .NET Core 3.1 SDK
* .NET Framework 4.8 SDK
* Visual Studio 2019
* Docker for Windows, with Windows Containers enabled

See Sitecore Containers documentation for more information on system requirements.

## What's Included
* A `docker-compose` environment for a Sitecore XP0 topology
  with a Next.js rendering host.

  > The included `docker-compose.yml` is a stock XP0 environment from the Sitecore
  > Container Support Package. All changes/additions for this solution are included
  > in the `docker-compose.override.yml`.

* Scripted invocation of `jss create` and `jss deploy` to initialize a
  Next.js application.
* Sitecore Content Serialization configuration.
* An MSBuild project for deploying configuration and code into
  the Sitecore Content Management role. (see `src\platform`).

## How to run
1. If your local IIS is listening on port 443, you'll need to stop it.
   > This requires an elevated PowerShell or command prompt.
   ```
   iisreset /stop
   ```

1. Before you can run the solution, you will need to prepare the following
   for the Sitecore container environment:
   * A valid/trusted wildcard certificate for `*.nextjsandazureb2c.localhost`
   * Hosts file entries for `nextjsandazureb2c.localhost`
   * Required environment variable values in `.env` for the Sitecore instance
     * (Can be done once, then checked into source control.)

   See Sitecore Containers documentation for more information on these
   preparation steps. The provided `init.ps1` will take care of them,
   but **you should review its contents before running.**

   > You must use an elevated/Administrator Windows PowerShell 5.1 prompt for
   > this command, PowerShell 7 is not supported at this time.

    ```ps1
    .\init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "DesiredAdminPassword"
    ```

    If you check your `.env` into source control, other developers
    can prepare a certificate and hosts file entries by simply running:

    ```ps1
    .\init.ps1
    ```

    > Out of the box, this example does not include `.env` in the `.gitignore`.
    > Individual users may override values using process or system environment variables.
    > This file does contain passwords that would provide access to the running containers
    > in the developer's environment. If your Sitecore solution and/or its data are sensitive,
    > you may want to exclude these from source control and provide another
    > means of centrally configuring the information within.

1. If this is your first time using `mkcert` with NodeJs, you will
   need to set the `NODE_EXTRA_CA_CERTS` environment variable. This variable
   must be set in your user or system environment variables. The `init.ps1`
   script will provide instructions on how to do this.
    * Be sure to restart your terminal or VS Code for the environment variable
      to take effect.

1. After completing this environment preparation, run the startup script
   from the solution root:
    ```ps1
    .\up.ps1
    ```

1. When prompted, log into Sitecore via your browser, and
   accept the device authorization.

1. Wait for the startup script to open browser tabs for the rendered site
   and Sitecore Launchpad.

## Using the Solution
* A Visual Studio / MSBuild publish of the `Platform` project will update the running `cm` service.
* The running `rendering` service uses `next dev` against the mounted Next.js application, and will recompile automatically for any changes you make.
* You can also run the Next.js application directly using `npm` commands within `src\rendering`.
* Debugging of the Next.js application is possible by using the `start:connected` or `start` scripts from the Next.js `package.json`, and the pre-configured *Attach to Process* VS Code launch configuration.
* Review README's found in the projects and throughout the solution for additional information.
