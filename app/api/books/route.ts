import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const db = await getDatabase();
  const books = await db.collection('books').find({}).toArray();
  return NextResponse.json(books);
}

