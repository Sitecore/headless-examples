# escape=`

#
# Development-only image for running Next.js in a containerized environment.
# Assumes that the Next.js rendering host source is mounted to c:\app.
#

ARG PARENT_IMAGE
ARG SOLUTION_IMAGE

FROM ${SOLUTION_IMAGE} as solution
FROM ${PARENT_IMAGE} as debug

COPY ./headless-proxy /app
COPY --from=solution /artifacts/site-one/ /app/dist/site-one/
COPY --from=solution /artifacts/site-two/ /app/dist/site-two/

WORKDIR /app
RUN npm install

EXPOSE 3000
ENTRYPOINT "npm run start"