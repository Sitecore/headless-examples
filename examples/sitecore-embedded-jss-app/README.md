# Sitecore-embedded-jss-app

| | |
|--|--|
| **Framework** | JavaScript Rendering SDK |
| **Sitecore Version** | 10.2 |
| **Author** | Sitecore |

## Description
Demonstrates embedding a JSS React application within a non-JSS Sitecore site. Useful for sites where a full JS application is not desired, but smaller applications are still needed within a larger whole.

## Approach
This is a technique to allow a JSS app to run within a traditional Sitecore rendering. Doing this allows embedding a JSS app within an existing Sitecore MVC site, as opposed to as its own standalone site. This technique essentially embeds the JSS app's markup and app wrapper tag within a Sitecore rendering.

Compared to the [JavaScript Rendering Type](https://jss.sitecore.com/docs/techniques/mvc-integration/javascript-rendering), client-side embedding does not render the JSS app on the server. This is an advantage in terms of simplicity (and Node.js is not required to be installed), but a disadvantage in terms of SEO compatibility and app startup time.

Client-side embedding is a good technique to use for micro-applications and tools.

Examples of such tools might be:

- Product configurators
- Financial calculators
- Signup or other multi-step forms
- E-commerce functionality (cart, checkout)

Characteristics of such apps include:

- They are embedded in an existing/larger site
- SEO is not typically crucial for the app itself
- UX is often a multi-step / sequential process
- Often have a complicated UX that benefits from modern JavaScript frameworks

### The Embedded Wizard Sample
The Embedded Wizard sample app was created based on community feedback about common use cases for JSS. You may not wish to build your entire site using JSS -- rather just particular tools, wizards, calculators, etc. which have complicated UX and/or are primarily frontend-driven.

### Quick demo
You can view a quick [demo video of the sample here](https://content.jwplatform.com/players/TXj7tyzZ-L8PurT2K.html).

## How to run

### Prerequisites
* NodeJs 14.x
* .NET Core 3.1 SDK
* Docker for Windows, with Windows Containers enabled

See Sitecore Containers documentation for more information on system requirements.

### Initialize

Open a PowerShell administrator prompt and run the following command, replacing the `-LicenseXmlPath` with the location of your Sitecore license file.

```ps1
.\init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "DesiredAdminPassword"
```

This will perform any necessary preparation steps, such as populating the Docker Compose environment (.env) file, configuring certificates, and adding hosts file entries.

If this is your first time using `mkcert` with NodeJs, you will
need to set the `NODE_EXTRA_CA_CERTS` environment variable. This variable
must be set in your user or system environment variables. The `init.ps1`
script will provide instructions on how to do this.
  * Be sure to restart your terminal or VS Code for the environment variable
    to take effect.

If your local IIS is listening on port 443, you'll need to stop it.
```
iisreset /stop
```

### Start Sitecore and deploy the JSS example app

Next run the following command.

```ps1
.\up.ps1
```

This will download any required Docker images, build the Sitecore runtime images, start the containers, and then deploy the JSS example application.

When prompted, log into Sitecore via your browser, and accept the device authorization.

Once complete, the startup script will open browser tabs for [Sitecore Launchpad](https://cm.sitecore-embedded-jss-app.localhost/sitecore) and the [rendered site](https://cm.sitecore-embedded-jss-app.localhost).

The rendered site is the out-of-the-box `/sitecore/content/Home` item modified to include the `EmbeddedWizard.ascx` Sublayout. You should see the JSS wizard app embedded in the Sitecore sample home.

![Embedded Wizard app integrated](/assets/img/wizard-integrated.png)

> Note: this technique works equally well with Sitecore MVC. This example uses Web Forms only for easy compatibility with the default Sitecore site.

You can also browse to https://cm.sitecore-embedded-jss-app.localhost/EmbeddedWizard/Wizard to see the app running independently in Integrated Mode.

![Embedded Wizard app integrated](/assets/img/wizard_success.png)

You can open the Sitecore Content Editor and find the app installed at `/sitecore/content/Home/EmbeddedWizard`.

![Embedded Wizard app deployed](/assets/img/wizard-app-deployed-items.png)

### Stop Sitecore

When you're done, stop and remove the containers using the following command.

```
docker-compose down
```

## How it Works

### App Embedding

- The `client.js` of the app uses `react-dom` to render the app on a page element with the id `wizard-app`.
- The `EmbeddedWizard.ascx` Sublayout simply adds a div with that id to the page, and adds the needed scripts and styles to the page.
    - In an MVC implementation, this could easily become a View Rendering.
    - If you have a lot of apps and want to provide control to a content author, you could create your own "registry" of apps (with their DOM id's) and allow the content author to choose which app to embed.
- In your implementation, if you don't want to globally include the scripts and styles for your JSS app(s), you'll want to use some mechanism to include them dynamically based on presence of the rendering, such as the Assets module in Sitecore Habitat. This approach is described in the Helix design priciples.

### Wizard Steps
- The sample uses the react-stepzilla module to provide a step-based UX.
- Each step is a separate JSS route to provide for easier management/editing via the Experience Editor.
- The `Wizard` component "creatively" uses a `StepReference` component to allow steps to be managed via the Experience Editor, but then when rendering for the front-end, uses the component data to construct the step data expected by `react-stepzilla`.
- The `Step` component loads the referenced route from the Layout Service as each step is displayed.
  - This means that each step will register in analytics as it is displayed as well.
- Step uses the same placeholder name as App, so that step contents can be rendered directly in the `App` as well (i.e. in the Experience Editor).
