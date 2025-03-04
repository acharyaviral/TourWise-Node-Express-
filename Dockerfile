# Use a lightweight Node.js image
FROM node:18-alpine 

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app in production mode
CMD ["node", "server.js"]
