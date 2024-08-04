const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { auth, db } = require('./firebaseAdmin');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Middleware to check Firebase Auth token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

// Get all tasks
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const snapshot = await db.ref('tasks').once('value');
    const tasks = snapshot.val();
    res.json(tasks ? Object.keys(tasks).map(key => ({ id: key, ...tasks[key] })) : []);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a new task
app.post('/tasks', authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Generate a new unique key for the task
    const newTaskRef = db.ref('tasks').push();

    // Set the task data at the new key
    await newTaskRef.set({ title, description, status });

    // Respond with the task data including the new unique key
    res.status(200).json({ id: newTaskRef.key, title, description, status });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing task
app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    await db.ref(`tasks/${req.params.id}`).update(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a task
app.delete('/tasks/:id', authenticate, async (req, res) => {
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
