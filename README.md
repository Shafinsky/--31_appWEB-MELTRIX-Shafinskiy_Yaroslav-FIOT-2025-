# --31_appWEB-MELTRIX-Shafinskiy_Yaroslav-FIOT-2025-

A learning web application — an online game store.

## Features

- REST API for **users** and **games**
- JWT-based authentication and authorization
- Role-based access control
- File upload endpoint (`/api/upload`)
- Swagger API documentation at `/api/docs`
- Rate limiting, security and performance middleware
- Response caching with Redis
- Structured logging (Winston + Morgan)
- Vanilla HTML/CSS/JS frontend with a shopping cart
- Docker Compose setup (API + MySQL + Redis)

## Tech stack

- **Backend:** Node.js + Express 5
- **ORM:** Sequelize
- **Database:** MySQL
- **Cache:** Redis
- **Frontend:** vanilla HTML / CSS / JavaScript
- **Auth:** JWT + bcryptjs
- **Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Logging:** Winston, Morgan
- **Security:** Helmet, express-rate-limit, express-validator, Joi

## Project structure

server.js 
### Express app, middleware, API mounting 
config/sequelize.js 
### Sequelize -> MySQL connection (env vars) 
config/db.js 
### mysql2 connection pool (env vars) 
models/ 
### Sequelize models (user, game, review) 
routes/ 
### API routes (user, game) 
controllers/ 
### request handlers 
src/routes/ 
### auth, upload routes 
src/middleware/ 
### security, rate limit, auth, role, cache, error, performance 
src/config/ 
### swagger, redis 
src/utils/ 
### logger 
index.html 
### main page 
cart.html 
### cart page 
about.html 
### about page 
script.js / style.css 
Dockerfile docker-compose.yml

## Getting started

1. Install dependencies:
   ```bash
   npm install

2. Create a .env file with your MySQL and Redis settings:
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=game_store
   JWT_SECRET=your_secret
   PORT=3000
3. Run the server:
   ```bash
   npm start
   
5. Open http://localhost:3000 (API) and http://localhost:3000/api/docs (Swagger)

## Docker
  ```bash
  docker-compose up
