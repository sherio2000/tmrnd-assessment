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

COPY --from=build /app/dist/tmrnd-assessment /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
