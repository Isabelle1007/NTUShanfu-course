FROM node:16-alpine

WORKDIR /usr/src/app/backend

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "nodemon", "app.js" ]