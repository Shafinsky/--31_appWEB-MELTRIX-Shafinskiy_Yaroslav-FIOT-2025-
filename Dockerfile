FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x wait-for-mysql.sh

EXPOSE 3000

CMD ["sh", "-c", "./wait-for-mysql.sh && node server.js"]