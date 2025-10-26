import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import mainRouter from "../src/routes";

const app: Express = express();
const port = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rota principal da API
app.use("/", mainRouter);

if (process.env.VERCEL_ENV !== "production") {
  app.listen(port, () => {
    console.log(`[SERVER] Servidor rodando em http://localhost:${port}`);
  });
}

export default app;
