var data = require('../../data/resume.json');
exports.get = function (req, resp) {
    resp.status(200).send(data);
};