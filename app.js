var express = require('express'),
    app = express(),
    port = 9090;

app.use(express.static('public'));
app.use(express.static('public/views'));
app.get('/', function (req, res) {
    res.send('hello world');
});

app.listen(port, function (err) { console.log('Running server on port ' + port); });