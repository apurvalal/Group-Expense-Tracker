const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Groups = require('./Group.model');
const { json } = require('express/lib/response');

app.use(bodyParser.urlencoded({ extended: false }));
var jsonParser = bodyParser.json();
// app.use(express.json());

router.route('/').post(jsonParser, (req, res) => {
	Groups.createGroup(req.body.members);
	res.json(Groups.groups);
});

module.exports = router;
