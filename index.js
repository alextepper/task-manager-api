const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const dbRoutes = require('./routes/dbRoutes')

app.use(bodyParser.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(dbRoutes);

