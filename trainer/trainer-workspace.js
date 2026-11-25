import { db } from "../firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ----------------------
// Trainer Login
// ----------------------
async function loginTrainer() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Enter Email and Password");
        return;
    }

    const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("role", "==", "trainer")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        alert("Trainer not found");
        return;
    }

    const trainer = snapshot.docs[0].data();

    if (trainer.password !== password) {
        alert("Wrong Password");
        return;
    }

    localStorage.setItem("trainerEmail", trainer.email);
    localStorage.setItem("trainerName", trainer.name);

    document.getElementById("trainerName").innerHTML =
        "Welcome, " + trainer.name + " 👋";

    loadSubmissions();
}

window.loginTrainer = loginTrainer;


// ----------------------
// Load Trainer Submissions
// ----------------------
function loadSubmissions() {

    const trainerEmail = localStorage.getItem("trainerEmail");

    const q = query(
        collection(db, "tasks"),
        where("assignedby", "==", trainerEmail)
    );

    onSnapshot(q, (snapshot) => {

        let html = "";

        snapshot.forEach((docSnap) => {

            const task = docSnap.data();

            html += `
            <div class="task">

                <h3>${task.title}</h3>

                <p><b>Trainee:</b> ${task.traineeName}</p>

                <p><b>Status:</b> ${task.status}</p>

                <p><b>Submission:</b></p>

                <p>${task.submission || "No submission yet"}</p>

                ${task.fileURL ? `
                <p>
                    <b>Uploaded File:</b><br>

                    <a href="${task.fileURL}" target="_blank">
                        📄 View Uploaded File
                    </a>

                </p>
                `
                :
                `
                <p style="color:red;">
                    No file uploaded
                </p>
                `}

                <hr>

                <button onclick="approveTask('${docSnap.id}')">
                    ✅ Approve
                </button>

                <button
                style="background:red;"
                onclick="rejectTask('${docSnap.id}')">
                    ❌ Reject
                </button>

                ${task.status === "Completed" ? `
                <button
                style="background:green;"
                onclick="generateCertificate('${docSnap.id}')">
                    🎓 Generate Certificate
                </button>
                ` : ""}

            </div>
            `;

        });

        document.getElementById("submissionList").innerHTML = html;

    });

}
// ----------------------
// Approve Task
// ----------------------
async function approveTask(taskId){

    await updateDoc(doc(db,"tasks",taskId),{

        status:"Completed",
        approved:true,
        approvedAt:new Date().toLocaleString()

    });

    alert("✅ Done! Task Approved Successfully.");

}

window.approveTask = approveTask;


// ----------------------
// Reject Task
// ----------------------
async function rejectTask(taskId){

    const reason = prompt("Reason for rejection:");

    if(reason == null) return;

    await updateDoc(doc(db,"tasks",taskId),{

        status:"Pending",
        approved:false,
        progress:0,
        feedback:reason

    });

    alert("❌ Try Again!");

}

window.rejectTask = rejectTask;


// ----------------------
// Generate Certificate
// ----------------------
async function generateCertificate(taskId){

    await updateDoc(doc(db,"tasks",taskId),{

        certificateIssued:true,
        certificateDate:new Date().toLocaleDateString()

    });

    alert("🎓 Certificate Generated Successfully!");

}

window.generateCertificate = generateCertificate;


// ----------------------
// Logout
// ----------------------
function logout(){

    localStorage.removeItem("trainerEmail");
    localStorage.removeItem("trainerName");

    window.location.href = "../index.html";

}

window.logout = logout;
