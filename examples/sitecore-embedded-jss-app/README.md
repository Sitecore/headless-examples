# _Example Name Here_

| | |
|--|--|
| **Framework** | _JavaScript Framework ( ASP.NET Core_) |
| **Sitecore Version** |  |
| **Author** | 

## Description
Demonstrates embedding a JSS React application within a non-JSS Sitecore site. Useful for sites where a full JS application is not desired, but smaller applications are still needed within a larger whole.

## Approach
_A more detailed overview of the contents/architecture of the example, to help developers understand how it works._

This is a technique to allow a JSS app to run within a traditional Sitecore rendering. Doing this allows embedding a JSS app within an existing Sitecore MVC site, as opposed to as its own standalone site. This technique essentially embeds the JSS app's markup and app wrapper tag within a Sitecore rendering.

Compared to the JavaScript Rendering Type, client-side embedding does not render the JSS app on the server. This is an advantage in terms of simplicity (and Node.js is not required to be installed), but a disadvantage in terms of SEO compatibility and app startup time.

Client-side embedding is a good technique to use for micro-applications and tools.

Examples of such tools might be:

- Product configurators
- Financial calculators
- Signup or other multi-step forms
- E-commerce functionality (cart, checkout)
- Characteristics of such apps include:

They are embedded in an existing/larger site
SEO is not typically crucial for the app itself
UX is often a multi-step / sequential process
Often have a complicated UX that benefits from modern JavaScript frameworks


## Limitations / Considerations
_Optional, note any scenarios in which the approach in this example may not meet developer requirements._

## How to run
**First** run `npm i` to install dependencies.

**Second**, if you have not already, install the JSS CLI: `npm install -g @sitecore-jss/sitecore-jss-cli`. Then choose how to run the application:

## Deploying to Sitecore

* Install the Headless server components on your local Sitecore installation according to the JSS documentation
* `jss setup` to configure the connection to a local Sitecore installation
* Review the application config patch file in `sitecore/config` to ensure that it is configured appropriately for your Sitecore installation.
* `jss deploy config` to deploy the Sitecore config patch file to the Sitecore instance (you may need to add the `hostName` to your `hosts` file)
* Use `jss deploy package` to deploy the sample to Sitecore
* Visit `$sitecoreHost/EmbeddedWizard/Wizard` to see the demonstration running in Sitecore
