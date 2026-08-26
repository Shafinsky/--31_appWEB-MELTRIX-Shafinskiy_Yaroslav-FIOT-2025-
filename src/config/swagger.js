const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Game Store API",
      version: "1.0.0",
      description: "API documentation for Game Store project",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js", "./src/routes/*.js"], 
};

module.exports = swaggerJsDoc(options);