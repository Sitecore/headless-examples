# escape=`

# This Dockerfile will build the Sitecore solution and save the build artifacts for use in
# other images, such as 'cm' and 'rendering'. It does not produce a runnable image itself.

ARG BUILD_IMAGE
ARG NODEJS_IMAGE

# In a separate image (as to not affect layer cache), gather all NuGet-related solution assets, so that
# we have what we need to run a cached NuGet restore in the next layer:
# https://stackoverflow.com/questions/51372791/is-there-a-more-elegant-way-to-copy-specific-files-using-docker-copy-to-the-work/61332002#61332002
# This technique is described here:
# https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-3.1#the-dockerfile-1
FROM ${BUILD_IMAGE} AS nuget-prep
SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]
COPY *.sln nuget.config Directory.Build.targets Packages.props /nuget/
COPY src/ /temp/
RUN Invoke-Expression 'robocopy C:/temp C:/nuget/src /s /ndl /njh /njs *.csproj *.scproj packages.config'

FROM ${NODEJS_IMAGE} AS nodejs
FROM ${BUILD_IMAGE} AS builder
ARG BUILD_CONFIGURATION


# MULTISITE-UPDATE
# Since we are building in containers, set this environment variable
ARG REACT_APP_IS_PROXY
ENV REACT_APP_IS_PROXY $REACT_APP_IS_PROXY

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# Add node.js for JSS builds
COPY --from=nodejs c:\node c:\node
RUN SETX /M PATH $env:PATH`;C:\node

# Ensure updated nuget. Depending on your Windows version, dotnet/framework/sdk:4.8 tag may provide an outdated client.
# See https://github.com/microsoft/dotnet-framework-docker/blob/1c3dd6638c6b827b81ffb13386b924f6dcdee533/4.8/sdk/windowsservercore-ltsc2019/Dockerfile#L7
ENV NUGET_VERSION 5.8.1
RUN Invoke-WebRequest "https://dist.nuget.org/win-x86-commandline/v$env:NUGET_VERSION/nuget.exe" -UseBasicParsing -OutFile "$env:ProgramFiles\NuGet\nuget.exe"

WORKDIR /build

# Copy prepped NuGet artifacts, and restore as distinct layer to take advantage of caching.
COPY --from=nuget-prep ./nuget ./

# Restore NuGet packages
RUN nuget restore -Verbosity quiet

# Copy remaining source code
COPY src/ ./src/

# Build the Sitecore main platform artifacts
RUN msbuild .\src\platform\Platform.csproj /p:Configuration=$env:BUILD_CONFIGURATION /m /p:DeployOnBuild=true /p:PublishProfile=Local

# Build JSS sites
# TODO: npm caching

WORKDIR /build/src/site-one
RUN npm install
RUN npm run build

WORKDIR /build/src/site-two
RUN npm install
RUN npm run build

# Save the artifacts for copying into other images (see 'cm' and 'rendering' Dockerfiles).
FROM mcr.microsoft.com/windows/nanoserver:1809
WORKDIR /artifacts
COPY --from=builder /build/docker/deploy/platform  ./sitecore/
COPY --from=builder /build/src/site-one/build  ./site-one/
COPY --from=builder /build/src/site-two/build  ./site-two/