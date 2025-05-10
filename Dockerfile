FROM node:18-alpine

WORKDIR /app
COPY backend/package.json .
RUN npm install
COPY backend/ .
CMD ["node", "src/app.js"]
