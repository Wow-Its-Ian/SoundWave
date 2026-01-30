const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.js');

const app = express();
const compiler = webpack(webpackConfig);
const port = process.env.PORT || 3000;

// Use the webpack-dev-middleware
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
	})
);

// Use the webpack-hot-middleware
app.use(webpackHotMiddleware(compiler));

// Serve static files from the 'dist' directory (optional, only needed if not using dev middleware)
// app.use(express.static('dist')); 

// Define your API routes
app.get('/api', (req, res) => {
	res.json({ message: 'Hello from the API!' });
});

// Serve the main HTML file for your frontend (you'll need an index.html file)
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`);
	console.log(`http://localhost:${port}`);
});
