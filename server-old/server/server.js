// server/server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

// Load DB (top-level await is fine for ESM + Node 14+)
await connectDB();

// Middlewares
app.use(cors());
// parse JSON bodies
app.use(express.json());
// also parse urlencoded (form submissions)
app.use(express.urlencoded({ extended: true }));

// simple request logger to debug body content
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // only show body for non-GET and small bodies
  if (req.method !== 'GET') {
    try {
      console.log('BODY:', req.body);
    } catch (err) {
      console.log('BODY: <unprintable>');
    }
  }
  next();
});

app.get("/", (req, res) => res.send("Server is running"));

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// simple 404 / error handler
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
