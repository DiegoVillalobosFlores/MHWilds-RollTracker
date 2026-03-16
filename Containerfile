# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM docker.io/oven/bun:1.3.10-alpine AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# tests & build
ENV NODE_ENV=production
RUN bun run compile:server:linux:modern

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=prerelease /usr/src/app/mhwilds-tracker-server .
COPY --from=prerelease /usr/src/app/src/migrations ./src/migrations
COPY --from=prerelease /usr/src/app/src/web ./src/web
RUN chown -R bun:bun .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "./mhwilds-tracker-server" ]
