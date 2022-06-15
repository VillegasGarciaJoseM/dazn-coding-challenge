const app = require('./app');
const http = require('http');

// Get port from environment and store in Express.
const port = process.env.PORT || '8080';
app.set('port', port);

// Create HTTP server.
app.listen(port, () => {
    console.log(`Server running in port: ${port}`)
});