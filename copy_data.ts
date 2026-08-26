import { db } from './src/lib/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

async function run() {
  console.log("Fetching settings/config...");
  const docRef1 = doc(db, 'settings', 'config');
  const docSnap1 = await getDoc(docRef1);
  console.log("Old settings/config exists:", docSnap1.exists());
  
  if (docSnap1.exists()) {
    const data = docSnap1.data();
    const docRef2 = doc(db, 'website', 'permanent_data');
    await setDoc(docRef2, { data: data });
    console.log("Successfully copied data to website/permanent_data.");
  } else {
    console.log("No data found in settings/config to copy.");
  }
  process.exit(0);
}

run().catch(console.error);
