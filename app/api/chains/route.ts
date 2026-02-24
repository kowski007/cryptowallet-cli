import { NextResponse } from 'next/server';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const chainsDir = join(process.cwd(), 'src', 'chains');
    const files = readdirSync(chainsDir).filter(f => f.endsWith('.json'));
    
    const chains = files.map(file => {
      const content = readFileSync(join(chainsDir, file), 'utf-8');
      const chainData = JSON.parse(content);
      const symbol = file.replace('.json', '');
      
      return {
        symbol,
        title: chainData.title || symbol,
        formats: chainData.formats ? Object.keys(chainData.formats) : ['default'],
        defaultFormat: chainData.defaultFormat || 'default',
      };
    }).sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json({ chains });
  } catch (error) {
    console.error('Error loading chains:', error);
    return NextResponse.json(
      { error: 'Failed to load chains' },
      { status: 500 }
    );
  }
}
