# Stage 1: Build Angular application
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build -- --output-path=dist/app --configuration production

# Stage 2: Serve Angular app with Nginx
FROM nginx:stable-alpine as serve

WORKDIR /usr/share/nginx/html

# Copy the built app
COPY --from=build /app/dist/app/browser .

# Copy a custom script to replace environment variables
COPY replace-env-vars.sh .

# Ensure the script is executable
RUN chmod +x replace-env-vars.sh

# Run the environment variable replacement script before starting Nginx
CMD ["sh", "-c", "./replace-env-vars.sh && nginx -g 'daemon off;'"]

# Expose port 80
EXPOSE 80
