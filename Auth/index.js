import express from "express";
import { config } from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import Db from "./src/database/Db.js";
import cors from "cors";
import { AdminRoutes } from "./src/routes/adminRoutes.route.js";
import { StudentRoutes } from "./src/routes/studentRoutes.route.js";
import { teacherRoutes } from "./src/routes/teacherRoutes.routes.js";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

config();

const app = express();

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter limit for login/verify
  message: { message: "Too many login/verify attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply global limiter
// app.use("/api/v1", apiLimiter);

const allowedOrigins = [
  process.env.CORSE_ORIGIN1,
  process.env.CORSE_ORIGIN2,
  process.env.CORSE_ORIGIN3,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome To Auth MicroServicess #Shivam !!");
});

//todo----Route----User--
app.use("/api/v1/Teacher", teacherRoutes);
app.use("/api/v1/Student", StudentRoutes);
app.use("/api/v1/Admin", AdminRoutes);

Db().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () =>
    console.log("🚀 Server running at http://localhost:" + PORT)
  );
});
