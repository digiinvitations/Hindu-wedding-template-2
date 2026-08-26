const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

const weddingConfig = JSON.parse(fs.readFileSync('./src/data/wedding_config.json', 'utf8'));

async function seed() {
  try {
    await setDoc(doc(db, "settings", "config"), weddingConfig);
    console.log("FIRESTORE SEEDED WITH NEW DEFAULTS!");
  } catch (err) {
    console.error("FIRESTORE ERROR:", err);
  }
}
seed().catch(console.error);
