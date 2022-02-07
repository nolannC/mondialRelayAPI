require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const mr = require('./routes/mr');
const user = require('./routes/user');
const auth = require('./routes/auth');

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use('/mr', mr);
app.use('/user', user);
app.use('/auth', auth);

app.listen(process.env.PORT || 3000, () => {
	console.log(`Listening on port ${process.env.PORT || 3000}...`);
});
