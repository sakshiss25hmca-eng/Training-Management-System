import { db } from "../firebase-config.js";

import {

collection,

onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const email = localStorage.getItem("selectedTrainee");

const table = document.getElementById("detailsTable");

document.getElementById("title").innerHTML =
"Trainee : " + email;

onSnapshot(collection(db,"tasks"),snapshot=>{

let html="";

snapshot.forEach(doc=>{

const task=doc.data();

if(task.traineeEmail===email){

let badge="pending";

if(task.status==="Submitted")
badge="submitted";

if(task.status==="Completed")
badge="completed";

html+=`

<tr>

<td>${task.title||"-"}</td>

<td>

<span class="status ${badge}">

${task.status||"Pending"}

</span>

</td>

<td>${task.progress||0}%</td>

<td>${task.assignedby||"-"}</td>

<td>

${
task.certificateIssued

?

`<button onclick="window.open('certificate.html','_blank')">

View

</button>`

:

"Not Available"

}

</td>

<td>

${task.submission||"-"}

</td>

<td>

${

task.fileURL

?

`<a href="${task.fileURL}" target="_blank">

View File

</a>`

:

"No File"

}

</td>

<td>

${task.submittedAt||"-"}

</td>

</tr>

`;

}

});

table.innerHTML=html;

});