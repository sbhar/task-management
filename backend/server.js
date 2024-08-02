// server.js or app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./firebaseAdmin'); // Adjust path as needed

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins

// If you want to limit access to specific origins:
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
};

app.use(cors(corsOptions));

// Example route to get tasks
app.get('/tasks', async (req, res) => {
  try {
    const snapshot = await db.ref('tasks').once('value');
    const tasks = snapshot.val();
    res.json(tasks ? Object.keys(tasks).map(key => ({ id: key, ...tasks[key] })) : []);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Example route to add a task
app.post('/tasks', async (req, res) => {
  try {
    const newTaskRef = db.ref('tasks').push();
    await newTaskRef.set(req.body);
    res.json({ id: newTaskRef.key, ...req.body });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Example route to update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    await db.ref(`tasks/${req.params.id}`).update(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Example route to delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await db.ref(`tasks/${req.params.id}`).remove();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
