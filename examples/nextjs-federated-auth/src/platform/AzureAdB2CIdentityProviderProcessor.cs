using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using Sitecore.Owin.Authentication.Configuration;
using Sitecore.Owin.Authentication.Pipelines.IdentityProviders;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Logging;
using Sitecore.Owin.Authentication.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Infrastructure;
using Sitecore.Abstractions;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.Jwt;
using Sitecore.Examples.Security.AzureB2C.Pipelines.IdentityProvider;

namespace Sitecore.Examples.Security.AzureB2C
{
    public class AzureAdB2CIdentityProviderProcessor : IdentityProvidersProcessor
    {

        // App config settings
        public static string ClientId = Sitecore.Configuration.Settings.GetSetting("B2C_ApplicationId");
        public static string AadInstance = Sitecore.Configuration.Settings.GetSetting("B2C_AADInstance");
        public static string Tenant = Sitecore.Configuration.Settings.GetSetting("B2C_Tenant");

        // B2C policy identifiers
        public static string SignUpSignInPolicyId = Sitecore.Configuration.Settings.GetSetting("B2C_SignInUpPolicy");
        public static string MetadataEndPoint = Sitecore.Configuration.Settings.GetSetting("B2C_MetadataEndPoint");
        public static string DefaultPolicy = SignUpSignInPolicyId;

        // Authorities
        public static string Authority = string.Format(AadInstance, Tenant, DefaultPolicy);

        public AzureAdB2CIdentityProviderProcessor(FederatedAuthenticationConfiguration federatedAuthenticationConfiguration, ICookieManager cookieManager, BaseSettings settings) 
            : base(federatedAuthenticationConfiguration, cookieManager, settings)
        {
        }

        protected override string IdentityProviderName => "xp0.azureAD.B2C";

        protected override void ProcessCore(IdentityProvidersArgs args)
        {
            //DO NOT ENABLE THIS FOR PROD, DEBUG ONLY
            IdentityModelEventSource.ShowPII = true;

            var identityProvider = GetIdentityProvider();
            var authenticationType = GetAuthenticationType();

            var tvps = new TokenValidationParameters
            {
                AuthenticationType = SignUpSignInPolicyId,
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateLifetime = true,
                ValidAudience = ClientId,
                
                //NameClaimType = "http://schemas.microsoft.com/identity/claims/objectidentifier",
                NameClaimType = "emails"
            };

            args.App.UseOAuthBearerAuthentication(
                new OAuthBearerAuthenticationOptions
                {
                    AccessTokenFormat = new JwtFormat(tvps, new OpenIdConnectCachingSecurityTokenProvider(MetadataEndPoint)),
                    
                    Provider = new OAuthBearerAuthenticationProvider()
                    {
                        OnRequestToken = (context) =>
                        {
                            return Task.FromResult(0);
                        },
                        OnValidateIdentity = (context) =>
                        {
                            var identity = context.Ticket.Identity;

                            foreach (var claimTransformationService in identityProvider.Transformations)
                            {
                                claimTransformationService.Transform(identity,
                                new TransformationContext(FederatedAuthenticationConfiguration, identityProvider));

                            }

                            context.Validated(new AuthenticationTicket(identity, context.Ticket.Properties));
                            return Task.FromResult(0);
                        }
                    }
                });
        }
    }
}
