# Sitecore-embedded-jss-app

| | |
|--|--|
| **Framework** | JavaScript Headless JSS |
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

### Demo
The Embedded Wizard sample app was created based on community feedback about common use cases for JSS. You may not wish to build your entire site using JSS -- rather just particular tools, wizards, calculators, etc. which have complicated UX and/or are primarily frontend-driven.

[Embedded Wizard Sample Demo](https://jss.sitecore.com/docs/techniques/mvc-integration/client-side-embedding0)

## How to run
**First** run `npm i` to install dependencies.

**Second**, if you have not already, install the JSS CLI: `npm install -g @sitecore-jss/sitecore-jss-cli`. Then choose how to run the application:

### Deploying to Sitecore

* Install the Headless server components on your local Sitecore installation according to the JSS documentation
* `jss setup` to configure the connection to a local Sitecore installation
* Review the application config patch file in `sitecore/config` to ensure that it is configured appropriately for your Sitecore installation.
* `jss deploy config` to deploy the Sitecore config patch file to the Sitecore instance (you may need to add the `hostName` to your `hosts` file)
* Use `jss deploy package` to deploy the sample to Sitecore
* Visit `$sitecoreHost/EmbeddedWizard/Wizard` to see the demonstration running in Sitecore

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
