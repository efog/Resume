var express = require('express'),
    dataService = require('./dataService.js'),
    app = express(),
    port = 9090;

// Statics
app.use(express.static('public'));
app.use(express.static('public/views'));

app.get('/api/data', dataService.get);

app.listen(port, function (err) { console.log('Running server on port ' + port); });