import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Frengee API",
      version: "1.0.0",
      description: "API para gerenciamento de veículos",
    },
    servers: [
      {
        url: "http://localhost:3017",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Vehicle: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The vehicle ID",
              example: "66a94789db3a06a8f8e583d4",
            },
            make: {
              type: "string",
              description: "The make of the vehicle",
              example: "Volks",
            },
            model: {
              type: "string",
              description: "The model of the vehicle",
              example: "Gol",
            },
            year: {
              type: "integer",
              description: "The year the vehicle was manufactured",
              example: 2020,
            },
            imageUrl: {
              type: "string",
              description: "The URL of the vehicle image",
              example:
                "https://storage.googleapis.com/frengee-3bef2.appspot.com/1708643744554.jpeg",
            },
          },
        },
        CreateVehicleDTO: {
          type: "object",
          properties: {
            make: {
              type: "string",
              description: "The make of the vehicle",
              example: "Toyota",
            },
            model: {
              type: "string",
              description: "The model of the vehicle",
              example: "Corolla",
            },
            year: {
              type: "integer",
              description: "The year the vehicle was manufactured",
              example: 2020,
            },
            imageUrl: {
              type: "string",
              format: "binary",
              description: "The URL of the vehicle image",
              example: "image.jpg",
            },
          },
          required: ["make", "model", "year", "imageUrl"],
        },
        UpdateVehicleDTO: {
          type: "object",
          properties: {
            make: {
              type: "string",
              description: "The make of the vehicle",
              example: "Toyota",
            },
            model: {
              type: "string",
              description: "The model of the vehicle",
              example: "Corolla",
            },
            year: {
              type: "integer",
              description: "The year the vehicle was manufactured",
              example: 2020,
            },
            imageUrl: {
              type: "string",
              format: "binary",
              description: "The URL of the vehicle image",
              example: "image.jpg",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/auth/*.ts",
    "./src/models/*.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
