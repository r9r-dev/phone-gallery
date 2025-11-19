import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Get database path - in production, use a persistent volume
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'phones.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS phones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      name TEXT NOT NULL,
      year_start INTEGER NOT NULL,
      year_end INTEGER,
      kept BOOLEAN NOT NULL DEFAULT 0,
      liked BOOLEAN NOT NULL DEFAULT 1,
      image TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_phones_brand ON phones(brand);
    CREATE INDEX IF NOT EXISTS idx_phones_year_start ON phones(year_start);
    CREATE INDEX IF NOT EXISTS idx_phones_year_end ON phones(year_end);
  `);

  // Migration: Add image_data column for base64 images if it doesn't exist
  const hasImageData = db.prepare(`
    SELECT COUNT(*) as count
    FROM pragma_table_info('phones')
    WHERE name = 'image_data'
  `).get() as { count: number };

  if (hasImageData.count === 0) {
    db.exec(`ALTER TABLE phones ADD COLUMN image_data TEXT;`);
  }
}

// Run initialization
initializeDatabase();

export default db;
