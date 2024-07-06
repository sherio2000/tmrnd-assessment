# Stage 1: Build the Angular application
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file to the conf.d directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/tmrnd-assessment/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
