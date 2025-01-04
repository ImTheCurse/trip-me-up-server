FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . ./

EXPOSE 9910

CMD [ "npm", "install" ]
