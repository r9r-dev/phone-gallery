import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Get a single phone by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const phone = db.prepare(`
      SELECT
        id, brand, name, year_start as yearStart, year_end as yearEnd,
        kept, liked, image, created_at as createdAt, updated_at as updatedAt
      FROM phones
      WHERE id = ?
    `).get(params.id);

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...phone,
      kept: Boolean((phone as any).kept),
      liked: Boolean((phone as any).liked),
    });
  } catch (error) {
    console.error('Error fetching phone:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone' },
      { status: 500 }
    );
  }
}

// PUT - Update a phone
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { brand, name, yearStart, yearEnd, kept, liked, image } = body;

    const update = db.prepare(`
      UPDATE phones
      SET brand = @brand,
          name = @name,
          year_start = @yearStart,
          year_end = @yearEnd,
          kept = @kept,
          liked = @liked,
          image = @image,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);

    const result = update.run({
      id: params.id,
      brand,
      name,
      yearStart,
      yearEnd: yearEnd || null,
      kept: kept ? 1 : 0,
      liked: liked ? 1 : 0,
      image,
    });

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      );
    }

    const updatedPhone = db.prepare('SELECT * FROM phones WHERE id = ?').get(params.id);
    return NextResponse.json(updatedPhone);
  } catch (error) {
    console.error('Error updating phone:', error);
    return NextResponse.json(
      { error: 'Failed to update phone' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a phone
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = db.prepare('DELETE FROM phones WHERE id = ?').run(params.id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Phone deleted successfully' });
  } catch (error) {
    console.error('Error deleting phone:', error);
    return NextResponse.json(
      { error: 'Failed to delete phone' },
      { status: 500 }
    );
  }
}
