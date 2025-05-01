const express = require('express');
const router = express.Router();
const { Screenshot } = require('../../models');

// GET /api/v1/analytics/screenshot?start=<unix_ms>&end=<unix_ms>
router.get('/screenshot', async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'Missing start or end timestamp' });
  }

  try {
    const screenshots = await Screenshot.findAll({
      where: {
        captured_at: {
          $gte: new Date(parseInt(start)),
          $lte: new Date(parseInt(end)),
        }
      },
      order: [['captured_at', 'DESC']],
      limit: 100
    });

    res.json({ data: screenshots });
  } catch (err) {
    console.error('Failed to fetch screenshots:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;