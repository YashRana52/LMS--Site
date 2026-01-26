import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

//initialize Express
const app = express();

await connectDB();

//midilewares
app.use(cors());

//routes
app.get("/", (req, res) => res.send("Server is live"));

app.post("clerk", express.json(), clerkWebhooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
