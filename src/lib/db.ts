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

  // Migration: Add detailed specification columns
  const columns = [
    'review TEXT',
    'network_technology TEXT',
    'launch_date_international TEXT',
    'launch_date_france TEXT',
    'dimensions TEXT',
    'weight TEXT',
    'sim TEXT',
    'display_type TEXT',
    'display_size TEXT',
    'display_resolution TEXT',
    'display_protection TEXT',
    'os TEXT',
    'os_version TEXT',
    'chipset TEXT',
    'cpu TEXT',
    'gpu TEXT',
    'internal_memory TEXT',
    'ram TEXT',
    'main_camera_specs TEXT',
    'main_camera_video TEXT',
    'selfie_camera_specs TEXT',
    'selfie_camera_video TEXT',
    'speakers TEXT',
    'jack_35mm TEXT',
    'wlan TEXT',
    'bluetooth TEXT',
    'positioning TEXT',
    'nfc TEXT',
    'infrared_port TEXT',
    'radio TEXT',
    'usb TEXT',
    'sensors TEXT',
    'battery_type TEXT',
    'battery_capacity TEXT',
    'my_phone_color TEXT',
    'my_phone_storage TEXT'
  ];

  for (const column of columns) {
    const columnName = column.split(' ')[0];
    const hasColumn = db.prepare(`
      SELECT COUNT(*) as count
      FROM pragma_table_info('phones')
      WHERE name = ?
    `).get(columnName) as { count: number };

    if (hasColumn.count === 0) {
      db.exec(`ALTER TABLE phones ADD COLUMN ${column};`);
    }
  }
}

// Run initialization
initializeDatabase();

export default db;
