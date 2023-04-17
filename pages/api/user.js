import firebase from '@/firebase/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const userData = req.body;

    // Save user data to Firestore
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(userData.uid);
    await userRef.set(userData);

    res.status(200).json({ message: 'User data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
