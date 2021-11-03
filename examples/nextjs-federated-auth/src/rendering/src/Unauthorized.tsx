import Head from 'next/head';

/**
 * Rendered in case if we have 401 error
 */
const Unauthorized = (): JSX.Element => (
  <>
    <Head>
      <title>Protected</title>
    </Head>
    <div style={{ padding: 10 }}>
      <h1>This page is protected by the CMS</h1>
      <a href="/">Go to the Home page</a>
    </div>
  </>
);

export default Unauthorized;
