const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { auth, db } = require('./firebaseAdmin'); // Import Firebase auth and database

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
    req.user = decodedToken; // Save user info in request object
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

// Fetch tasks for the authenticated user
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.ref(`tasks/${userId}`).once('value');
    const tasks = snapshot.val();
    res.json(tasks ? Object.keys(tasks).map(key => ({ id: key, ...tasks[key] })) : []);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a new task
app.post('/tasks', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, description, status } = req.body; // Validate required fields
    if (!title || !description || !status) {
      return res.status(400).send('Bad Request: Missing required fields');
    }
    const newTaskRef = db.ref(`tasks/${userId}`).push();
    await newTaskRef.set({ title, description, status });
    res.json({ id: newTaskRef.key, title, description, status });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a task
app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, description, status } = req.body; // Validate required fields
    if (!title || !description || !status) {
      return res.status(400).send('Bad Request: Missing required fields');
    }
    await db.ref(`tasks/${userId}/${req.params.id}`).update({ title, description, status });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a task
app.delete('/tasks/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    await db.ref(`tasks/${userId}/${req.params.id}`).remove();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
