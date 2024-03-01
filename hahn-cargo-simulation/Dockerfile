# Use the official Node.js image
FROM node:14 AS build
WORKDIR /app

# Copy the project files and install dependencies
COPY . .
RUN npm install
RUN npm run build

# Build the runtime image
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
