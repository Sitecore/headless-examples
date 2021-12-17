# escape=`

ARG PARENT_IMAGE
ARG SOLUTION_IMAGE
ARG NODEJS_IMAGE
ARG TOOLS_IMAGE
ARG MANAGEMENT_SERVICES_IMAGE
ARG HEADLESS_SERVICES_IMAGE

FROM ${SOLUTION_IMAGE} as solution
FROM ${NODEJS_IMAGE} as nodejs
FROM ${TOOLS_IMAGE} as tools
FROM ${MANAGEMENT_SERVICES_IMAGE} AS management_services
FROM ${HEADLESS_SERVICES_IMAGE} AS headless_services
FROM ${PARENT_IMAGE}

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# Add node.js for JSS integrated mode / Experience Editor
COPY --from=nodejs c:\node c:\node
RUN SETX /M PATH $env:PATH`;C:\node

WORKDIR C:\inetpub\wwwroot

# Copy developer tools and entrypoint
COPY --from=tools C:\tools C:\tools

# Copy the Sitecore Management Services Module
COPY --from=management_services C:\module\cm\content C:\inetpub\wwwroot

# Copy and init the JSS / Headless Services Module
COPY --from=headless_services C:\module\cm\content C:\inetpub\wwwroot
COPY --from=headless_services C:\module\tools C:\module\tools
RUN C:\module\tools\Initialize-Content.ps1 -TargetPath C:\inetpub\wwwroot; `
    Remove-Item -Path C:\module -Recurse -Force;

# Copy solution website files
COPY --from=solution /artifacts/sitecore/ ./
COPY --from=solution /artifacts/site-one ./dist/site-one
COPY --from=solution /artifacts/site-two ./dist/site-two