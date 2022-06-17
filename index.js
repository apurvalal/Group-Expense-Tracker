const express = require('express');
const app = express();
const routes = require('./app/routes/routes');

const port = 1337;

app.get('/', (req, res) => {
	res.json({ message: 'Hello' });
});

app.use('/api', routes);

app.listen(port, () => {
	console.log(`Server live on port ${port}`);
});
