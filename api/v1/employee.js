const express = require('express');
const router = express.Router();
const { sendInvitationEmail } = require('../../lib/mailer');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employee, Project } = require('../../models');

const INVITE_SECRET = process.env.INVITE_SECRET || 'supersecret123';

router.post('/', async (req, res) => {
  const { full_name, email, password } = req.body;
  console.log(`Received POST for: ${email}`);

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const token = jwt.sign({ email }, INVITE_SECRET, { expiresIn: '24h' });

    // First try sending the email
    await sendInvitationEmail(email, token);

    // If successful, then create the employee
    const newEmployee = await Employee.create({
      full_name,
      email,
      passwordHash: hashedPassword,
      isActive: true,
    });

    res.status(201).json({ id: newEmployee.id, full_name, email, is_active: true });
  } catch (error) {
    console.error('Create employee failed:', error);

    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ error: 'Email already invited.' });
    }

    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/employee/:id/assign
router.post('/:id/assign', async (req, res) => {
  const { project_id } = req.body;
  const employeeId = req.params.id;

  try {
    const employee = await Employee.findByPk(employeeId);
    const project = await Project.findByPk(project_id);

    if (!employee || !project) {
      return res.status(404).json({ error: 'Employee or Project not found' });
    }

    await employee.addProject(project);
    res.status(200).json({ message: `✅ Project ${project_id} assigned to employee ${employeeId}` });
  } catch (err) {
    console.error('Assignment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/employee/:id/projects
router.get('/:id/projects', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: {
        model: Project,
        through: { attributes: [] }, // Hide join table fields
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee.Projects);
  } catch (error) {
    console.error('Error fetching employee projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/employee
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
