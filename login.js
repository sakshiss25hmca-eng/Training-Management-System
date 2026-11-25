import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


window.login = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const uid = userCred.user.uid;

    // get role from Firestore
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("No role assigned");
      return;
    }

    const role = userSnap.data().role;

    if (role === "admin") {
      window.location.href = "admin.html";
    }

    else if (role === "trainer") {

  localStorage.setItem(
    "trainerEmail",
    userCred.user.email
  );

  window.location.href = "trainer.html";
}

    else {
      window.location.href = "trainee.html";
    }

  } catch (error) {
    alert(error.message);
  }
}; and <!DOCTYPE html>
<html>
<head>
<title>Trainer Dashboard</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Segoe UI,sans-serif;
}

body{
    background:#f4f6f9;
}

.header{
    background:#00539f;
    color:white;
    padding:20px;
    text-align:center;
}

.container{
    max-width:1200px;
    margin:auto;
    padding:20px;
}

.card{
    background:white;
    padding:20px;
    margin-bottom:20px;
    border-radius:12px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
}

.card h2{
    color:#00539f;
    margin-bottom:15px;
}

input,
textarea,
select{
    width:100%;
    padding:12px;
    margin:10px 0;
    border:1px solid #ccc;
    border-radius:8px;
}

textarea{
    height:120px;
    resize:none;
}

button{
    background:#00539f;
    color:white;
    border:none;
    padding:12px 20px;
    border-radius:8px;
    cursor:pointer;
}

button:hover{
    background:#003f7f;
}

.task-item{
    background:#f8f9fa;
    padding:15px;
    margin-top:10px;
    border-radius:8px;
}

.logout{
    background:#dc3545;
}
</style>

</head>
<body>

<div class="header">
    <h1>Tata Steel Trainer Dashboard</h1>
    <p>Assign Tasks to Trainees</p>
</div>

<div class="container">

    <div class="card">

        <h2>Assign New Task</h2>

        <select id="traineeSelect">
            <option value="">Select Trainee</option>
        </select>

        <input
        type="text"
        id="taskTitle"
        placeholder="Task Title">

        <textarea
        id="taskDescription"
        placeholder="Task Description"></textarea>

        <input
        type="date"
        id="dueDate">

        <button onclick="assignTask()">
            Assign Task
        </button>

    </div>

    <div class="card">

        <h2>Assigned Tasks</h2>

        <div id="taskList"></div>

    </div>

    <button class="logout" onclick="logout()">
        Logout
    </button>

</div>

<script type="module" src="trainer.js"></script>

</body>
</html> trainer html and<!DOCTYPE html>
<html>
<head>
<title>Trainee Dashboard</title>

<style>
body{
  font-family:Arial,sans-serif;
  background:#f4f6f9;
  margin:0;
}

header{
  background:#00539f;
  color:white;
  padding:18px;
  text-align:center;
}

.stats{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:15px;
  padding:20px;
}

.card{
  background:white;
  padding:20px;
  border-radius:10px;
  text-align:center;
  box-shadow:0 2px 8px rgba(0,0,0,.1);
}

.card h2{
  margin:0;
  color:#00539f;
}

table{
  width:95%;
  margin:20px auto;
  border-collapse:collapse;
  background:white;
  border-radius:10px;
  overflow:hidden;
}

th,td{
  padding:12px;
  border-bottom:1px solid #ddd;
}

th{
  background:#eaf2ff;
}

.status{
  padding:5px 10px;
  border-radius:20px;
  color:white;
}

.pending{background:#ff9800;}
.submitted{background:#2196f3;}
.completed{background:#28a745;}
</style>
</head>

<body>

<header>
🎓 Trainee Dashboard
</header>

<div class="stats">

  <div class="card">
    <h2 id="totalTrainees">0</h2>
    <p>Total Trainees</p>
  </div>

  <div class="card">
    <h2 id="totalTasks">0</h2>
    <p>Total Tasks</p>
  </div>

  <div class="card">
    <h2 id="completedTasks">0</h2>
    <p>Completed</p>
  </div>

</div>

<table>
<thead>
<tr>
<th>Trainee</th>
<th>Task</th>
<th>Status</th>
<th>Progress</th>
<th>Assigned By</th>
</tr>
</thead>

<tbody id="taskTable">
</tbody>

</table>

<script type="module" src="trainee.js"></script>

</body>
</html>
