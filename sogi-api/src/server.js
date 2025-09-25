import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import routes from "./routes/routes.js";      
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import authRouter from "./routes/auth.routes.js";  
import { auth } from "./middlewares/auth.js";      
const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
app.set("trust proxy", true); // captura IP real atrás de proxy (opcional)

// docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// 🔓 rotas públicas (login, etc.)
app.use("/api/auth", authRouter);

// 🔒 tudo abaixo exige JWT válido
app.use("/api", auth, routes);

const port = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () =>
    console.log(`🚀 API em http://localhost:${port} | 📚 Docs: /api-docs`)
  );
});
