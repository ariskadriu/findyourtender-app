import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export type Language = 'sq' | 'en' | 'sr' | 'de';

export async function getTranslations(langOverride?: Language) {
  const cookieStore = cookies();
  const lang = langOverride || (cookieStore.get('fyt-locale')?.value as Language) || 'sq';
  
  const filePath = path.join(process.cwd(), 'locales', `${lang}.json`);
  let fileContent: string;
  
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch {
    // Fallback to sq if file doesn't exist
    fileContent = fs.readFileSync(path.join(process.cwd(), 'locales', 'sq.json'), 'utf8');
  }
  
  const translations = JSON.parse(fileContent);

  return (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 2) {
      return translations[parts[0]]?.[parts[1]] || key;
    }
    return key;
  };
}
