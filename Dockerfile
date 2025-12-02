FROM ghcr.io/gleam-lang/gleam:v1.13.0-erlang AS build
COPY --from=oven/bun:1-distroless /usr/local/bin/bun /bin/bun
COPY . /app/
WORKDIR /app
RUN cd server && gleam export erlang-shipment
RUN bun i
RUN gleam run -m lustre/dev build --minify

FROM erlang:alpine
COPY --from=build /app/server/build/erlang-shipment /app/server
COPY --from=build /app/priv /app/priv
COPY --from=build /app/sw.js /app/priv/static/sw/sw.js
WORKDIR /app/server
ENTRYPOINT ["/app/server/entrypoint.sh"]
CMD ["run"]
