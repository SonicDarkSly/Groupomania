export function checksignup() {
    // check regex
  
    let regexNumber = /[0-9]/;
    let regexEmail = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let regexSymbols = /[§!@#$%^&*().?":{}|<>]/;
    let regexBlank = /^[\s]/;

    let inputLastName = document.getElementById("lastname");
    let inputFirstName = document.getElementById("firstname");
    let inputEmail = document.getElementById("email");
    let inputPassword = document.getElementById("password");
    let inputPasswordMatch = document.getElementById("password").value;

    let suiviCheckForm = "";

    // Test du nom
    if (
        regexNumber.test(inputLastName.value) === true ||
        regexSymbols.test(inputLastName.value) === true ||
        regexBlank.test(inputLastName.value) === true ||
        inputLastName.value === ""
        ) {
          inputLastName.style.backgroundColor = "#FF7878";
          suiviCheckForm = "error";
      } else {
          inputLastName.style.backgroundColor = "#8CFF87";
      }

    // Test du prénom
    if (
        regexNumber.test(inputFirstName.value) === true ||
        regexSymbols.test(inputFirstName.value) === true ||
        regexBlank.test(inputFirstName.value) === true ||
        inputFirstName.value === ""
        ) {
            inputFirstName.style.backgroundColor = "#FF7878";
            suiviCheckForm = "error";
      } else {
        inputFirstName.style.backgroundColor = "#8CFF87";
      }

    // Test de l'email
    if (
        regexEmail.test(inputEmail.value) === false ||
        regexBlank.test(inputEmail.value) === true ||
        inputEmail.value === ""  
        ) {
          inputEmail.style.backgroundColor = "#FF7878";
          suiviCheckForm = "error";
      } else {
        inputEmail.style.backgroundColor = "#8CFF87";
      }

    // Test du mot de passe

    if (inputPassword.value === "" ) {
        inputPassword.style.backgroundColor = "#FF7878";
        suiviCheckForm = "error";
    } else {
        if (inputPasswordMatch.match( /[0-9]/g) && 
        inputPasswordMatch.match( /[A-Z]/g) && 
        inputPasswordMatch.match(/[a-z]/g) && 
        inputPasswordMatch.match( /[^a-zA-Z\d]/g)) {
            inputPassword.style.backgroundColor = "#8CFF87";
            document.getElementById("msg_mdp_signup").innerHTML= " : Mot de passe fort"; 
        } else {
            inputPassword.style.backgroundColor = "#FF7878";
            document.getElementById("msg_mdp_signup").innerHTML= " : Mot de passe faible"; 
            suiviCheckForm = "error";
        }
        
    }

    if (suiviCheckForm === "error") {
        alert("Attention certaines données ne peuvent être validées, vérifier le format");
        return false;
    }
    // Si le formulaire est validé
    else {
        return true;
    }
}


export function checkChangePassword() {
    let inputPassword = document.getElementById("newPassword");
    let inputPasswordMatch = document.getElementById("newPassword").value;

    if (inputPassword.value === "" ) {
        inputPassword.style.backgroundColor = "#FF7878";
    } else {
        if (inputPasswordMatch.match( /[0-9]/g) && 
        inputPasswordMatch.match( /[A-Z]/g) && 
        inputPasswordMatch.match(/[a-z]/g) && 
        inputPasswordMatch.match( /[^a-zA-Z\d]/g)) {
            inputPassword.style.backgroundColor = "#8CFF87";
            return true;
        } else {
            alert("Veuillez respecter les conditions d'éligibilité du mot de passe");
            return false;
        }
        
    }
}

export function checkChangeEmail() {

    let regexEmail = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let regexBlank = /^[\s]/;

    let inputEmail = document.getElementById("newEmail");

    if (
        regexEmail.test(inputEmail.value) === false ||
        regexBlank.test(inputEmail.value) === true ||
        inputEmail.value === ""  
        ) {
          inputEmail.style.backgroundColor = "#FF7878";
          alert("Controlez le format de l'adresse mail");
          return false
      } else {
        inputEmail.style.backgroundColor = "#8CFF87";
        return true
      }
}

export function checkChangePasswordAdmin() {
    let inputPassword = document.getElementById("updatePassword");
    let inputPasswordMatch = document.getElementById("updatePassword").value;

    if (inputPasswordMatch.match( /[0-9]/g) && 
        inputPasswordMatch.match( /[A-Z]/g) && 
        inputPasswordMatch.match(/[a-z]/g) && 
        inputPasswordMatch.match( /[^a-zA-Z\d]/g) &&
        inputPassword.value !== "") {
            return true;
    } else {
            alert("Veuillez respecter les conditions d'éligibilité du mot de passe");
            return false;
    }
}
