const fs = require('fs');
const path = require('path');

// Resolve path to metadata.json
const metadataPath = path.join(__dirname, '..', 'data', 'metadata.json');

// Load metadata.json safely
let metadata = {};
try {
  const rawData = fs.readFileSync(metadataPath, 'utf-8');
  metadata = JSON.parse(rawData);
} catch (err) {
  console.error('Error reading metadata.json:', err);
}

exports.getClansByCounty = (req, res) => {
  const county = req.query.county;
  if (!county) {
    return res.status(400).json({ error: 'County query parameter is required' });
  }

  // Find county object in the array
  const countyData = metadata.counties.find(
    c => c.name.toLowerCase() === county.toLowerCase()
  );

  if (!countyData) {
    return res.status(404).json({ error: `County '${county}' not found` });
  }

  res.json({ clans: countyData.clans });
};
