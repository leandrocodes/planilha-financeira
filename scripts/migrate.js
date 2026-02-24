import fs from 'fs';
import dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  const data = JSON.parse(fs.readFileSync(join(__dirname, '..', 'dump.json'), 'utf8'));
  
  let currentType = null;
  const transactions = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    // Detect section header by checking column 1 (some rows have empty first col and text in 2nd col)
    if (row[1] && typeof row[1] === 'string') {
      const sectionHeader = row[1].toUpperCase();
      if (sectionHeader.includes('ENTRADA: RECEITAS')) { currentType = 'income'; continue; }
      else if (sectionHeader.includes('SAÍDA:')) { currentType = 'expense'; continue; }
      else if (sectionHeader === 'TOTAL') { currentType = null; continue; }
    }

    if (!currentType) continue;

    const title = row[0];
    if (!title || typeof title !== 'string') continue;
    
    // Ignore summary/totals rows
    const normalizedTitle = title.toUpperCase().trim();
    if (['TOTAL', 'RECEITA', 'FIXO', 'VARIÁVEL', 'BALANÇO', 'ACUMULADO'].includes(normalizedTitle)) continue;

    for (let month = 1; month <= 12; month++) {
      const amount = row[month];
      if (amount && typeof amount === 'number' && amount > 0) {
        transactions.push({
          title: title.trim(),
          amount: amount,
          type: currentType,
          month: month,
          year: 2026,
          category: currentType === 'income' ? 'Geral' : 'Despesa',
          date: new Date(2026, month - 1, 15).toISOString()
        });
      }
    }
  }

  console.log(`Found ${transactions.length} transactions to migrate. Inserting...`);
  
  for (const t of transactions) {
    try {
      await addDoc(collection(db, 'transactions'), t);
    } catch (e) {
      console.error(`Error inserting ${t.title}:`, e);
    }
  }
  
  console.log("Migration complete!");
  process.exit(0);
}

migrate();
