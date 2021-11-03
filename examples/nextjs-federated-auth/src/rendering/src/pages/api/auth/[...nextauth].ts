import NextAuth from "next-auth"
import Providers from "next-auth/providers"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    /*Providers.IdentityServer4({
      id: "demo-identity-server",
      name: "SIS using Sitecore or Gateway",
      scope: "openid sitecore.profile sitecore.profile.api",
      domain: process.env.IdentityServer4_Domain,
      clientId: process.env.IdentityServer4_CLIENT_ID,
      clientSecret: process.env.IdentityServer4_CLIENT_SECRET,
      protection: "pkce"
    }),*/
    Providers.AzureADB2C({
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      scope: 'offline_access openid',
      tenantId: process.env.AZURE_TENANT_ID,
      accessTokenUrl: `https://${process.env.AUTH_TENANT_NAME}.b2clogin.com/${process.env.AUTH_TENANT_NAME}.onmicrosoft.com/${process.env.USER_FLOW}/oauth2/v2.0/token`,
      // requestTokenUrl: `https://login.microsoftonline.com/${process.env.AUTH_TENANT_GUID}/oauth2/v2.0/token`,
      authorizationUrl: `https://${process.env.AUTH_TENANT_NAME}.b2clogin.com/${process.env.AUTH_TENANT_NAME}.onmicrosoft.com/${process.env.USER_FLOW}/oauth2/v2.0/authorize?response_type=code+id_token&response_mode=form_post`,
      profileUrl: 'https://graph.microsoft.com/oidc/userinfo',
      idToken: true,
      state: false,  
      protection: "none",  
    }),
   /* Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    Providers.Auth0({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),*/
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  database: process.env.DATABASE_URL,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
    // If you want to use some key format other than HS512 you can specify custom options to use
    // when verifying (note: verificationOptions should include a value for maxTokenAge as well).    
    //encode: encodeToken,
    //decode: decodeToken,    
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn(user, account, profile) { 

      if (!account?.id && profile.oid && typeof profile.oid === "string")  {
        account.id = profile.oid as string;
      }

      if(profile.given_name && typeof profile.given_name === "string")
        user.name =  profile.given_name as string;

      if(profile.emails && Array.isArray(profile.emails))
        user.email = profile.emails.length ? profile.emails[0] : null;

      return true 
    },
    // async redirect(url, baseUrl) { return baseUrl },
    // async session(session, user) { return session },
    // async jwt(token, user, account, profile, isNewUser) { return token }
    async jwt(token, user, account, profile, isNewUser) {
      // Add id_token to the token right after signin
      if (account?.id_token) {
        token.id_token = account.id_token || "";
      }
      return token
    },
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      if (token?.id_token) {
        session.id_token = token.id_token || "";
      }
      return session
    }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: true,
})


