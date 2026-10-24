/**
 * 🔒 FIREBASE CONFIGURATION & SERVICE WRAPPER
 * Operation: Make My Favorite Human Smile Again! 🥹💗
 *
 * Deb: Replace the placeholder values below with your Firebase project credentials.
 * You can find them in your Firebase Console: Project Settings -> General -> Your apps -> Web app.
 */

const firebaseConfig = {
  apiKey: "AIzaSyYOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Check if config has been customized by the user or stored in localStorage
const savedConfig = localStorage.getItem('deb_firebase_config');
const activeConfig = savedConfig ? JSON.parse(savedConfig) : firebaseConfig;

let isFirebaseReady = false;
let db = null;
let auth = null;

// Initialize Firebase if valid credentials exist
try {
  if (
    typeof firebase !== 'undefined' &&
    activeConfig.apiKey &&
    !activeConfig.apiKey.includes('YOUR_API_KEY_HERE')
  ) {
    if (!firebase.apps.length) {
      firebase.initializeApp(activeConfig);
    }
    db = firebase.firestore();
    auth = firebase.auth();
    isFirebaseReady = true;
    console.log('✅ Firebase initialized successfully with Firestore & Auth.');
  } else {
    console.warn(
      '⚠️ Firebase is running in Local Simulation Mode. To connect real Firestore, update firebase-config.js or configure it in admin.html.'
    );
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

/**
 * Submit Friend's Response
 * Securely writes to Firestore collection 'responses' or falls back to local storage
 */
async function submitFriendshipResponse(responseData) {
  const payload = {
    friendName: responseData.friendName || 'Bestie',
    smileResponse: responseData.smileResponse || 'Not answered',
    feelingResponse: responseData.feelingResponse || 'Not answered',
    message: responseData.message || '',
    submittedAt: new Date().toISOString(),
    timestamp: isFirebaseReady && firebase.firestore.FieldValue ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
  };

  if (isFirebaseReady && db) {
    // Write to Firestore 'responses' collection
    return await db.collection('responses').add(payload);
  } else {
    // Local simulation fallback (stores in localStorage for testing)
    const existing = JSON.parse(localStorage.getItem('deb_friendship_responses') || '[]');
    existing.unshift({
      id: 'local_' + Date.now(),
      ...payload,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('deb_friendship_responses', JSON.stringify(existing));
    return { id: 'local_' + Date.now(), simulated: true };
  }
}

/**
 * Fetch All Responses (Admin only)
 */
async function fetchAllResponses() {
  if (isFirebaseReady && db) {
    const snapshot = await db.collection('responses').orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } else {
    // Return simulated responses from localStorage
    return JSON.parse(localStorage.getItem('deb_friendship_responses') || '[]');
  }
}

/**
 * Admin Authentication Functions
 */
async function loginAdminUser(email, password) {
  if (isFirebaseReady && auth) {
    return await auth.signInWithEmailAndPassword(email, password);
  } else {
    // Local demo simulation login for Deb: demo@deb.com / bestfriend2026
    if (email === 'deb@admin.com' && password === 'friendship2026') {
      const mockUser = { email: 'deb@admin.com', uid: 'demo_admin_deb' };
      localStorage.setItem('deb_simulated_auth', JSON.stringify(mockUser));
      return { user: mockUser };
    }
    throw new Error('Invalid credentials. (In Local Demo Mode, use email: deb@admin.com and password: friendship2026, or configure your Firebase keys!)');
  }
}

async function logoutAdminUser() {
  if (isFirebaseReady && auth) {
    return await auth.signOut();
  } else {
    localStorage.removeItem('deb_simulated_auth');
    return Promise.resolve();
  }
}

function getAdminAuthState(callback) {
  if (isFirebaseReady && auth) {
    auth.onAuthStateChanged(callback);
  } else {
    const mockUser = JSON.parse(localStorage.getItem('deb_simulated_auth') || 'null');
    callback(mockUser);
  }
}
