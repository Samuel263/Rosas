// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsY-aL1y8ZSZSbfNIu5DwX0MpabBII8iA",
  authDomain: "samuelc-84809.firebaseapp.com",
  projectId: "samuelc-84809",
  storageBucket: "samuelc-84809.appspot.com",
  messagingSenderId: "819870940737",
  appId: "1:819870940737:web:1b0f853cf4a5ff013ed0c0",
  measurementId: "G-NZP5S4TSHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Mostrar mensajes al usuario
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? 'red' : 'green';
}

// Registro de usuario
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('userpassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Usuario registrado:', user);

        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            createdAt: serverTimestamp()
        });

        showMessage('Registro exitoso!');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        showMessage('Error al registrar usuario: ' + error.message, true);
    }
});

// Inicio de sesión
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('userpassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Usuario ha iniciado sesión
            const user = userCredential.user;
            console.log('Usuario ha iniciado sesión:', user);
            showMessage('Inicio de sesión exitoso!');
        })
        .catch((error) => {
            console.error('Error al iniciar sesión:', error);
            showMessage('Error al iniciar sesión: ' + error.message, true);
        });
});