FROM node:alpine AS development
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build user

CMD ["node", "dist/apps/user/main"]