FROM node:20-alpine3.20 AS build-stage
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine3.20
WORKDIR /app
COPY package*.json .
RUN npm install --only=production
COPY --from=build-stage /app/dist /app/dist

EXPOSE 3004
CMD ["npm", "run", "start"]