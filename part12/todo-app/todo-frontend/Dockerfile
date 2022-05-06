FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test

RUN npm run build

ENV REACT_APP_BACKEND_URL=http://localhost:3000

EXPOSE 3000

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html