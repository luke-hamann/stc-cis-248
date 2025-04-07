FROM denoland/deno:latest

WORKDIR /app
USER deno

COPY ./src .

ADD https://github.com/tailwindlabs/tailwindcss/releases/download/v4.1.3/tailwindcss-linux-x64 tailwindcss-linux-x64
RUN ./tailwindcss-linux-x64 -i ./src/static/css/input.css -o ./src/static/css/output.css ; deno cache main.ts

CMD ["deno", "serve", "--allow-env", "--allow-read", "--allow-net=mysql:3306", "--unstable-kv", "main.ts"]
