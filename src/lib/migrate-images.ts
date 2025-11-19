import db from './db';
import fs from 'fs';
import path from 'path';

/**
 * Migrate images from file system to base64 in database
 * This function reads images from public/phones/ and stores them as base64 in the database
 */
export function migrateImagesToBase64() {
  // Get all phones that have image path but no image_data
  const phones = db.prepare(`
    SELECT id, image
    FROM phones
    WHERE image_data IS NULL
  `).all() as Array<{ id: number; image: string }>;

  console.log(`Found ${phones.length} phones to migrate images for`);

  const publicDir = path.join(process.cwd(), 'public');
  let migratedCount = 0;
  let errorCount = 0;

  for (const phone of phones) {
    try {
      // Remove leading slash from image path
      const imagePath = phone.image.startsWith('/') ? phone.image.slice(1) : phone.image;
      const fullPath = path.join(publicDir, imagePath);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.warn(`Image not found: ${fullPath}`);
        errorCount++;
        continue;
      }

      // Read image and convert to base64
      const imageBuffer = fs.readFileSync(fullPath);
      const base64Image = imageBuffer.toString('base64');

      // Detect MIME type from file extension
      const ext = path.extname(fullPath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
      };
      const mimeType = mimeTypes[ext] || 'image/jpeg';

      // Create data URL
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      // Update database
      db.prepare(`
        UPDATE phones
        SET image_data = ?
        WHERE id = ?
      `).run(dataUrl, phone.id);

      migratedCount++;
    } catch (error) {
      console.error(`Error migrating image for phone ${phone.id}:`, error);
      errorCount++;
    }
  }

  console.log(`Migration complete: ${migratedCount} succeeded, ${errorCount} failed`);
  return { migratedCount, errorCount };
}
