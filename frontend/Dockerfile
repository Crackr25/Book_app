# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm cache clean -f
RUN npm install -g npm@latest
RUN npm install

# Copy all source code to the working directory
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose the port that the Next.js application will run on
EXPOSE 3000

# Command to start the Next.js application
CMD ["npm", "start"]
