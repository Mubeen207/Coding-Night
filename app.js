const firebaseConfig = {
  apiKey: "AIzaSyAsxRhyY6ASi7ZIUj33Tubs-Lq_bzxzRtQ",
  authDomain: "codding-night.firebaseapp.com",
  projectId: "codding-night",
  storageBucket: "codding-night.firebasestorage.app",
  messagingSenderId: "1010809930007",
  appId: "1:1010809930007:web:7f48527e736cf3eeb7f752",
  measurementId: "G-C4VT89B01G"
};
firebase.initializeApp(firebaseConfig);
let fb = firebase.auth();
const db = firebase.firestore();
let emailEl = document.getElementById("email");
let passwordEl = document.getElementById("password");
let message = document.getElementById("message");

function signUp() {
  fb.createUserWithEmailAndPassword(emailEl.value, passwordEl.value)
    .then((userCredential) => {
      var user = userCredential.user;
      message.innerHTML = "Sign up Successful";
      message.style.color = "green";
      localStorage.setItem("uid", JSON.stringify(fb.currentUser));
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      message.innerHTML = errorCode + " " + errorMessage;
      message.style.color = "red";
    });
}

function signIn() {
  fb.signInWithEmailAndPassword(emailEl.value, passwordEl.value)
    .then((userCredential) => {
      let user = userCredential.user;
      message.innerHTML = "Sign up Successful";
      message.style.color = "green";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      message.innerHTML = errorCode + " " + errorMessage;
      message.style.color = "red";
    });
}

function signOut() {
  localStorage.clear();
  fb.signOut()
    .then(() => {
      console.log("Sign Out");
    })
    .catch((error) => {
      console.log(error);
    });
}
