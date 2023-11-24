FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "node", "node_controller.js" ]