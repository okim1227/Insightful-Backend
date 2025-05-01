const express = require('express');
const router = express.Router();
const { Project } = require('../../models');

// GET /api/v1/project
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll();
    const formatted = projects.map(p => ({
      id: p.id,
      name: p.name,
      screenshot_interval_sec: p.screenshot_interval_sec,
      employee_ids: [], // extend later if needed
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Fetch projects failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/v1/project/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { screenshot_interval_sec } = req.body;

  if (!screenshot_interval_sec || isNaN(screenshot_interval_sec)) {
    return res.status(400).json({ error: 'screenshot_interval_sec must be a number' });
  }

  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.screenshot_interval_sec = screenshot_interval_sec;
    await project.save();

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Update project failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/project
router.post('/', async (req, res) => {
  const { name, screenshot_interval_sec, employee_ids = [] } = req.body;

  if (!name || isNaN(screenshot_interval_sec)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const project = await Project.create({ name, screenshot_interval_sec });

    if (employee_ids.length > 0) {
      await project.setEmployees(employee_ids); // Sequelize magic
    }

    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('Create project failed:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
