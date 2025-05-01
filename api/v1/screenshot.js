const express = require('express');
const router = express.Router();
const { uploadScreenshot } = require('../../lib/s3uploader');

// POST /api/v1/screenshot
router.post('/', async (req, res) => {
  const { employee_id, captured_at, image_data, permission } = req.body;

  if (!employee_id || !image_data) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const s3Key = await uploadScreenshot(image_data, employee_id);
    console.log(`Screenshot uploaded: ${s3Key}`);

    res.status(200).json({ message: 'Screenshot uploaded to S3', key: s3Key });
  } catch (err) {
    console.error('Upload failed:', err.message || err);
    res.status(500).json({ error: 'Failed to upload screenshot to S3' });
  }
});

module.exports = router;
