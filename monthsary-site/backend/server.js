require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/notes', notesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Monthsary API running on http://localhost:${PORT}`);
});
