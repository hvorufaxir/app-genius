/*
* filename: complex_code.js
* This code demonstrates a sophisticated and complex implementation of a web application.
* It includes features such as user authentication, data manipulation, and real-time updates.
*/

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize the express app
const app = express();

// Set up middleware
app.use(bodyParser.json());

// Configure MongoDB connection
mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Define User model
const User = mongoose.model('User', userSchema);

// Define routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Failed to register user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Failed to authenticate user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/update', (req, res) => {
  // Verify the received token
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, 'secretKey', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const { username } = decoded;
    try {
      const user = await User.findOne({ username });
      // Modify user data
      // ...
      await user.save();
      res.status(200).json({ message: 'User data updated successfully' });
    } catch (err) {
      console.error('Failed to update user data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));