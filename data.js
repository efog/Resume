var data = require('./data/resume.json');
var localefr = require('./locales/locale-fr.json');
var localeen = require('./locales/locale-en.json');
exports.get = function (req, resp) {
    resp.status(200).send(data);
};
exports.fr = function (req, resp) {
    resp.status(200).send(localefr);
};
exports.en = function (req, resp) {
    resp.status(200).send(localeen);
};