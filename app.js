var express = require('express'),
    app = express(),
    port = 9090;

// Statics
app.use(express.static('public'));
app.use(express.static('public/views'));

app.listen(port, function (err) { console.log('Running server on port ' + port); });