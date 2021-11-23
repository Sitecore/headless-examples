# Sitecore Headless Samples and Examples
This repository provides Sitecore and community-developed examples of various implementation and integration scenarios utilizing Sitecore Headless SDKs. While Sitecore already provides official boilerplate and samples for these frameworks, questions about how to do X or Y often come up in community channels. The aim for this repository is to build a library of samples to help address these questions and provide a reference for Sitecore developers.

## Where can I learn more about Sitecore Headless SDKs?
* [Sitecore JavaScript Rendering SDK](https://doc.sitecore.com/en/developers/hd/190/sitecore-headless-development/sitecore-javascript-rendering-sdks--jss-.html)
* [Sitecore ASP.NET Core Rendering SDK](https://doc.sitecore.com/en/developers/hd/190/sitecore-headless-development/sitecore-asp-net-rendering-sdk.html)
* [Sitecore Headless Development](https://doc.sitecore.com/en/developers/hd/190/sitecore-headless-development/index-en.html)

## Are these examples supported by Sitecore?
Example code in this repository is not supported by Sitecore Product Support Services. Please do not submit support tickets regarding these examples.

Individual samples are supported on GitHub by their contributors (from Sitecore or the community) but are not necessarily expected to be upgraded/updated with each release, and generally are provided as-is for you to learn from and adapt to your requirements.

## Contributing
We most definitely welcome new examples!

* Examples should be submitted via pull request.
* If you submit a new example, _please be prepared to support it_. If you are tagged on a GitHub issue or PR related to your example, please respond to it.
* New examples should demonstrate usage of Sitecore JavaScript or ASP.NET Core Rendering SDKs, or other methods of consuming Sitecore content headlessly, and should be placed in the `examples` folder.
* Use the [`examples\README.template.md`](examples/README.template.md) as a base for your example's `README.md`, and fill it out completely.
* Be sure your PR also includes an update to this README with a link to your new example.
* Your example should use Sitecore Containers and should require as few steps as possible to get up and running. Alternatively, JavaScript-based examples can utilize "disconnected mode" / mock Sitecore services.
* You should simplify and remove as much boilerplate code as you can from your example, so that developers can easily see the implementation/integration scenario you are trying to demonstrate.
* Sitecore reserves the right to decline examples, but don't let this discourage you. Submit issues or inquire on the [#headless](https://sitecorechat.slack.com/archives/C7JT0NRQW) channel of [Sitecore Community Slack](https://sitecore.chat/) if you want to validate an idea first.

## Contents and Contributors

* [Embedded JSS App](examples/sitecore-embedded-jss-app) ([@Sitecore/jss](https://github.com/orgs/Sitecore/teams/jss))
* [Federated Auth - Next.js](examples/nextjs-federated-auth) ([@websterian](https://github.com/websterian))