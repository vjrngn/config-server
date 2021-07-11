import { Server } from 'http';
import { Application } from 'express';

require('dotenv').config();
const http = require('http');
const initApp = require('./main');

initApp(process.env).then((app: Application) => {
  /**
   * Get port from environment and store in Express.
   */
  const port = process.env.PORT || 3000;
  app.set('port', port);

  /**
   * Create HTTP server.
   */
  const server: Server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`${process.env.PORT} is already in use`);
      process.exit(1);
    } else {
      throw error;
    }
  });
  server.on('listening', () => {
    console.log(`Server listening on port ${port}`);
  });
});
