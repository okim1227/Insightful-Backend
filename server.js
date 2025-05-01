require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');
const employeeRoute = require('./api/v1/employee');
const projectRoute = require('./api/v1/project');
const timeEntryRoute = require('./api/v1/time');
const authRoutes = require('./api/v1/auth');
const screenshotRoutes = require('./api/v1/screenshot');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api/v1/project', projectRoute);
app.use('/api/v1/time', timeEntryRoute);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employee', employeeRoute);
app.use('/api/v1/screenshot', screenshotRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync();
    // await sequelize.sync({ force: true });
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

startServer();
