const express = require('express');
const app = express();
const port = 3000; // choose any port number you like

// Start listening on port...
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Link to html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});