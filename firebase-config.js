import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAU-uJj4_tBnrZxJNhK-CWSSui64RWD1g",
  authDomain: "tata-training-system-5210f.firebaseapp.com",
  databaseURL: "https://tata-training-system-5210f-default-rtdb.firebaseio.com",
  projectId: "tata-training-system-5210f",
  storageBucket: "tata-training-system-5210f.firebasestorage.app",
  messagingSenderId: "53740256876",
  appId: "1:53740256876:web:e14bbfeb9d2d28dabb6249",
  measurementId: "G-0BBVW33QTD"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth(app);

export { db, storage, auth };