import { AxiosDataFetcher, AxiosDataFetcherConfig, RestLayoutService, RestLayoutServiceConfig, LayoutServiceData} from '@sitecore-jss/sitecore-jss-nextjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { getSession } from 'next-auth/client';

export class RestLayoutWithHeadersService extends RestLayoutService{
    constructor(serviceConfig: RestLayoutServiceConfig) {
        super(serviceConfig);
    }
}

export  const  getDefaultFetcherWithHeaders = <T>(req?: IncomingMessage, res?: ServerResponse) => {
    const config = {
        //debugger: debug.layout,
    } as AxiosDataFetcherConfig;
    if (req && res) {
        config.onReq = setupRequestHeaders(req);
        config.onRes = setupResponseHeaders(res);
    }
    const axiosFetcher = new AxiosDataFetcher(config);

    const fetcher = (url: string, data?: unknown) => {
        return axiosFetcher.fetch<T>(url, data);
    };
    return fetcher;
};

/**
 * Setup request headers
 * @param {IncomingMessage} req
 * @returns {AxiosRequestConfig} axios request config
 */
 function setupRequestHeaders(req: IncomingMessage) {
    return  async (reqConfig: AxiosRequestConfig) => {        
        //We dont want the nextauth.js token we want the toekn from the provider
        //if(req && req.headers && req.headers.cookie)
        //    token = getCookie(req.headers.cookie, 'next-auth.session-token');

        var token: string = "";
        const session = await getSession({req});
        if(session && session.id_token && typeof session.id_token === "string")
            token = session.id_token;

        reqConfig.headers.common = {
        ...reqConfig.headers.common,
        ...(req.headers.cookie && { cookie: req.headers.cookie }),
        ...(req.headers.referer && { referer: req.headers.referer }),
        ...(req.headers['user-agent'] && { 'user-agent': req.headers['user-agent'] }),
        ...(req.connection.remoteAddress && { 'X-Forwarded-For': req.connection.remoteAddress }),
        ...(token && token != "" && { 'authorization': 'Bearer ' + token }),
        };

        return reqConfig;
    };
}

/**
 * Setup response headers based on response from layout service
 * @param {ServerResponse} res
 * @returns {AxiosResponse} response
 */
function setupResponseHeaders(res: ServerResponse) {
    return (serverRes: AxiosResponse) => {
        //debug.layout('performing response header passing');
        serverRes.headers['set-cookie'] &&
        res.setHeader('set-cookie', serverRes.headers['set-cookie']);
        return serverRes;
    };
}

