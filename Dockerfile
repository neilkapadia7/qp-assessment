FROM node:18

# Set the working directory in the container
# WORKDIR /usr/src/app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

CMD ["node", "server.js"]
