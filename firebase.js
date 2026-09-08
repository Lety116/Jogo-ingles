import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1Gmxsy1pP6NRi0Wo-T0icI1CeCz05K_M",
  authDomain: "trabalho-7e7cb.firebaseapp.com",
  projectId: "trabalho-7e7cb",
  storageBucket: "trabalho-7e7cb.firebasestorage.app",
  messagingSenderId: "240558393412",
  appId: "1:240558393412:web:d5920280ce6e6ed273d411",
  measurementId: "G-0EHV8YQWLL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); // registra cada acesso ao site, com data e horário

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs
};

// Salva a pontuação do usuário 
export async function saveScoreIfBest(uid, name, score, total, colecao = "scores") {
  const ref = doc(db, colecao, uid);
  const existing = await getDoc(ref);
  if (!existing.exists() || score > existing.data().score) {
    await setDoc(ref, {
      name,
      score,
      total,
      updatedAt: new Date().toISOString()
    });
  }
}

// Busca os 5 melhores colocados no placar escolhido
export async function getLeaderboard(colecao = "scores") {
  const q = query(collection(db, colecao), orderBy("score", "desc"), limit(5));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

// Registra um acesso ao site: nome, e-mail e data/horário.
export async function registrarAcesso(uid, name, email) {
  await addDoc(collection(db, "acessos"), {
    uid,
    name,
    email,
    dataHora: new Date().toISOString()
  });
}