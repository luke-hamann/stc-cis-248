FROM denoland/deno:latest

WORKDIR /app

COPY ./src .

ADD https://github.com/tailwindlabs/tailwindcss/releases/download/v4.1.3/tailwindcss-linux-x64 tailwindcss-linux-x64

RUN chmod +x tailwindcss-linux-x64
RUN ./tailwindcss-linux-x64 -i ./static/css/input.css -o ./static/css/output.css
RUN deno cache main.ts

USER deno
CMD ["deno", "serve", "--allow-env", "--allow-read", "--allow-net=mysql:3306", "--unstable-kv", "main.ts"]
