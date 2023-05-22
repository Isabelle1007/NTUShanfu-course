FROM node

WORKDIR /app

COPY package.json .

# install dependencies
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]