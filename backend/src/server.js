import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*" },
});
app.set("io", io);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(morgan("tiny"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    service: "instant-mechanic-api",
    time: new Date().toISOString(),
  }),
);
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Instant Mechanic Operations API", version: "1.0.0" },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: [],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);
io.on("connection", (socket) => {
  socket.emit("connected", { message: "Live updates enabled" });
});
const port = process.env.PORT || 5000;
connectDB()
  .then(() =>
    server.listen(port, () =>
      console.log(`API running on http://localhost:${port}`),
    ),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
