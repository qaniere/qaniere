const LOGIN_FORM = document.getElementById("login-form");
const USERNAME_INPUT = document.getElementById("username");
const PASSWORD_INPUT = document.getElementById("password");
const RESULT_SPAN = document.getElementById("connexion-result")

const LOYALTY_CONTAINER = document.getElementById("loyalty-container");
const USERNAME_SPAN = document.getElementById("username-placeholder");
const BALANCE_SPAN = document.getElementById("balance-placeholder");
const DATE_SPAN = document.getElementById("datetime-placeholder");

const REWARDS = document.querySelectorAll(".reward-container");

const DATABASE = {

    "Michel": {
        "hash": "1271dcd07b674d41aa7c4c292d699122e8519f586f5308bc486e0de2f5c9965cbb2b8051261f20dc3b65b7453576f16bdbf17150e54b4470d3dd819cdd329451",
        "balance": 50
    },

    "Fatma": {
        "hash": "38a46ac88d5d952dbb213d2bd18d8055dd2b647d95ed4dae82ff292841d1443db0604a642bd299e400d855d27898373bdc043da444c610b3b593149cefb879fe",
        "balance": 150
    },

    "Selma": {
        "hash": "80d31653389b68e67c980a8f99ea940e33840a57079176c737874872de54627c2b7ed32a68c8680c166b24833ddb723b854656530e05e2716f823623f586c19a",
        "balance": 20
        // SCR
    },

    "Patrick": {
        "hash": "f90ddd77e400dfe6a3fcf479b00b1ee29e7015c5bb8cd70f5f15b4886cc339275ff553fc8a053f8ddc7324f45168cffaf81f8c3ac93996f6536eef38e5e40768",
        "balance": 0
    }
}


function getDateAndTime() {
    var today = new Date();
    var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " "+ time;
}

async function hashSha512(message) {

    const msgBuffer = new TextEncoder().encode(message);     
    const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));                
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
}

async function login(username, password) {

    let passwordProvidedHashed = await hashSha512(password);
    if(DATABASE[username].hash == passwordProvidedHashed) {
        return true;
    }

    return false;
}


LOGIN_FORM.addEventListener("submit", (event) => {

    let username = USERNAME_INPUT.value;
    let password = PASSWORD_INPUT.value;

    event.preventDefault();
    login(username, password).then( (login_successful) => {

        if(login_successful) {
            LOGIN_FORM.style.animation = "2s disappearance";
            
            window.setTimeout(() => {
                LOGIN_FORM.style.display = "none";
                LOYALTY_CONTAINER.style.display = "block";
                LOYALTY_CONTAINER.classList.add("appearing");

            }, 500);

            USERNAME_SPAN.innerHTML = username;
            BALANCE_SPAN.innerHTML = DATABASE[username].balance;
            DATE_SPAN.innerHTML = getDateAndTime();

            REWARDS.forEach(element => {

                if(DATABASE[username].balance >= element.dataset.points) {
                    element.style.setProperty("--round_background-color", "#90EE90");
                }      
            });

        } else {
            RESULT_SPAN.innerHTML = "Identifiants incorrects.";
        }
    });
});
