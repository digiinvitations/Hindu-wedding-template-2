const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

async function check() {
  try {
    await setDoc(doc(db, "settings", "test_write"), { success: true });
    console.log("FIRESTORE WRITE SUCCESSFUL!");
  } catch (err) {
    console.error("FIRESTORE ERROR:", err);
  }
}
check().catch(console.error);
