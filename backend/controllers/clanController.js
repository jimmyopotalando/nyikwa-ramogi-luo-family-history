// backend/controllers/clanController.js

const fs = require('fs');
const path = require('path');

// Resolve path to metadata.json
const metadataPath = path.join(__dirname, '..', 'data', 'metadata.json');

// Load metadata.json safely at startup
let metadata = { counties: [] };
try {
  const rawData = fs.readFileSync(metadataPath, 'utf-8');
  metadata = JSON.parse(rawData);
  if (!metadata.counties) {
    console.warn('Warning: metadata.json has no "counties" array.');
    metadata.counties = [];
  } else {
    console.log('✅ Metadata loaded:', metadata);
  }
} catch (err) {
  console.error('❌ Error reading metadata.json:', err);
}

// Controller function
exports.getClansByCounty = (req, res) => {
  const county = req.query.county;
  if (!county) {
    return res.status(400).json({ message: 'County query parameter is required.' });
  }

  // Find county object (case-insensitive)
  const countyData = metadata.counties.find(
    (c) => c.name.toLowerCase() === county.toLowerCase()
  );

  if (!countyData) {
    return res.status(404).json({ message: `No data found for ${county}` });
  }

  return res.json({ clans: countyData.clans });
};
