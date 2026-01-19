
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNWdslVkqoDDKAB8noBRH6i2x2Em0JcQo",
  authDomain: "e-bus-c3a46.firebaseapp.com",
  projectId: "e-bus-c3a46",

  storageBucket: "e-bus-c3a46.firebasestorage.app",
  messagingSenderId: "1018191843873",
  appId: "1:1018191843873:web:5141fef749bf630d544960"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.auth = auth;
window.db = db;

function showPage(page){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  if(page === "home") document.getElementById("homePage").classList.add("active");
  if(page === "login") document.getElementById("loginPage").classList.add("active");
  if(page === "register") document.getElementById("registerPage").classList.add("active");
  if(page === "admin") document.getElementById("adminDashboard").classList.add("active");
  if(page === "driver") document.getElementById("driverDashboard").classList.add("active");
  if(page === "user") document.getElementById("userDashboard").classList.add("active");
}

function logout(){
  auth.signOut();
  showPage("home");
}

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const first = document.getElementById("regFirstName").value;
  const last = document.getElementById("regLastName").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPassword").value;

  try{
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);

    await setDoc(doc(db, "users", userCred.user.uid), {
      firstName:first,
      lastName:last,
      email:email,
      role:"user"
    });

    alert("Registered Successfully");
    showPage("login");

  }catch(err){
    alert(err.message);
  }
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;
  const role = document.getElementById("userRole").value;

  try{
    const userCred = await signInWithEmailAndPassword(auth, email, pass);

    const userDoc = await getDoc(doc(db, "users", userCred.user.uid));

    if(userDoc.exists()){
      const userData = userDoc.data();

      if(userData.role === role){
        alert("Login Success");

        if(role === "admin") showPage("admin");
        if(role === "driver") showPage("driver");
        if(role === "user") showPage("user");

      } else{
        alert("Wrong role selected!");
      }
    }

  }catch(err){
    alert(err.message);
  }
});

const createDriverForm = document.getElementById("createDriverForm");

createDriverForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const name = document.getElementById("driverName").value;
  const email = document.getElementById("driverEmail").value;
  const pass = document.getElementById("driverPassword").value;

  try{
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);

    await setDoc(doc(db, "users", userCred.user.uid), {
      firstName:name,
      email:email,
      role:"driver"
    });

    alert("Driver Account Created");

  }catch(err){
    alert(err.message);
  }
})

const busForm = document.getElementById("busInfoForm");

busForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const busNumber = document.getElementById("busNumber").value;
  const route = document.getElementById("busRoute").value;
  const capacity = document.getElementById("busCapacity").value;
  const operator = document.getElementById("busOperator").value;
  const location = document.getElementById("currentLocation").value;

  await addDoc(collection(db,"buses"),{
    busNumber,
    route,
    capacity,
    operator,
    location,
    status:"active"
  });

  alert("Bus Info Posted");
});


async function loadBuses(){
  const snapshot = await getDocs(collection(db,"buses"));
  const table = document.getElementById("userBusesTable");

  table.innerHTML = "";

  snapshot.forEach(doc=>{
    const bus = doc.data();

    table.innerHTML += `
      <tr>
        <td>${bus.busNumber}</td>
        <td>${bus.route}</td>
        <td>${bus.operator}</td>
        <td>${bus.location}</td>
        <td>--</td>
        <td>${bus.operator}</td>
      </tr>`;
  });
}

window.loadBuses = loadBuses;


window.showPage = function(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  if(page === "home") document.getElementById("homePage").classList.add("active");
  if(page === "login") document.getElementById("loginPage").classList.add("active");
  if(page === "register") document.getElementById("registerPage").classList.add("active");
  if(page === "admin") document.getElementById("adminDashboard").classList.add("active");
  if(page === "driver") document.getElementById("driverDashboard").classList.add("active");
  if(page === "user") document.getElementById("userDashboard").classList.add("active");
}

window.logout = function(){
  auth.signOut();
  showPage("home");
}







