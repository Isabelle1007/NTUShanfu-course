# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the Docker container
WORKDIR /index

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY ["package.json", "package-lock.json*", "./"]

# Install any dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Build the application (if necessary)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "run", "dev"]
