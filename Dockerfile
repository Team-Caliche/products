FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT = 8080

CMD ["npm", "start"]