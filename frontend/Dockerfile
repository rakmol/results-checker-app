FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i -g http-server
EXPOSE 8080
CMD ["http-server","-p","8080","-c-1"]