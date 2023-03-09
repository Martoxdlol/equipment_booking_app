FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

ENV RUNNING_IN_DOCKER=true

ENV DATABASE_URL=file:/files/db.sqlite

CMD [ "npm", "run", "entrypoint" ]