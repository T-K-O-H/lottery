import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const result = await sql`SELECT total_generations FROM generation_counter WHERE id = 1`;
    const count = result[0]?.total_generations ?? 0;
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
      SET total_generations = total_generations + 1, updated_at = NOW()
      WHERE id = 1 
      RETURNING total_generations
    `;
    const count = result[0]?.total_generations ?? 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return NextResponse.json({ count: 0 });
  }
}
