import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { migratePhonesToDatabase } from '@/lib/migrate-data';
import { migrateImagesToBase64 } from '@/lib/migrate-images';

// Ensure data is migrated on first request
let migrated = false;
if (!migrated) {
  migratePhonesToDatabase();
  migrateImagesToBase64();
  migrated = true;
}

// GET - List all phones
export async function GET() {
  try {
    const phones = db.prepare(`
      SELECT
        id, brand, name, year_start as yearStart, year_end as yearEnd,
        kept, liked, image, image_data, created_at as createdAt, updated_at as updatedAt
      FROM phones
      ORDER BY year_end DESC NULLS FIRST, year_start DESC
    `).all();

    // Convert integer booleans back to boolean and use image_data if available
    const formattedPhones = phones.map((phone: any) => ({
      ...phone,
      kept: Boolean(phone.kept),
      liked: Boolean(phone.liked),
      // Use image_data if available, otherwise fall back to image path
      image: phone.image_data || phone.image,
      image_data: undefined, // Don't send this to client
    }));

    return NextResponse.json(formattedPhones);
  } catch (error) {
    console.error('Error fetching phones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    );
  }
}

// POST - Create a new phone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, name, yearStart, yearEnd, kept, liked, image } = body;

    // Validation
    if (!brand || !name || !yearStart || !image) {
      return NextResponse.json(
        { error: 'Missing required fields: brand, name, yearStart, image' },
        { status: 400 }
      );
    }

    // If image is a data URL (base64), store in image_data, otherwise in image
    const isDataUrl = image.startsWith('data:');

    const insert = db.prepare(`
      INSERT INTO phones (brand, name, year_start, year_end, kept, liked, image, image_data)
      VALUES (@brand, @name, @yearStart, @yearEnd, @kept, @liked, @image, @imageData)
    `);

    const result = insert.run({
      brand,
      name,
      yearStart,
      yearEnd: yearEnd || null,
      kept: kept ? 1 : 0,
      liked: liked ? 1 : 0,
      image: isDataUrl ? '' : image,
      imageData: isDataUrl ? image : null,
    });

    const newPhone = db.prepare('SELECT * FROM phones WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newPhone, { status: 201 });
  } catch (error) {
    console.error('Error creating phone:', error);
    return NextResponse.json(
      { error: 'Failed to create phone' },
      { status: 500 }
    );
  }
}
