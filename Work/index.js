import express from "express";
import { config } from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import Db from "./src/database/Db.js";
import cors from "cors";
import morgan from "morgan";
import { teacherRoutes } from "./src/teacher/routes/teacherRoute.route.js";
import { TeacherworkRoutes } from "./src/teacher/routes/Teacherwork.routes.js";
import { adminRoute } from "./src/admin/routes/adminRoute.route.js";
import { AdminworkRoute } from "./src/admin/routes/Adminwork.routes.js";
import { studentRoute } from "./src/student/routes/studentRoute.route.js";
import { StudentWorkRoute } from "./src/student/routes/StudentWork.route.js";
import { academicRoute } from "./src/admin/routes/academic.route.js";
import { hostelRoute } from "./src/admin/routes/hostel.route.js";
import { notificationRoute } from "./src/admin/routes/notification.route.js";
import { placementRoute } from "./src/admin/routes/placement.route.js";
import { feeRoute } from "./src/admin/routes/fee.route.js";
import { paymentRoute } from "./src/admin/routes/payment.route.js";

config();

const app = express();

const urlAccess = [
  process.env.CORSE_ORIGIN1,
  process.env.CORSE_ORIGIN2,
  process.env.CORSE_ORIGIN3,
  "https://adminmicroproject.vercel.app",
  "https://studentmicroproject.vercel.app",
  "https://teachermicroproject.vercel.app",

];

app.use(cors({
  methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
  origin: urlAccess,
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome To Work & Upload Consolidated MicroServicess #Shivam !!");
});

//todo----Route----Teacher--
app.use("/api/v2/Teacher/Work", TeacherworkRoutes);

//? Router-----Studnent
app.use("/api/v2/Student/Work", StudentWorkRoute);

//todo Router --------Admin
app.use("/api/v2/Admin/Work", AdminworkRoute);

// 🔥 Consolidated Upload Routes (api/v3)
app.use("/api/v3/Teacher", teacherRoutes);
app.use("/api/v3/Student", studentRoute);
app.use("/api/v3/Admin", adminRoute);
app.use("/api/v3/Admin/Academic", academicRoute);
app.use("/api/v3/Admin/Hostel", hostelRoute);
app.use("/api/v3/Admin/Notification", notificationRoute);
app.use("/api/v3/Admin/Placement", placementRoute);
app.use("/api/v3/Admin/Fee", feeRoute);
app.use("/api/v3/Admin/Payment", paymentRoute);
app.use("/api/v3/Teacher/Payment", paymentRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

Db()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log("🚀 Server running at http://localhost:" + PORT)
    );
  })
  .catch((err) => {
    console.error("FATAL ERROR: Could not start server because Database connection failed.");
    process.exit(1);
  });
