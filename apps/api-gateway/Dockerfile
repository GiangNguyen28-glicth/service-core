FROM node:alpine AS development
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build api-gateway

COPY --from=development /app/dist ./dist

CMD ["node", "dist/apps/api-gateway/main"]