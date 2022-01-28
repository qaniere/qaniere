const CANVAS = document.getElementById("canvas");
const CTX = canvas.getContext("2d");  

const RADIUS_DISPLAY = document.getElementById("radius-display");
const CLEAR_BUTTON = document.getElementById("clear-button");
const DOWNLOAD_BUTTON = document.getElementById("download-button");
const DOWNLOAD_LINK = document.getElementById("download-link");
const PLUS_BUTTON = document.getElementById("plus-button");
const MINUS_BUTTON = document.getElementById("minus-button");

let radius = 50;
let canvasData = null;

let heightAfterStyle = + getComputedStyle(CANVAS).getPropertyValue("height").slice(0, -2); 
let widthAfterStyle = + getComputedStyle(CANVAS).getPropertyValue("width").slice(0, -2);
//These lines fetch the size of the canvas after css transformations

CANVAS.setAttribute("height", heightAfterStyle);
CANVAS.setAttribute("width", widthAfterStyle);
//The real height and width of the canvas are multiplied by the resolution of the screen
//in order to prevent blurry draws.


/**
 * This function draw a circle in the canvas 
 *  
 * @param {int} x The x coordinate of the circle - Must be positive
 * @param {int} y The y coordinate of the circle - Must be positive
 * @param {int} radius The radius of the circle - Must be positive
 * @param {string} color The color of the cirle - Must be a valid css value
 */
function drawCircle(x, y, radius, color) {

    CTX.beginPath();
    CTX.arc(x, y, radius, 0, 2 * Math.PI, false);

    CTX.fillStyle = color;
    CTX.fill();
    
    CTX.closePath();

    canvasData = canvas.toDataURL();
    DOWNLOAD_LINK.href = canvasData;
}

/**
 * This function returns a random hex CSS color
 */
function getRandomHexColor() {
    let randomInt = Math.floor(Math.random() * (9999999 - 0 + 1) + 0);
    //This calculation return's a random int of nine digits

    let hexString = "#" + randomInt.toString(16);
    //Convert the int to the hex format for CSS

    return hexString;
}

//This callback is executed when the canvas is clicked
CANVAS.addEventListener("mousedown", (event) => {

    let realCanvas = CANVAS.getBoundingClientRect(); //This method return the real height and width of the canvas
    let x = event.offsetX * CANVAS.width / realCanvas.width; 
    let y = event.offsetY * CANVAS.height / realCanvas.height;
    //This calcul take the x coordinates on the whole page, times the size of the canvas 
    //and divided by the real size of the canvas to get the accurate coordinates of the click.

    drawCircle(x, y, radius, getRandomHexColor());
});
 
//This callback is executed when the the mouse whell is spinning
document.addEventListener("wheel", (event) => {

    if(event.deltaY < 0) {
        radius = radius + 10;
        

    } else {
        if(radius != 0) {
            radius = radius - 10;
        }
    }

    RADIUS_DISPLAY.innerText = "Taille du cercle : " + radius + "px";
});

//This callback is executed when the clear button is clicked
CLEAR_BUTTON.addEventListener("click", (event) => {

    let userConfirmation = confirm("Voulez-vous vraiment effacer la toile ?");

    if(userConfirmation) {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    }    
});

//This callback is executed when the download button is clicked
DOWNLOAD_BUTTON.addEventListener("click", (event) => {
    DOWNLOAD_LINK.click();
    //To download the canvas content, we need the href and the download attributes
    //Since they can't apply to a button and wrap the button arround a <a> is a
    //bad practice,  a <a> element with the href and download attributes is hided
    //on the page and triggered when the button is clicked.
});

//This callback is executed when the plus button is clicked (Mobile devices only)
PLUS_BUTTON.addEventListener("click", () => {
    radius = radius + 10;
    RADIUS_DISPLAY.innerText = "Taille du cercle : " + radius + "px";
});

//This callback is executed when the minus button is clicked (Mobile devices only)
MINUS_BUTTON.addEventListener("click", () => {
    if(radius != 0) {
        radius = radius - 10;
        RADIUS_DISPLAY.innerText = "Taille du cercle : " + radius + "px";
    }
});

//This callback is executed when the document is double clicked
document.addEventListener("dblclick", (event) => {
    event.preventDefault();
    //On computer devices, this does nothing but on mobile devices
    //it prevent automatic zoom that can't be really anoying for
    //user
});
