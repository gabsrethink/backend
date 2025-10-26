import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import mainRouter from "../src/routes";

const app: Express = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-taupe-95.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error("Origem não permitida pelo CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rota principal da API
app.use("/", mainRouter);

if (process.env.VERCEL_ENV !== "production") {
  app.listen(port, () => {
    console.log(`[SERVER] Servidor rodando em http://localhost:${port}`);
  });
}

export default app;
