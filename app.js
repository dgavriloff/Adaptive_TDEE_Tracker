const express = require('express');
const admin = require('firebase-admin');
const app = express()

//Initialize firebase sdk
const serviceAccount = require('./keys/firebase-adminsdk.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());

app.get('/users', async (req, res) => {
  try{
    const snapshot = await db.collection('users').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message)
  }
});

app.get('/users/:docId', async (req, res) => {
  try{
    const docId = req.params.docId;
    const docRef = db.collection('users').doc(docId);
    const docSnapshot = await docRef.get();

    if(!docSnapshot.exists){
      return res.status(404).send('Document not found');
    }

    res.status(200).send(docSnapshot);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})