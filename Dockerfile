FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "dev"]