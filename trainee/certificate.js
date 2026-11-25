import { db } from "../firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const taskId = localStorage.getItem("certificateTaskId");

async function loadCertificate(){

    if(!taskId){
        alert("Certificate not found");
        return;
    }

    const taskRef = doc(db,"tasks",taskId);

    const taskSnap = await getDoc(taskRef);

    if(!taskSnap.exists()){
        alert("Task not found");
        return;
    }

    const task = taskSnap.data();

    document.getElementById("traineeName").innerHTML =
        task.traineeEmail || "-";

    document.getElementById("taskTitle").innerHTML =
        task.title || "-";

    document.getElementById("trainerName").innerHTML =
        task.assignedby || "-";

    document.getElementById("date").innerHTML =
        task.certificateDate || task.submittedAt || "-";

}

loadCertificate(); 
