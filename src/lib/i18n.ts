import fs from 'fs';
import path from 'path';

export type Language = 'sq' | 'en' | 'sr' | 'de';

export async function getTranslations(lang: Language = 'sq') {
  const filePath = path.join(process.cwd(), 'locales', `${lang}.json`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const translations = JSON.parse(fileContent);

  return (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 2) {
      return translations[parts[0]]?.[parts[1]] || key;
    }
    return key;
  };
}
