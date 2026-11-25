import { db } from "../firebase-config.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const table=document.getElementById("certificateTable");

async function loadCertificates(){

const snap=await getDocs(collection(db,"users"));

table.innerHTML="";

snap.forEach(doc=>{

const user=doc.data();

if(user.role!="trainee") return;

table.innerHTML+=`

<tr>

<td>${user.name}</td>

<td>${user.email}</td>

<td>${user.trainingStatus}</td>

<td>${user.internshipStatus}</td>

<td>

${
user.trainingStatus=="Completed"

?

`<button class="training"
onclick="window.location='../certificates/trainingCertificate.html?id=${doc.id}'">
Training
</button>`

:

`<button class="not">Not Eligible</button>`

}

${
user.internshipStatus=="Completed"

?

`<button class="internship"
onclick="window.location='../certificates/internshipCertificate.html?id=${doc.id}'">
Internship
</button>`

:

``

}

</td>

</tr>

`;

});

}

loadCertificates();