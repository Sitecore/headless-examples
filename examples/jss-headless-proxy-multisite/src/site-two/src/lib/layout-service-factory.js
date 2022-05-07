import { RestLayoutService } from '@sitecore-jss/sitecore-jss-react';
import config from '../temp/config';

export class LayoutServiceFactory {
  /**
   * MULTISITE-UPDATE
   * Allow overriding the site name passed into the Layout Service
   */
  create(siteName) {
    /**
     * MULTISITE-UPDATE
     * Use an environment variable set at build time to ensure the current
     * host name is used for client-side Layout Service requests.
     * https://create-react-app.dev/docs/adding-custom-environment-variables/
     */
    const isProxy = process.env.REACT_APP_IS_PROXY === 'true';
    const apiHost = isProxy ? window.location.origin : config.sitecoreApiHost;

    return new RestLayoutService({
      apiHost: apiHost,
      apiKey: config.sitecoreApiKey,
      siteName: siteName || config.jssAppName,
      configurationName: 'default',
    });
  }
}

export const layoutServiceFactory = new LayoutServiceFactory();
