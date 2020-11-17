const express = require('express');

const app = express();

app.use(express.static("static"));

app.get('/', (req, res) => {
    console.log("hey");
    res.sendFile(__dirname + '/static/index.html');
});

app.listen(3000);