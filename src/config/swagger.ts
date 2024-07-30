import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle Management API",
      version: "1.0.0",
      description: "API for managing vehicles",
    },
    servers: [
      {
        url: "http://localhost:3017/api",
      },
    ],
    components: {
      schemas: {
        Vehicle: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The vehicle ID",
            },
            make: {
              type: "string",
              description: "The make of the vehicle",
            },
            model: {
              type: "string",
              description: "The model of the vehicle",
            },
            year: {
              type: "number",
              description: "The year of the vehicle",
            },
          },
          required: ["make", "model", "year"],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
