const express = require('express');
require("module-alias/register");
require("dotenv").config();

const connectDB = require('@config/db');

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
	res.json({ msg: 'Welcome to the QuestionsPro API' });
});

app.use('/api', require('@routes/api')); // Main QuestionsPro Route (Entry Point)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server Started on Port Number: ${PORT}`));
