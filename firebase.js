// firebase.js
// Firebase initialisation + auth lifecycle
// Provides: window.fbAuth, window.fbDb, window.currentUser

(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCaybQkWFpo1PekHD59LckB_Za2WD6Q2W0",
    authDomain: "planner-94bdb.firebaseapp.com",
    projectId: "planner-94bdb",
    storageBucket: "planner-94bdb.firebasestorage.app",
    messagingSenderId: "615191337955",
    appId: "1:615191337955:web:92a680dae4e350bbb59ed6"
  };

  if (!window.firebase) {
    console.warn("Firebase SDK not loaded.");
    return;
  }

  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  db.settings({ ignoreUndefinedProperties: true });

  window.fbAuth = auth;
  window.fbDb = db;
  window.currentUser = null;

 
  console.log("Firebase initialised");

})();
