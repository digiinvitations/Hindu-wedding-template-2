const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, getDoc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

async function check() {
  console.log("Checking settings/config...");
  try {
    const docRef1 = doc(db, "settings", "config");
    const docSnap1 = await getDoc(docRef1);
    
    if (docSnap1.exists()) {
      const data = docSnap1.data();
      const docRef2 = doc(db, "website", "permanent_data");
      await setDoc(docRef2, { data: data });
      console.log("Successfully copied data from settings/config to website/permanent_data.");
    } else {
      console.log("Old settings/config does not exist.");
    }
    process.exit(0);
  } catch (err) {
    console.error("FIRESTORE ERROR:", err);
    process.exit(1);
  }
}
check().catch(console.error);
