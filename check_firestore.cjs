const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

async function check() {
  try {
    const docSnap = await getDoc(doc(db, "settings", "config"));
    if (docSnap.exists()) {
      console.log("FIRESTORE CONFIG FOUND:", Object.keys(docSnap.data()));
    } else {
      console.log("FIRESTORE CONFIG DOES NOT EXIST.");
    }
  } catch (err) {
    console.error("FIRESTORE ERROR:", err);
  }
}
check().catch(console.error);
