FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install
# RUN npm install cloudevents
EXPOSE 3000
CMD [ "node", "node_controller.js" ]