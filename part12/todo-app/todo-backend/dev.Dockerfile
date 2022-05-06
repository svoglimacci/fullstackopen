FROM node:16

WORKDIR /usr/src/app

COPY --chown=node . .

RUN npm install && npm install -g nodemon

ENV DEBUG=playground:*

USER node

CMD nodemon --legacy-watch npm start