import { db } from "../firebase-config.js";
import { supabase } from "../supabase-config.js";

import {
    collection,
    onSnapshot,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ==========================
// Dashboard Elements
// ==========================

const taskTable = document.getElementById("taskTable");

const totalTrainees = document.getElementById("totalTrainees");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingTasks =
document.getElementById("pendingTasks");

const submittedTasks =
document.getElementById("submittedTasks");

const averageProgress =
document.getElementById("averageProgress");

const traineeName =
document.getElementById("traineeName");

const clock =
document.getElementById("clock");

const searchTask =
document.getElementById("searchTask");

// ==========================
// Welcome
// ==========================

traineeName.textContent =
localStorage.getItem("traineeName") || "Trainee";

// ==========================
// Live Clock
// ==========================

function updateClock(){

    if(clock){

        clock.innerHTML =
        new Date().toLocaleString();

    }

}

updateClock();

setInterval(updateClock,1000);

// ==========================
// Search
// ==========================

if(searchTask){

searchTask.addEventListener("keyup",()=>{

const value =
searchTask.value.toLowerCase();

const rows =
document.querySelectorAll("#taskTable tr");

rows.forEach(row=>{

row.style.display =
row.innerText.toLowerCase()
.includes(value)
?
""
:
"none";

});

});

}

// ==========================
// Task List
// ==========================

let allTasks = [];

onSnapshot(collection(db,"tasks"),(snapshot)=>{

let html="";

let traineeSet = new Set();

let completed=0;

let pending=0;

let submitted=0;

let totalProgress=0;

allTasks=[];

snapshot.forEach((taskDoc)=>{

const task=taskDoc.data();

allTasks.push({

id:taskDoc.id,

...task

});

traineeSet.add(task.traineeEmail);

totalProgress += Number(task.progress||0);

if(task.status==="Completed")
completed++;

if(task.status==="Pending")
pending++;

if(task.status==="Submitted")
submitted++;

let badge="pending";

if(task.status==="Submitted")
badge="submitted";

if(task.status==="Completed")
badge="completed";

let dueBadge="";

if(task.dueDate){

const today=new Date();

const due=new Date(task.dueDate);

if(due<today && task.status!=="Completed"){

dueBadge=
"<br><span style='color:red;font-weight:bold;'>🔥 Overdue</span>";

}

}

html += `
<tr>

<td>${task.title || "-"}</td>

<td>
<span class="status ${badge}">
${task.status || "Pending"}
</span>
</td>

<td>${task.progress || 0}%</td>

<td>${task.assignedby || "-"}</td>

<td>
${
task.certificateIssued
?
`<button onclick="downloadCertificate('${taskDoc.id}')">
🎓 View Certificate
</button>`
:
`Not Available`
}
</td>

<td>
<textarea
id="sub_${taskDoc.id}"
rows="3"
placeholder="Describe your work"></textarea>
</td>

<td>
<input
type="file"
id="file_${taskDoc.id}">
</td>

<td>
<button onclick="submitTask('${taskDoc.id}')">
Submit
</button>
</td>

</tr>
`;
});

taskTable.innerHTML = html;

totalTrainees.textContent = traineeSet.size;
totalTasks.textContent = snapshot.size;
completedTasks.textContent = completed;

// Show certificate button only if trainer has generated it
let canDownload = false;

snapshot.forEach((taskDoc) => {

    const task = taskDoc.data();

    if (task.certificateIssued === true) {
        canDownload = true;
    }

});

document.getElementById("certificateBtn").style.display =
    canDownload ? "inline-block" : "none";
if(pendingTasks)
pendingTasks.textContent=pending;

if(submittedTasks)
submittedTasks.textContent=submitted;

if(averageProgress){

averageProgress.textContent=

snapshot.size

?

Math.round(totalProgress/snapshot.size)+"%"

:

"0%";

}

});
// ==========================
// Show All Trainees
// ==========================

window.showTrainees = function () {

    let unique = {};

    allTasks.forEach(task => {
        if (!unique[task.traineeEmail]) {
            unique[task.traineeEmail] = {
                name: task.traineeName || "Trainee",
                email: task.traineeEmail
            };
        }
    });

    let html = `
    <html>
    <head>
    <title>Total Trainees</title>

    <style>

    body{
        font-family:Arial;
        padding:20px;
        background:#f4f6f9;
    }

    table{
        width:100%;
        border-collapse:collapse;
        background:white;
    }

    th{
        background:#00539f;
        color:white;
        padding:12px;
    }

    td{
        padding:10px;
        border:1px solid #ddd;
        text-align:center;
    }

    button{
        background:#00539f;
        color:white;
        border:none;
        padding:8px 15px;
        cursor:pointer;
        border-radius:5px;
    }

    </style>

    </head>

    <body>

    <h2>Total Trainees</h2>

    <table>

    <tr>

    <th>Name</th>

    <th>Email</th>

    <th>Action</th>

    </tr>
    `;

    Object.values(unique).forEach(t=>{

        html += `

        <tr>

        <td>${t.name}</td>

        <td>${t.email}</td>

        <td>

        <button onclick="viewTrainee('${t.email}')">

        View

        </button>

        </td>

        </tr>

        `;

    });

    html += `

    </table>

<script>

function viewTrainee(email){

localStorage.setItem("selectedTrainee",email);

window.open("traineeDetails.html","_blank");

}
</script>

</body>

</html>
`;

    const w = window.open("", "_blank");

    w.document.write(html);

}
// ==========================
// Show All Tasks
// ==========================

window.showTasks = function () {

    let html = "<h2>📋 All Tasks</h2>";

    allTasks.forEach(task => {

        html += `
        <div style="padding:10px;">
            <b>${task.title}</b><br>
            Status : ${task.status}<br>
            Progress : ${task.progress || 0}%<br>
            Assigned By : ${task.assignedby}<br>
            Due Date : ${task.dueDate || "-"}
        </div>
        <hr>
        `;

    });

    const w = window.open("", "_blank");
    w.document.write(html);

};
// ==========================
// Show Completed
// ==========================

window.showCompleted = function () {

    let html = "<h2>✅ Completed Tasks</h2>";

    allTasks.forEach(task => {

        if(task.status==="Completed"){

            html += `
                <div style="padding:10px;">
                    <b>${task.title}</b><br>
                    ${task.traineeEmail}
                </div>
                <hr>
            `;

        }

    });

    const w = window.open("", "_blank");
    w.document.write(html);

};

// ==========================
// Submit Task
// ==========================

window.submitTask = async function(taskId){

try{

const work=document
.getElementById(`sub_${taskId}`)
.value
.trim();

const fileInput=
document.getElementById(`file_${taskId}`);

const file=fileInput.files[0];

if(work==="" && !file){

alert("Please enter work or upload file.");

return;

}

let fileURL="";
let fileName="";

if(file){

const filePath=
`${taskId}/${Date.now()}_${file.name}`;

const {error}=await supabase.storage

.from("submissions")

.upload(filePath,file);

if(error){

alert(error.message);

return;

}

const {data:publicData}=

supabase.storage

.from("submissions")

.getPublicUrl(filePath);

fileURL=publicData.publicUrl;

fileName=file.name;

}

await updateDoc(

doc(db,"tasks",taskId),

{

submission:work,

fileURL:fileURL,

fileName:fileName,

status:"Submitted",

progress:100,

submittedAt:new Date().toLocaleString()

}

);

alert("✅ Task Submitted Successfully");

document.getElementById(`sub_${taskId}`).value="";

document.getElementById(`file_${taskId}`).value="";

}

catch(error){

console.error(error);

alert(error.message);

}

};

// ==========================
// Popup
// ==========================

window.closePopup=function(){

document.getElementById("popup").style.display="none";

};

// ==========================
// Quote Rotator
// ==========================

const quotes=[

"💡 Success is the sum of small efforts repeated daily.",

"🚀 Learn something new every day.",

"🏆 Great things never come from comfort zones.",

"📚 Knowledge grows when shared.",

"⭐ Stay focused and keep improving."

];

const quote=document.querySelector(".quote");

if(quote){

let i=0;

setInterval(()=>{

i++;

if(i>=quotes.length) i=0;

quote.innerHTML=quotes[i];

},5000);

}
window.downloadCertificate = function(taskId){

    localStorage.setItem("certificateTaskId", taskId);

    window.open("certificate.html","_blank");

} 