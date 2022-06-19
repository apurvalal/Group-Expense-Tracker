const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Groups = require('./Group.model');

app.use(bodyParser.urlencoded({ extended: false }));
var jsonParser = bodyParser.json();

router.route('/').post(jsonParser, (req, res) => {
	res.json(Groups.setGroup(req.body.members));
});

module.exports = router;
