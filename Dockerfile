FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80/tcp
EXPOSE 80/udp

CMD [ "node", "index.js" ]
