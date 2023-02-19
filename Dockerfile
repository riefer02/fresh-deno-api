FROM denoland/deno:alpine

# An argument, GIT_REVISION, is declared and used to set the environment variable DENO_DEPLOYMENT_ID.
ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

# The current directory is copied to the working directory.
COPY . .

# Install ffmpeg to container
RUN apk update \
    && apk upgrade -U \ 
    && apk add ffmpeg \
    && rm -rf /var/cache/*

# Set file permissions
RUN chmod -R 777 .

# The Deno cache command is run to cache the main.ts file, with the import map import_map.json.
RUN deno cache main.ts --import-map=import_map.json

# Port 6969 is exposed.
EXPOSE 6969

CMD ["run", "-A", "main.ts"]