const express = require('express');
const router = express.Router();
const { TimeEntry } = require('../../models');

// POST /api/v1/time
router.post('/', async (req, res) => {
  try {
    const { employee_id, task_id } = req.body;
    const entry = await TimeEntry.create({
      employeeId: employee_id,
      taskId: task_id,
      startTime: new Date()
    });

    res.status(201).json({
      id: entry.id,
      employee_id: entry.employeeId,
      task_id: entry.taskId,
      start_time: entry.startTime,
      end_time: null,
    });
  } catch (error) {
    console.error('Start time entry failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/v1/time/:id
router.patch('/:id', async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Time entry not found' });
    }

    entry.endTime = new Date();
    await entry.save();

    res.json({
      id: entry.id,
      employee_id: entry.employeeId,
      task_id: entry.taskId,
      start_time: entry.startTime,
      end_time: entry.endTime,
    });
  } catch (error) {
    console.error('Stop time entry failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
