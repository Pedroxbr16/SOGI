import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SOGI API",
      version: "1.0.0",
      description: "Documentação da API (Express + Mongoose)",
    },
    servers: [{ url: "/api" }], // combine com app.use("/api", routes)
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id:   { type: "string" },
            cpf:   { type: "string", example: "12345678900" },
            nome:  { type: "string", example: "João Silva" },
            funcao:{ type: "string", example: "Analista" },
            cargo: { type: "string", example: "Coordenador" },
            email: { type: "string", example: "joao@empresa.com" }
          },
          required: ["cpf","nome","funcao","cargo","email"]
        },
        ApiError: {
          type: "object",
          properties: { message: { type: "string" } }
        }
      }
    }
  },
  // globs dos arquivos com @swagger nas rotas
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../routes/**/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
