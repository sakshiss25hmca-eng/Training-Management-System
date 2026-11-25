import { db, auth } from "../firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Live Date & Time
function updateTime() {
    const now = new Date();

    document.getElementById("dateTime").innerHTML =
        now.toLocaleDateString() + " | " +
        now.toLocaleTimeString();
}

setInterval(updateTime,1000);
updateTime();

async function loadDashboard(){

    // Collections
    const usersSnap = await getDocs(collection(db,"users"));
    const taskSnap = await getDocs(collection(db,"tasks"));
    const notifySnap = await getDocs(collection(db,"notifications"));

    let trainees = 0;
    let trainers = 0;

    const table = document.getElementById("traineeTable");

    table.innerHTML = "";

    usersSnap.forEach((doc)=>{

        const user = doc.data();

        if(user.role==="trainee")
            trainees++;

        if(user.role==="trainer")
            trainers++;

        table.innerHTML += `

        <tr>

        <td>${user.name || "-"}</td>

        <td>${user.email || "-"}</td>

        <td>${user.department || "-"}</td>

        <td><span class="status active">Active</span></td>

        </tr>

        `;

    });

    document.getElementById("traineeCount").innerHTML = trainees;

    document.getElementById("trainerCount").innerHTML = trainers;

    document.getElementById("programCount").innerHTML = taskSnap.size;

    document.getElementById("certificateCount").innerHTML = notifySnap.size;

    loadCharts(trainees,trainers);

}

function loadCharts(trainees,trainers){

new Chart(document.getElementById("registrationChart"),{

type:"bar",

data:{

labels:["Jan","Feb","Mar","Apr","May","Jun"],

datasets:[{

label:"Registrations",

data:[5,8,10,15,12,20]

}]

}

});

new Chart(document.getElementById("attendanceChart"),{

type:"doughnut",

data:{

labels:["Trainees","Trainers"],

datasets:[{

data:[trainees,trainers]

}]

}

});

}

document.getElementById("logoutBtn").onclick=()=>{

signOut(auth).then(()=>{

window.location="../login.html";

});

};

loadDashboard();