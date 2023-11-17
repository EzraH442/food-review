FROM node:alpine
WORKDIR /usr/app

RUN npm install --global pm2
RUN npm install --global pnpm

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm i
COPY ./ ./

ARG DATABASE_PASSWORD
ARG SECRET_KEY
ARG DB_HOST
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ARG DATABASE_URL="postgres://postgres:${DATABASE_PASSWORD}@${DB_HOST}:5432/reviews?schema=public"

RUN npx -y prisma generate

RUN DATABASE_URL=${DATABASE_URL} SECRET_KEY="${SECRET_KEY}" pnpm run build

ENV DATABASE_URL=${DATABASE_URL}
ENV SECRET_KEY=${SECRET_KEY}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

EXPOSE 3000

CMD [ "pm2-runtime", "npm", "--", "start" ]