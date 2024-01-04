# Use the Node.js 16 Alpine image
FROM node:16-alpine

# Set the working directory
WORKDIR /index

# Install Python and pip
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Copy package.json and package-lock.json
COPY ["package.json", "package-lock.json*", "./"]

# Install Node.js dependencies
RUN npm install --verbose

# Copy the Python requirements.txt
COPY requirements.txt ./

# Install Python dependencies
RUN apk add --update --no-cache \
    build-base \
    python3-dev \
    py3-pip \
    py3-wheel \
    freetype-dev \
    openblas-dev \
    jpeg-dev \
    zlib-dev \
    libpng-dev

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run your application
CMD ["node", "index.js"]
