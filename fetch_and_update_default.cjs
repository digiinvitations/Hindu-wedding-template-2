const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const docRef = doc(db, "website", "permanent_data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data().data;
      fs.writeFileSync('./src/data/wedding_config.json', JSON.stringify(data, null, 2), 'utf8');
      console.log("Successfully updated src/data/wedding_config.json with the latest from Firestore");
    } else {
      console.log("No data found in website/permanent_data");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
