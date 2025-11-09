// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";

// -----------------------
// Setup __dirname for ES modules
// -----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------
// Load environment variables
// -----------------------
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------
// Middleware
// -----------------------
app.use(cors({ origin: "*" })); // allow all origins for dev
app.use(express.json());

// -----------------------
// MongoDB connection
// -----------------------
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MongoDB connection error: MONGO_URI is not defined in .env");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// -----------------------
// Load metadata.json at startup and watch for changes
// -----------------------
const metadataPath = path.join(__dirname, "data", "metadata.json");

let metadata = { counties: [] };

function loadMetadata() {
  try {
    const rawData = fs.readFileSync(metadataPath, "utf8");
    metadata = JSON.parse(rawData);
    if (!metadata.counties) metadata.counties = [];
    console.log("✅ Metadata loaded:", metadata.counties.map(c => c.name));
  } catch (err) {
    console.error("❌ Error loading metadata.json:", err);
  }
}

// Initial load
loadMetadata();

// Watch for changes
fs.watch(metadataPath, (eventType) => {
  if (eventType === "change") {
    console.log("🔄 metadata.json changed, reloading...");
    loadMetadata();
  }
});

// -----------------------
// Routes
// -----------------------

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// -----------------------
// GET clans by county
// -----------------------
app.get("/api/clans", (req, res) => {
  const county = req.query.county;
  console.log("GET /api/clans called with county:", county);

  if (!county) return res.status(400).json({ message: "County is required" });

  const countyData = metadata.counties.find(
    c => c.name.toLowerCase() === county.toLowerCase()
  );

  if (!countyData) {
    console.log(`No data found for county: ${county}`);
    return res.status(404).json({ message: `No data found for ${county}` });
  }

  res.json({ clans: countyData.clans });
});

// -----------------------
// POST comments
// -----------------------
app.post("/api/comments", (req, res) => {
  const { comment } = req.body;
  if (!comment || comment.trim() === "")
    return res.status(400).json({ message: "Comment cannot be empty" });

  const logDir = path.join(__dirname, "..", "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const logFile = path.join(logDir, "comments.log");
  const logEntry = `${new Date().toISOString()} - ${comment}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error("Error saving comment:", err);
      return res.status(500).json({ message: "Failed to save comment" });
    }
    res.json({ message: "Comment received. Thank you!" });
  });
});

// -----------------------
// POST donations (STK Push skeleton)
// -----------------------
app.post("/api/donate", (req, res) => {
  const { phoneNumber, amount } = req.body;
  if (!phoneNumber || !amount)
    return res.status(400).json({ message: "Phone number and amount are required" });

  try {
    const transactionRef = `DON-${Date.now()}`;

    const logDir = path.join(__dirname, "..", "logs");
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    const logFile = path.join(logDir, "donations.log");
    const logEntry = `${new Date().toISOString()} - Phone: ${phoneNumber}, Amount: ${amount}, Ref: ${transactionRef}\n`;
    fs.appendFileSync(logFile, logEntry);

    res.json({
      message: "Please check your phone and complete the M-Pesa payment.",
      transactionRef,
    });
  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ message: "Failed to process donation" });
  }
});

// -----------------------
// M-Pesa callbacks
// -----------------------
app.post("/api/payments/callback", (req, res) => {
  console.log("Payment callback received:", req.body);
  res.status(200).send("Callback received");
});

app.post("/api/donations/callback", (req, res) => {
  console.log("Donation callback received:", req.body);
  res.status(200).send("Donation callback received");
});

// -----------------------
// Start server
// -----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
