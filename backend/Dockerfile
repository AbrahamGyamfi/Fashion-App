FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server.js ./
COPY routes/ ./routes/
COPY models/ ./models/
COPY config/ ./config/

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000
CMD ["npm", "start"]
