const FORM = document.getElementById("register-form");
const USERNAME_INPUT = document.getElementById("username");
const AGE_INPUT = document.getElementById("age");
const PASSWORD_INPUT = document.getElementById("password");
const PASSWORD_VERIFICATION_INPUT = document.getElementById("password-verification");
const REGISTER_TABLE = document.getElementById("register-table");
const DELETE_BUTTON = document.getElementById("delete-button");
//Retrieve all HTML nodes in constants

let id = 0;
let userDatabase = [];
//The default values of the localStorage variables
//The database is a list which contains JSON object. 
//Each objet represents a user (attributes : id, username, age, registerDate, hashedPassword)

if(localStorage.getItem("id") != null && localStorage.getItem("database") != null) {
//If the localStorage isn't empty

    id = parseInt(localStorage.getItem("id"));
    userDatabase = JSON.parse(localStorage.getItem("database"));
    //Replacing default values by retrieved one 

    for(i = 0; i < userDatabase.length; i++) {
        appendLine(REGISTER_TABLE, userDatabase[i]);
    }
}

/**
 * This function return true is the username given is
 * present in the database given.
 *  
 * @param {list} list The database. It must be a list which contains JSON objects with the attribute username
 * @param {string} username The username to be searched for.
 */
function is_username_taken(list, username) {

    for(i = 0; i < list.length; i++) {
        if(username == list[i].username) {
            return true;
        }
    }

    return false;
}

/**
 * This function return the position of the JSON object.
 * with contains the given id. "null" is returned if there.
 * is an error.
 * 
 * @param {list} list The database. It must be a list which contains JSON objects with the attribute id.
 * @param {number} id The id attributes of the JSON object to retrieve.
 */
function getIndexOfUser(list, id) {

    for(i = 0; i < list.length; i++) {
        if(id == parseInt(list[i].id)) {
            return i;
        }
    } 

    return null;
}


/**
 * This function return the current date and time.
 * Format : dd/mm/yyyy hh:mm:ss
 */
function getDateTime() {
    let today = new Date();

    let day = today.getDate() > 10 ? today.getDate() : "0" + today.getDate();
    let month = (today.getMonth() + 1) > 10 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1);
    let year = today.getFullYear() > 10 ? today.getFullYear() : "0" + today.getFullYear();

    let hours = today.getHours();
    let minutes = today.getMinutes() > 10 ? today.getMinutes() : "0" + today.getMinutes();
    let seconds = today.getSeconds() > 10 ? today.getSeconds() : "0" + today.getSeconds();
    

    let completeDate = day + "/" + month + "/" + year;
    let completeTime = hours + ":" + minutes + ":" + seconds;
    return completeDate + " " + completeTime;
}

/**
 * This function append a line in the HTML table given
 * in arguments.
 *  
 * @param {object} element The HTML table.
 * @param {object} infos A JSON object. It must have id, username, age, registerDate, hashedPassword attributes.
 */
function appendLine(element, infos) {

    let row = element.insertRow(); //Creation of a tr element 
    let cell1 = row.insertCell(0); //Creation of a td element
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    row.id = infos.id;
    cell1.innerText = infos.id; 
    cell2.innerText = infos.username; //Using innerText instead of innerHTML prevent XSS injection
    cell3.innerText = infos.age;
    cell4.innerText = infos.registerDate;
    cell5.innerHTML = "<div class='hash-div'>" + infos.hashedPassword + "</div>"; //We can use innerHTML here because data was treated after user input;
    cell6.innerHTML = "<button id='" + infos.id + "'>Supprimer</button>"; //Same here

    //This callback will be triggered when the button in the last cell is clicked
    cell6.children[0].addEventListener("click", () => {

        let confirmOperation = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
        //confirm return true if the user click yes and false otherwise

        if(confirmOperation) {
            let rowId = cell6.children[0].id; //The row id is stored in the button id;
            document.getElementById(rowId).remove();
            
            let indexToPop = getIndexOfUser(userDatabase, rowId);
            userDatabase.splice(indexToPop, 1); //Delete 1 element from the position "index_to_pop";
            localStorage.setItem("database", JSON.stringify(userDatabase));
        }   
    });
}

/**
 * This function hash a given message. This function is asynchronous
 * because calculate a hash can take several seconds on old devices.
 * 
 * This function return a promise and when the promise is complete it's
 * return a string. Exemple of calling :
 *    - hashSha512("password4545").then( (hashedPassword) => {
 *          console.log("The hased password is " + hashedPassword);
 * });
 *  
 * @param {string} element The message to hash.
 */

async function hashSha512(message) {

    const msgBuffer = new TextEncoder().encode(message);     
    const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));                
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
}

//This callback is executed when the form is submited (Enter key on last input or click on submit button)
FORM.addEventListener("submit", (event) => {

    event.preventDefault(); //Prevent the default behaviour of the form HTML element (use post or get)

    let username = USERNAME_INPUT.value;
    let age = AGE_INPUT.value; //Convert the string input into a int
    let password = PASSWORD_INPUT.value;
    let passwordVerification = PASSWORD_VERIFICATION_INPUT.value;


    if (username.length > 20) {
        alert("Le nom d'utilisateur est trop grand (20 caractères maximums)");

    } else if(is_username_taken(userDatabase, username)) {
        alert("Ce nom d'utilisateur est déjà utilisé.");

    } else if(age < 0 || age > 130) {
        alert("Votre age doit être compris entre 0 et 130ans.");

    } else if(password != passwordVerification) {
        alert("Le mot de passe et la confirmation ne sont pas identiques");

    } else {

        if(age == "") {
            age = "N/C";
        }

        id++;
        let registerDate = getDateTime();

        hashSha512(password).then( (hashedPassword) => {

            let newUser = {
                "id": id,
                "username": username,
                "age": age,
                "registerDate": registerDate,
                "hashedPassword": hashedPassword
            };

            userDatabase.push(newUser);
            localStorage.setItem("database", JSON.stringify(userDatabase)); 
            localStorage.setItem("id", id);

            appendLine(REGISTER_TABLE, newUser);

            alert("Inscription réussie !");
            FORM.reset();
            //Empty the form
        });
    }
});

//This callback is triggered when the delete button is clicked
 DELETE_BUTTON.addEventListener("click", () => {

    let userConfirmation = confirm("Voulez-vous vraiment effacer toutes les entrées ?");

    if(userConfirmation) {

        for(i = 0; i < userDatabase.length; i++) {
           let idToDelete = userDatabase[i].id;
           document.getElementById(idToDelete).remove();
        }

        userDatabase = [];
        localStorage.removeItem("database");
    }
});
