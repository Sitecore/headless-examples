const express = require('express');
const compression = require('compression');
const scProxy = require('@sitecore-jss/sitecore-jss-proxy').default;
const getConfig = require('./config');
var vhost = require('vhost');
const cacheMiddleware = require('./cacheMiddleware');

const server = express();
const port = process.env.PORT || 3000;

// enable gzip compression for appropriate file types
server.use(compression());

// turn off x-powered-by http header
server.settings['x-powered-by'] = false;

// Serve static app assets from local /dist folder
server.use(
  '/dist',
  express.static('dist', {
    fallthrough: false, // force 404 for unknown assets under /dist
  })
);

/**
 * Output caching, can be enabled,
 * Read about restrictions here: {@link https://jss.sitecore.com/docs/techniques/performance/caching}
 */
// server.use(cacheMiddleware());

server.use((req, res, next) => {
  // because this is a proxy, all headers are forwarded on to the Sitecore server
  // but, if we SSR we only understand how to decompress gzip and deflate. Some
  // modern browsers would send 'br' (brotli) as well, and if the Sitecore server
  // supported that (maybe via CDN) it would fail SSR as we can't decode the Brotli
  // response. So, we force the accept-encoding header to only include what we can understand.
  if (req.headers['accept-encoding']) {
    req.headers['accept-encoding'] = 'gzip, deflate';
  }

  next();
})

/**
 * MULTISITE-UPDATE
 * Use vhost middleware to branch, and create an scProxy configuration for each host.
 */

var appOne = express();
const appOneConfig = getConfig(process.env.SITE_ONE_APP, process.env.SITE_ONE_SITE);
appOne.use('*', scProxy(appOneConfig.serverBundle.renderView, appOneConfig, appOneConfig.serverBundle.parseRouteUrl));
server.use(vhost(process.env.SITE_ONE_HOST, appOne));

var appTwo = express();
const appTwoConfig = getConfig(process.env.SITE_TWO_APP, process.env.SITE_TWO_SITE);
appTwo.use('*', scProxy(appTwoConfig.serverBundle.renderView, appTwoConfig, appTwoConfig.serverBundle.parseRouteUrl));
server.use(vhost(process.env.SITE_TWO_HOST, appTwo));

var appTwoAgain = express();
const appTwoAgainConfig = getConfig(process.env.SITE_TWO_B_APP, process.env.SITE_TWO_B_SITE);
appTwoAgain.use('*', scProxy(appTwoAgainConfig.serverBundle.renderView, appTwoAgainConfig, appTwoAgainConfig.serverBundle.parseRouteUrl));
server.use(vhost(process.env.SITE_TWO_B_HOST, appTwoAgain));

server.listen(port, () => {
  console.log(`server listening on port ${port}!`);
});
