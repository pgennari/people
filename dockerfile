# Use a Node.js base image
FROM node:18-alpine 

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY src ./src
COPY templates ./templates

# Build the application (if necessary)
# If your application needs a build step (e.g., with TypeScript), add it here.
# For example, if you're using TypeScript:
RUN npm run build

EXPOSE 3000

CMD ["npm", "start", "start:prod"]

