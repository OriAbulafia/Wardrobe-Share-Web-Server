import express, { Express } from "express";
import { Request, Response, NextFunction } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import user_routes from "./routes/user_routes";
import post_routes from "./routes/post_routes";
import comment_routes from "./routes/comment_routes";
import swaggerUI from "swagger-ui-express";
import specs from "./doc/swagger";
import "./types/types";
import cors from "cors";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure CORS to allow the frontend to communicate with the backend
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's origin
  credentials: true, // Allow cookies to be sent
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/uploads", express.static("uploads"));
app.use("/user", user_routes);
app.use("/post", post_routes);
app.use("/comment", comment_routes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal Server Error");
});

// Swagger docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = (): Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connected to the database");
    });
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

export default initApp;
