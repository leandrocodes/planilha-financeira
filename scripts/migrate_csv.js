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

const delay = ms => new Promise(res => setTimeout(res, ms));

async function migrate() {
  const content = fs.readFileSync(join(__dirname, '..', 'Planilha Financeira - 2026.csv'), 'utf8');
  
  // Basic CSV line parser to handle quotes
  const lines = content.split('\n');
  const transactions = [];

  let currentType = null;
  let expenseType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Simple split respecting basic quotes
    const row = line.replace(/\r/g, '').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    // Determine section
    if (row[1] && row[1].includes('ENTRADA: RECEITAS')) {
      currentType = 'income';
      expenseType = 'fixa';
      continue;
    } else if (row[1] && row[1].includes('SAÍDA: DESPESAS FIXAS')) {
      currentType = 'expense';
      expenseType = 'fixa';
      continue;
    } else if (row[1] && row[1].includes('SAÍDA: DESPESAS VARIÁVEIS')) {
      currentType = 'expense';
      expenseType = 'variavel';
      continue;
    } else if (row[0] === 'TOTAL' || row[1] === 'TOTAL') {
      currentType = null;
      continue;
    }

    if (!currentType) continue;

    const title = row[0].replace(/"/g, '').trim();
    if (!title || ['RECEITA', 'FIXO', 'VARIÁVEL', 'BALANÇO', 'ACUMULADO', 'TOTAL'].includes(title.toUpperCase().trim())) continue;

    for (let month = 1; month <= 12; month++) {
      // Column shift: in CSV, Jan is at col 2 (actually 2 but row split might vary since col 1 is sometimes empty. 
      // Look at original line: title,,Jan,Fev... wait, let's look at the header:
      // "PLANILHA DE CONTROLE FINANCEIRO",JANEIRO,FEVEREIRO...
      // Col 0: Title, Col 1: Jan, Col 2: Fev... NO!
      // Row 6: Salário Leandro,," R$  526,00 "," R$  7.780,00 "...
      // Title is col 0, empty col 1, col 2 is Jan, col 3 is Fev.
      let amountStr = row[month + 1];
      if (!amountStr) continue;
      
      amountStr = amountStr.replace(/"/g, '').trim();
      if (amountStr === '-' || amountStr === '') continue;

      if (amountStr.includes('R$')) {
        amountStr = amountStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
        const amount = Number(amountStr);
        if (amount > 0) {
          
          let statusStr = 'pendente';
          if (month < 3) statusStr = 'paga'; // Assume Jan and Feb are paid for initial state
          else if (month === 3) statusStr = 'pendente'; 
          
          const newTx = {
            title: title,
            amount: amount,
            type: currentType,
            status: statusStr,
            month: month,
            year: 2026,
            category: currentType === 'income' ? 'Geral' : 'Despesa',
            date: new Date(2026, month - 1, 15).toISOString()
          };
          if (currentType === 'expense' && expenseType) {
            newTx.expenseType = expenseType;
          }
          transactions.push(newTx);
        }
      }
    }
  }

  console.log(`Found ${transactions.length} transactions in CSV to migrate. Inserting...`);
  
  const batchSize = 5;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    await Promise.all(batch.map(t => addDoc(collection(db, 'transactions'), t)));
    console.log(`Inserted ${i + batch.length}/${transactions.length}`);
    await delay(100); 
  }
  
  console.log("Migration complete!");
  process.exit(0);
}

migrate();
