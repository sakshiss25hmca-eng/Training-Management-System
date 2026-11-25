import { db } from "../firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Load Trainers in Dropdown
async function loadTrainers() {

  const trainerEmail =
document.getElementById("trainerSelect").value;
  const snapshot =
    await getDocs(collection(db, "users"));

  trainerSelect.innerHTML =
    '<option value="">Select Trainer</option>';

  snapshot.forEach((docSnap) => {

    const user = docSnap.data();

    if (user.role === "trainer") {

      trainerSelect.innerHTML += `
        <option value="${user.email}">
          ${user.name} (${user.email})
        </option>
      `;
    }

  });

}
// Load Trainees in Dropdown
async function loadTrainees() {

    const traineeSelect = document.getElementById("traineeSelect");

    const snapshot = await getDocs(collection(db, "users"));

    traineeSelect.innerHTML =
        '<option value="">Select Trainee</option>';

    snapshot.forEach((docSnap) => {

        const user = docSnap.data();

        if (user.role === "trainee") {

            traineeSelect.innerHTML += `
                <option value="${user.email}">
                    ${user.name} (${user.email})
                </option>
            `;
        }

    });

}
// Assign Task
async function assignTask() {

    const trainerSelect = document.getElementById("trainerSelect");
    const trainerEmail = trainerSelect.value;
    const trainerName =
    trainerSelect.options[trainerSelect.selectedIndex].text;

    const traineeSelect = document.getElementById("traineeSelect");
    const traineeEmail = traineeSelect.value;
    const traineeName =
    traineeSelect.options[traineeSelect.selectedIndex].text;

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("dueDate").value;

    if (
        !trainerEmail ||
        !traineeEmail ||
        !title ||
        !description ||
        !dueDate
    ) {
        alert("Please fill all fields");
        return;
    }

    await addDoc(collection(db, "tasks"), {

        trainerName: trainerName,
        trainerEmail: trainerEmail,
        assignedby: trainerEmail,

        traineeName: traineeName,
        traineeEmail: traineeEmail,

        title: title,
        description: description,
        dueDate: dueDate,

        status: "Pending",
        progress: 0

    });

    alert("Task Assigned Successfully!");

    document.getElementById("trainerSelect").selectedIndex = 0;
    document.getElementById("traineeSelect").selectedIndex = 0;
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("dueDate").value = "";
}

// Update Progress
async function updateProgress(taskId, progress) {

  let status = "In Progress";

  if (Number(progress) === 100) {
    status = "Completed";
  }

  if (Number(progress) === 0) {
    status = "Pending";
  }

  await updateDoc(
    doc(db, "tasks", taskId),
    {
      progress: Number(progress),
      status: status
    }
  );
}

// Load Tasks
function loadTasks() {

    onSnapshot(collection(db, "tasks"), (snapshot) => {

       let html = "";
let pending = 0;
let completed = 0;
let traineeSet = new Set();
        snapshot.forEach((docSnap) => {

            const task = docSnap.data();
    traineeSet.add(task.traineeEmail);

    if (task.status === "Pending") {
        pending++;
    }

    if (task.status === "Completed") {
        completed++;
    }

            html += `
            <div class="task-item">

                <h3>${task.title}</h3>

                <p><b>Trainee:</b> ${task.traineeName}</p>
                <p><b>Description:</b> ${task.description}</p>

                <p><b>Due Date:</b> ${task.dueDate}</p>

                <p><b>Status:</b> ${task.status}</p>

                <p><b>Progress:</b> ${task.progress || 0}%</p>
${task.status === "Completed" ? `
<button
style="background:#28a745;margin-top:10px;"
onclick="generateCertificate('${docSnap.id}')">
🎓 Generate Certificate
</button>
` : ""}
${task.status === "Submitted" ? `
${task.feedback ? `
<p style="color:red;">
<b>Trainer Feedback:</b>
${task.feedback}
</p>
` : ""}
${task.status === "Completed" ? `
<hr>

<button
style="background:#28a745;margin-top:10px;"
onclick="generateCertificate('${docSnap.id}')">
🎓 Generate Certificate
</button>

` : ""}

<hr>

<p><b>Submission:</b></p>

<p>${task.submission || "No description"}</p>

${task.fileURL ? `
<p>
<a href="${task.fileURL}" target="_blank">
📄 View Uploaded File
</a>
</p>
` : ""}

<button
onclick="approveTask('${docSnap.id}')">
✅ Approve
</button>

<button
style="background:red;"
onclick="rejectTask('${docSnap.id}')">
❌ Reject
</button>

` : ""}

                <progress
                    value="${task.progress || 0}"
                    max="100"
                    style="width:100%;height:18px;">
                </progress>

            </div>
            `;
        });

        document.getElementById("taskList").innerHTML = html;
totalTrainees.textContent = traineeSet.size;
totalTasks.textContent = snapshot.size;
pendingTasks.textContent = pending;
completedTasks.textContent = completed;
    });

}
// Logout
function logout() {

  window.location.href =
    "../index.html";
}

// Page Load
window.onload = () => {

  loadTrainers();
  loadTrainees();

};
async function approveTask(taskId){

await updateDoc(doc(db,"tasks",taskId),{

status:"Completed",

approved:true,

approvedAt:new Date().toLocaleString()

});

alert("Task Approved");

}

async function rejectTask(taskId){

const reason=prompt("Reason for rejection:");

if(reason==null) return;

await updateDoc(doc(db,"tasks",taskId),{

status:"Pending",

progress:0,

feedback:reason,

approved:false

});

alert("Task Rejected");

}
async function generateCertificate(taskId){

    await updateDoc(
        doc(db,"tasks",taskId),
        {
            certificateIssued:true,
            certificateDate:new Date().toLocaleDateString()
        }
    );

    alert("🎓 Certificate Generated Successfully!");

}

window.generateCertificate = generateCertificate;
async function trainerLogin(){

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const q = query(
        collection(db,"users"),
        where("email","==",email),
        where("role","==","trainer")
    );

    const snapshot = await getDocs(q);

    if(snapshot.empty){
        alert("Trainer not found");
        return;
    }

    const trainer = snapshot.docs[0].data();

    if(trainer.password !== password){
        alert("Wrong Password");
        return;
    }

    alert("Login Successful");

    localStorage.setItem("trainerEmail", trainer.email);
    localStorage.setItem("trainerName", trainer.name);
document.getElementById("loginStatus").innerHTML =
"Logged in as " + trainer.name + " ✅";
}

window.trainerLogin = trainerLogin;
function openWorkspace() {
    window.location.href = "trainer-workspace.html";
}

window.openWorkspace = openWorkspace;
// Global Functions
window.assignTask = assignTask;
window.updateProgress = updateProgress;
window.approveTask = approveTask;

window.rejectTask = rejectTask;
window.logout = logout;
