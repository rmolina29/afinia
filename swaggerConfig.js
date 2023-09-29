const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0", // Especifica la versión de Swagger/OpenAPI que estás usando
    info: {
      title: "Afinia Backend Dev",
      version: "1.0.0",
      description: "Prueba tecnica de desarrollo backend api - Roberto Molina",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          in: "header",
          name: "Authorization",
          description: "Bearer Token",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: {
      bearerAuth: [],
    },
  },
  apis: ["./routes/*.js"], // Rutas donde se encuentran tus definiciones de ruta
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
