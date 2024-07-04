// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model
const directorySchema = new mongoose.Schema({
  code: String,
  type: String,
  name: String,
  startDate: Date,
  endDate: Date
});

const Directory = mongoose.model('Directory', directorySchema);

// Routes
app.get('/api/directories', async (req, res) => {
  try {
    const { type, name, code } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }
    if (code) {
      query.code = { $regex: new RegExp(code, 'i') };
    }
    const directories = await Directory.find(query).sort({ name: 1 });
    res.json(directories);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/directories', async (req, res) => {
  const newDirectory = new Directory(req.body);
  await newDirectory.save();
  res.json(newDirectory);
});

app.put('/api/directories/:id', async (req, res) => {
  try {
    const updatedDirectory = await Directory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDirectory);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Serve static files from the Vue app
app.use(express.static(path.join(__dirname, '../my-vue-app/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back the Vue app's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../my-vue-app/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
