FROM node

WORKDIR /index

COPY ["package.json", "package-lock.json*", "./"]

# install dependencies
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]