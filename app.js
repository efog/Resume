const dataService = require('./data.js'),
        express = require('express');
const app = express(),
    port = process.env.PORT || 9090;

// Statics
app.use(express.static('public'));
app.use(express.static('public/views'));

app.get('/api/data', dataService.get);
app.get('/locales/locale-fr.json', dataService.fr);
app.get('/locales/locale-en.json', dataService.en);

app.listen(port, function (err) { console.log('Running server on port ' + port); });