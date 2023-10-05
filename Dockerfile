FROM node:16-alpine3.17
WORKDIR /app

ENV NODE_ENV production
ENV DATABASE_URL=file:/database/db.sqlite
ENV STORAGE_PATH=/files

COPY prisma ./

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN yarn global add pnpm && pnpm i

COPY . .

RUN yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build

EXPOSE 3000

CMD npx prisma db push && npm run start