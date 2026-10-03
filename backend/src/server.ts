import { createApp } from './app.js';
import { config } from './config.js';
import { runMigrations } from './db/migrate.js';
import { db } from './db/index.js';

async function bootstrap() {
  try {
    // 1. Run migrations & initial seeds
    await runMigrations();

    // 2. Start HTTP server
    const app = createApp();
    const server = app.listen(config.port, config.host, () => {
      console.log(`
🚀 ConnectHub Hola Map Backend API is running!
📡 URL: http://localhost:${config.port}
🔗 Healthcheck: http://localhost:${config.port}/api/health
🗺️ Places API: http://localhost:${config.port}/api/places
📍 Map Pinning (Chấm bản đồ): POST http://localhost:${config.port}/api/places
🏷️ Categories API: http://localhost:${config.port}/api/categories
💾 Database: ${db.isPostgres ? 'PostgreSQL/Supabase' : 'SQLite (Local Embedded)'}
      `);
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await db.close();
        console.log('💤 Database connection closed. Process exited.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start backend server:', error);
    process.exit(1);
  }
}

bootstrap();
