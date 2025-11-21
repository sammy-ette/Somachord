FROM erlang:28-alpine AS build
COPY --from=ghcr.io/gleam-lang/gleam:v1.13.0-erlang-alpine /bin/gleam /bin/gleam
COPY . /app/
RUN apk add git
RUN cd /app/server && gleam export erlang-shipment
RUN cd /app && gleam run -m lustre/dev build --minify

FROM erlang:alpine
COPY --from=build /app/server/build/erlang-shipment /app/server
COPY --from=build /app/priv /app/priv
WORKDIR /app/server
ENTRYPOINT ["/app/server/entrypoint.sh"]
CMD ["run"]
