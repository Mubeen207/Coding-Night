const firebaseConfig = {
  // apiKey: "",
  // authDomain: "",
  // projectId: "",
  // storageBucket: "",
  // messagingSenderId: "",
  // appId: "",
  // measurementId: "",
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
