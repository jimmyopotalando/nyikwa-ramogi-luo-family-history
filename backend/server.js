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
app.use(cors({ origin: "*" }));
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
// Load metadata.json and watch for changes
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

loadMetadata();

fs.watch(metadataPath, (eventType) => {
  if (eventType === "change") {
    console.log("🔄 metadata.json changed, reloading...");
    loadMetadata();
  }
});

// -----------------------
// API Routes
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
// Serve Frontend (production) dynamically
// -----------------------

// Dynamically find repo root and frontend dist
const repoRoot = path.resolve(__dirname, "..");
const frontendDist = path.join(repoRoot, "frontend", "dist");

if (!fs.existsSync(frontendDist)) {
  console.error("❌ Frontend dist folder not found:", frontendDist);
} else {
  console.log("✅ Serving frontend from:", frontendDist);

  app.use(express.static(frontendDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// -----------------------
// Start Server
// -----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
