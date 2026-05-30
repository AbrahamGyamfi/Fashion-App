FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js ./
COPY routes/ ./routes/
COPY models/ ./models/
COPY config/ ./config/
EXPOSE 3000
CMD ["npm", "start"]
