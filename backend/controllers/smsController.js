// backend/controllers/smsController.js

const smsService = require('../services/smsService');

exports.sendSms = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'phoneNumber and message are required' });
    }

    await smsService.sendSms(phoneNumber, message);

    res.status(200).json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
};
