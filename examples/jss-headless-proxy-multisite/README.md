# JSS Headless Proxy Multisite

| | |
|--|--|
| **Framework** | Headless Proxy using React |
| **Sitecore Version** | 10.2 |
| **Author** | Sitecore |

## Description
This example shows how to use virtual hosting with the express [vhost](http://expressjs.com/en/resources/middleware/vhost.html) middleware to support multiple JSS sites in the same Headless Proxy instance. It demonstrates sitse can use different application bundles, and sharing a bundle.

## Approach
* Adds `vhost` to the Headless Proxy.
* Makes the Headless Proxy configuration dynamic.
* Makes a small change to the application itself to ensure that client-side route changes send the correct site name to the Layout Service.

Search the example for `MULTISITE-UPDATE` comments to find all relevant changes.

## Limitations / Considerations
We have not done performance testing on the proxy in a multi-site configuration. You should validate that your applications perform well co-existing in the same node instance.

## How to run
Running this example requires Windows and Docker.

1. `.\init.ps1 -InitEnv -AdminPassword b -LicenseXmlPath <license xml path>`
1. `.\up.ps1`