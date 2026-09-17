import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

let server;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    server = app.listen(env.PORT, () => {
      console.log(`🚀 Smart Restaurant POS Server running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

const handleGracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await disconnectDB();
        console.log('Database connections closed cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error during database disconnect:', err.message);
        process.exit(1);
      }
    });

    // Force close if graceful shutdown takes longer than 10 seconds
    setTimeout(() => {
      console.error('Graceful shutdown timeout exceeded. Forcing exit.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

startServer();

export default server;
