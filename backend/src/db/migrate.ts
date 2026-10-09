import bcrypt from 'bcryptjs';
import { db } from './index.js';
import { INITIAL_CATEGORIES, INITIAL_SURVEYORS, INITIAL_USERS, INITIAL_PLACES } from './seedData.js';

export async function runMigrations(): Promise<void> {
  console.log('🔄 Checking and applying database migrations...');

  if (db.isPostgres) {
    // PostgreSQL / Supabase Schema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contributions (
          id BIGSERIAL PRIMARY KEY,
          contributor_name VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'surveyor',
          email VARCHAR(100),
          avatar VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

      CREATE TABLE IF NOT EXISTS places (
          id BIGSERIAL PRIMARY KEY,
          category_id BIGINT REFERENCES categories(id),
          contribution_id BIGINT REFERENCES contributions(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          area VARCHAR(100),
          address TEXT,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          min_price INTEGER,
          max_price INTEGER,
          rent_price INTEGER,
          electricity_price INTEGER,
          water_price TEXT,
          room_status VARCHAR(50),
          opening_hours TEXT,
          phone VARCHAR(50),
          amenities TEXT[],
          images TEXT[],
          gps_accuracy DOUBLE PRECISION,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
          id BIGSERIAL PRIMARY KEY,
          place_id BIGINT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
          contribution_id BIGINT REFERENCES contributions(id) ON DELETE SET NULL,
          author_name VARCHAR(100),
          rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reports (
          id BIGSERIAL PRIMARY KEY,
          place_id BIGINT REFERENCES places(id) ON DELETE CASCADE,
          reason VARCHAR(50) NOT NULL,
          note TEXT,
          contact_email VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);
      CREATE INDEX IF NOT EXISTS idx_places_latitude ON places(latitude);
      CREATE INDEX IF NOT EXISTS idx_places_longitude ON places(longitude);
      CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id);

      -- Ensure gps_accuracy column exists if table pre-existed
      ALTER TABLE places ADD COLUMN IF NOT EXISTS gps_accuracy DOUBLE PRECISION;
    `);
  } else {
    // SQLite Schema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contributions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contributor_name VARCHAR(100) NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(50) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'surveyor',
          email VARCHAR(100),
          avatar VARCHAR(255),
          is_active INTEGER DEFAULT 1,
          last_login DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

      CREATE TABLE IF NOT EXISTS places (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_id INTEGER REFERENCES categories(id),
          contribution_id INTEGER REFERENCES contributions(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          area VARCHAR(100),
          address TEXT,
          latitude REAL,
          longitude REAL,
          min_price INTEGER,
          max_price INTEGER,
          rent_price INTEGER,
          electricity_price INTEGER,
          water_price TEXT,
          room_status VARCHAR(50),
          opening_hours TEXT,
          phone VARCHAR(50),
          amenities TEXT,
          images TEXT,
          gps_accuracy REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
          contribution_id INTEGER REFERENCES contributions(id) ON DELETE SET NULL,
          author_name VARCHAR(100),
          rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          place_id INTEGER REFERENCES places(id) ON DELETE CASCADE,
          reason VARCHAR(50) NOT NULL,
          note TEXT,
          contact_email VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);
      CREATE INDEX IF NOT EXISTS idx_places_latitude ON places(latitude);
      CREATE INDEX IF NOT EXISTS idx_places_longitude ON places(longitude);
      CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id);
    `);

    // Ensure gps_accuracy column exists if table pre-existed
    try {
      await db.exec('ALTER TABLE places ADD COLUMN gps_accuracy REAL;');
    } catch {
      // Column already exists, safe to ignore
    }
  }

  // 1. Seed Categories if empty
  const catCount = await db.query('SELECT COUNT(*) as count FROM categories');
  const totalCats = Number(catCount.rows[0]?.count || 0);
  if (totalCats === 0) {
    console.log('🌱 Seeding default categories...');
    for (const cat of INITIAL_CATEGORIES) {
      if (db.isPostgres) {
        await db.query(
          'INSERT INTO categories (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
          [cat.name, cat.description]
        );
      } else {
        await db.query(
          'INSERT OR IGNORE INTO categories (name, description) VALUES ($1, $2)',
          [cat.name, cat.description]
        );
      }
    }
  }

  // 2. Seed Surveyors from Read_me.txt into contributions
  const contribCount = await db.query('SELECT COUNT(*) as count FROM contributions');
  const totalContribs = Number(contribCount.rows[0]?.count || 0);
  if (totalContribs === 0) {
    console.log('🌱 Seeding survey contributors...');
    for (const name of INITIAL_SURVEYORS) {
      if (db.isPostgres) {
        await db.query(
          'INSERT INTO contributions (contributor_name) VALUES ($1) ON CONFLICT (contributor_name) DO NOTHING',
          [name]
        );
      } else {
        await db.query(
          'INSERT OR IGNORE INTO contributions (contributor_name) VALUES ($1)',
          [name]
        );
      }
    }
  }

  // 3. Seed Users & Admins (6 members + system admin with bcrypt hashes)
  const userCount = await db.query('SELECT COUNT(*) as count FROM users');
  const totalUsers = Number(userCount.rows[0]?.count || 0);
  if (totalUsers === 0) {
    console.log('🌱 Seeding admin and surveyor accounts with bcrypt hashes...');
    for (const u of INITIAL_USERS) {
      const passwordHash = bcrypt.hashSync(u.password, 10);
      if (db.isPostgres) {
        await db.query(
          `INSERT INTO users (username, password_hash, full_name, role, email)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (username) DO NOTHING`,
          [u.username, passwordHash, u.fullName, u.role, u.email]
        );
      } else {
        await db.query(
          `INSERT OR IGNORE INTO users (username, password_hash, full_name, role, email)
           VALUES ($1, $2, $3, $4, $5)`,
          [u.username, passwordHash, u.fullName, u.role, u.email]
        );
      }
    }
    console.log(`✅ Seeded ${INITIAL_USERS.length} authenticated users & admins!`);
  }

  // 4. Seed Places if empty
  const placeCount = await db.query('SELECT COUNT(*) as count FROM places');
  const totalPlaces = Number(placeCount.rows[0]?.count || 0);
  if (totalPlaces === 0) {
    console.log('🌱 Seeding initial places and reviews...');

    // Fetch categories and contributions mapping
    const cats = await db.query('SELECT id, name FROM categories');
    const catMap = new Map<string, number>();
    cats.rows.forEach((r) => catMap.set(r.name, Number(r.id)));

    const contribs = await db.query('SELECT id, contributor_name FROM contributions');
    const contribMap = new Map<string, number>();
    contribs.rows.forEach((r) => contribMap.set(r.contributor_name, Number(r.id)));

    for (const p of INITIAL_PLACES) {
      const catId = catMap.get(p.categoryName) || null;
      const contribId = contribMap.get(p.contributorName) || null;

      const amenitiesVal = db.isPostgres ? p.amenities : JSON.stringify(p.amenities);
      const imagesVal = db.isPostgres ? p.images : JSON.stringify(p.images);

      const res = await db.query(
        `INSERT INTO places (
          category_id, contribution_id, name, area, address,
          latitude, longitude, min_price, max_price, rent_price,
          electricity_price, water_price, room_status, opening_hours,
          phone, amenities, images
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING id`,
        [
          catId,
          contribId,
          p.name,
          p.area,
          p.address,
          p.latitude,
          p.longitude,
          p.min_price,
          p.max_price,
          p.rent_price,
          p.electricity_price,
          p.water_price,
          p.room_status,
          p.opening_hours,
          p.phone,
          amenitiesVal,
          imagesVal,
        ]
      );

      const newPlaceId = res.rows[0]?.id;

      if (newPlaceId && p.reviews && p.reviews.length > 0) {
        for (const rev of p.reviews) {
          const revContribId = contribMap.get(rev.author) || null;
          await db.query(
            `INSERT INTO reviews (place_id, contribution_id, author_name, rating, content)
             VALUES ($1, $2, $3, $4, $5)`,
            [newPlaceId, revContribId, rev.author, rev.rating, rev.content]
          );
        }
      }
    }
    console.log(`✅ Seeded ${INITIAL_PLACES.length} places with reviews!`);
  }

  console.log('✅ Database migration & setup completed successfully!');
}
