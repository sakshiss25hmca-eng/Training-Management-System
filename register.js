import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.register = async function () {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if(name==="" || email==="" || password==="" || role===""){
        alert("Please fill all fields");
        return;
    }

    // Show Loader
    document.getElementById("loader").style.display="flex";

    // Wait for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    try{

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await setDoc(doc(db,"users",userCredential.user.uid),{

            name:name,
            email:email,
            role:role

        });

        alert("Registration Successful");

        window.location.href="login.html";

    }catch(error){

        document.getElementById("loader").style.display="none";

        alert(error.message);

    }

}