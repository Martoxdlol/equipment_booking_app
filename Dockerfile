FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV RUNNING_IN_DOCKER=true

ENV DATABASE_URL=file:/database/db.sqlite

ENV NEXT_TELEMETRY_DISABLED=1

CMD [ "npm", "run", "entrypoint" ]