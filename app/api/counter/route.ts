import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const result = await sql`SELECT count FROM generation_counter WHERE id = 1`;
    const count = result[0]?.count ?? 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching counter:', error);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const result = await sql`
      UPDATE generation_counter 
      SET count = count + 1 
      WHERE id = 1 
      RETURNING count
    `;
    const count = result[0]?.count ?? 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return NextResponse.json({ count: 0 });
  }
}
