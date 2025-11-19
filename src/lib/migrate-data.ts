import db from './db';
import { phones } from '../components/phones';

export function migratePhonesToDatabase() {
  // Check if data already exists
  const count = db.prepare('SELECT COUNT(*) as count FROM phones').get() as { count: number };

  if (count.count > 0) {
    console.log('Database already contains data, skipping migration.');
    return;
  }

  console.log('Migrating phone data to database...');

  const insert = db.prepare(`
    INSERT INTO phones (brand, name, year_start, year_end, kept, liked, image)
    VALUES (@brand, @name, @yearStart, @yearEnd, @kept, @liked, @image)
  `);

  const insertMany = db.transaction((phonesData) => {
    for (const phone of phonesData) {
      insert.run({
        brand: phone.brand,
        name: phone.name,
        yearStart: phone.yearStart,
        yearEnd: phone.yearEnd,
        kept: phone.kept ? 1 : 0,
        liked: phone.liked ? 1 : 0,
        image: phone.image,
      });
    }
  });

  try {
    insertMany(phones);
    console.log(`Successfully migrated ${phones.length} phones to database.`);
  } catch (error) {
    console.error('Error migrating data:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migratePhonesToDatabase();
  process.exit(0);
}
