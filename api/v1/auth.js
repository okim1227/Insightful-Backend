const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Employee } = require('../../models');

const INVITE_SECRET = process.env.INVITE_SECRET || 'supersecret123';

// POST /api/v1/auth/verify
router.post('/verify', async (req, res) => {
  const { email, token } = req.body;

  console.log('Verification request:', { email, token: token.substring(0, 10) + '...' });
  console.log('Secret used for verification:', INVITE_SECRET.substring(0, 3) + '...');
  
  if (!token || !email) {
    return res.status(400).json({ error: 'Missing email or token' });
  }

  try {
    const decoded = jwt.verify(token, INVITE_SECRET);
    if (decoded.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ error: 'Email and token do not match' });
    }
    
    const employee = await Employee.findOne({ where: { email } });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.isActive = true;
    await employee.save();

    const authToken = jwt.sign(
      { id: employee.id, email: employee.email },
      INVITE_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token: authToken,
      employee: {
        id: employee.id,
        full_name: employee.full_name,
        email: employee.email,
      },
    });

  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
