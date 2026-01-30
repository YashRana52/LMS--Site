import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educator.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./utils/cloudinary.js";
import courseRouter from "./routes/course.js";
import userRouter from "./routes/user.js";

const app = express();

// connect services
await connectDB();
await connectCloudinary();

// middlewares
app.use(cors());

// ✅ Stripe webhook MUST be before express.json()
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ❌ JSON middleware Stripe ke baad
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (_, res) => res.send("Server is live 🚀"));

// Clerk webhook (JSON ok)
app.post("/clerk", express.json(), clerkWebhooks);

// routes
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
