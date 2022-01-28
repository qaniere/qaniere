const TABLE = document.getElementById("game");
const SCORE_DISPLAY = document.getElementById("score-display");
const SCORE_UP = document.getElementById("score-up-sound");
const GAME_OVER_SOUND = document.getElementById("game-over-sound");
const START_MENU = document.getElementById("start-menu");
const GAME_OVER_SCREEN = document.getElementById("game-over-screen");

const UP_ARROW = document.getElementById("up-arrow");
const LEFT_ARROW = document.getElementById("left-arrow");
const RIGHT_ARROW = document.getElementById("right-arrow");
const DOWN_ARROW = document.getElementById("down-arrow");

const COLUMS = 20; //Coordinates X
const LINES = 20; //Coordinates Y
const SPEED = 200; //The delay before game table actualisation

let loop;
let score = 0;
let gameCount = 0;
let gameStarted = false; 

let direction = "n"; //Possible values = "n" = North / up, "s" = South / down, etc...
let snakeLenght = 0;
let snakePosition = [];
let previousPosition = [];

let isFruitPresent = false;
let fruitPosition = [[-1, -1]];

//Drawing the game table
for(i = 0; i < LINES; i++) {

    let row =  TABLE.insertRow(); //Creation of a tr element 
    row.id = i;

    for(j = 0; j < COLUMS; j++) {
        let cell = row.insertCell(j); //Creation of a td element
        cell.id = i + "-" + j;
    }
}

/**
 * This function return between min (included) and max (excluded) values
 * The function is taken from the Mozilla Web Documentation
 *  
 * @param {int} min The min value that can be returned - Must be positive.
 * @param {int} max The max value that can't be returned  - Must be positive
 */
function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * This function fill a case of the game table with the color
 * requested.
 *  
 * @param {int} x The x coordinate of the case - Must be positive and less than "COLUMS".
 * @param {int} y The y coordinate of the case   - Must be positive  and less than "LINES".
 * @param {string} content The color or the image that will be filling the case - Must be a valid css color if is a color.
 * @param {boolean} isImage True if the content is a image.
 */
function fillCase(x, y, content, isImage) {

    if(isImage) {
        document.getElementById(x + "-" + y).style.backgroundImage = "url(" + content + ")";
    } else {
        document.getElementById(x + "-" + y).style.backgroundColor = content;
    }
}

/**
 * This function fill clear the image of the given case
 *  
 * @param {int} x The x coordinate of the case - Must be positive and less than "COLUMS".
 * @param {int} y The y coordinate of the case   - Must be positive  and less than "LINES".
 */
function clearCaseImage(x, y) {
    document.getElementById(x + "-" + y).style.backgroundImage = "none";
}

/**
 * This function update the score and the span which display it
 *  
 * @param {boolean} adding Wheter the value is added to score or not. If false, the value will be substracted
 * @param {int} value The value to be added or substracted. Can be zero for forcing the span to refresh.
 */
function updateScore(adding, value){

    if(adding) {
        SCORE_UP.play();
        score += value;

    } else {
        score -= value;
    }

    SCORE_DISPLAY.innerText = "Score : " + score;
}

/**
 * This function increase the snake lenght by one when called.
 */
function increaseSnake() {
    snakeLenght++;
    snakePosition[snakeLenght] = previousPosition[snakeLenght - 1]; //Getting the location of the tail of the snake
    fillCase(snakePosition[snakeLenght][0], snakePosition[snakeLenght][1], "white", false);
}

/**
 * This function return true if the element given enters in colision with the snake.
 * A padding can be provided, so the verification start from there. For exemple, a padding
 * of one does check collision with the head of the snake. 
 * 
 * The function returns true if a collision happen, false otherwise
 *  
 * @param {list} element A vector in the form of [x, y] (positives int in the range of the game table)
 * @param {int} padding The value to start the check with
 */
function checkCollision(element, padding) {

    for(i = 0 + padding; i < snakeLenght + 1; i++) {
        if(element[0] == snakePosition[i][0] && element[1] == snakePosition[i][1]) {
            return true;
        }
    }

    return false;
}

/**
 * This function clear the snake of the game table when called
 */
function clearSnake() {
    for(i = 0; i < snakeLenght + 1; i++) {
        fillCase(snakePosition[i][0], snakePosition[i][1], "transparent", false);
    } 
}

/**
 * This function is called by the setInterval once the game started every delay.
 * 
 * The function update the snake position, make fruits spawn, check for collisions, etc...
 * 
 * The interval ID of this function is stored in the loop variable.
 */
function updateTable() {

    let gameOver = false;
    clearSnake();

    previousPosition[0] = JSON.parse(JSON.stringify(snakePosition[0])); 
    let newHeadPosition = JSON.parse(JSON.stringify(snakePosition[0]));
    //Convert the list to string and then to list again is the most efficient way I found
    //to prevent annoyings memorys references. 
    //Otherwise, previousPosition values will change if snakePosition values was changed.
    
    if(direction === "n") {
    //If the snake going up (North)
        
        newHeadPosition[0] -= 1; //Moving the head upwards

        if(newHeadPosition[0] == -1 || checkCollision(newHeadPosition, 1)) {
        //If the head is out of the game table of if she is colliding with the snake body

            gameOver = true;
            
        } else {
            snakePosition[0][0] -= 1; //Applying the change for good
        }

    } else if(direction === "s") {
    //If the snake going down (South)

        newHeadPosition[0] += 1; //Moving the head downwards

        if(newHeadPosition[0] == LINES || checkCollision(newHeadPosition, 1)) {
        //If the head is out of the game table of if she is colliding with the snake body
        
            gameOver = true;

        } else {
            snakePosition[0][0] += 1; //Applying the change for good
            
        }
        
    } else if(direction === "w") {
    //If the snake going left (West)

        newHeadPosition[1] -= 1; //Moving the head to the left

        if(newHeadPosition[1] == -1 || checkCollision(newHeadPosition, 1)) {
        //If the head is out of the game table of if she is colliding with the snake body
            gameOver = true;

        } else {
            snakePosition[0][1] -= 1; //Applying the change for good
        }
        
    } else if(direction === "e") {
    //If the snake going right (East)

        newHeadPosition[1] += 1; //Moving the head to the left

        if(newHeadPosition[1] == COLUMS || checkCollision(newHeadPosition, 1)) {
        //If the head is out of the game table of if she is colliding with the snake body

            gameOver = true;

        } else {
            snakePosition[0][1] += 1; //Applying the change for good
        }
    } 

    if(!gameOver) {
    //If the player didn't loose the game

        fillCase(snakePosition[0][0], snakePosition[0][1], "white", false);
        //Drawing the head of the snake

        for(i = 1; i < snakeLenght + 1; i++) {
            previousPosition[i] = JSON.parse(JSON.stringify(snakePosition[i])); //Storing the current position 
            snakePosition[i] = JSON.parse(JSON.stringify(previousPosition[i - 1])); 
            //The tail of the snake will just take the previous place of the previous element
    
            fillCase(snakePosition[i][0], snakePosition[i][1], "white", false);
            //Drawing the snake part on the game table
        }
    
        if(!isFruitPresent) {
        //If no fruit is present on the gameTable

            fruitPosition[0][0] = randint(0, LINES);
            fruitPosition[0][1] = randint(0, COLUMS);
    
            while(checkCollision(fruitPosition[0], 0)) {
            //While fruit is spawning on the snake

                fruitPosition[0][0] = randint(0, LINES);
                fruitPosition[0][1] = randint(0, COLUMS);
            }
    
            isFruitPresent = true;
            fillCase(fruitPosition[0][0], fruitPosition[0][1], "'./sprites/apple.png'", true);
            

        } else if(fruitPosition[0][0] == snakePosition[0][0] && fruitPosition[0][1] == snakePosition[0][1]) {
        //If the snake eats the fruit

            updateScore(true, 1);
            increaseSnake();
            isFruitPresent = false;
            clearCaseImage(fruitPosition[0][0], fruitPosition[0][1]);
        }

    } else {
    //If the snake collided with the wall or itself

        GAME_OVER_SOUND.play();
        GAME_OVER_SCREEN.style.display = "block";
        gameStarted = false;
        clearInterval(loop);
    }
}
/**
 * This function start the game when called. 
 */
function startGame() {

    if(gameCount != 0) {
    //If a game was previously launched

        clearSnake();
        clearCaseImage(fruitPosition[0][0], fruitPosition[0][1]);

        GAME_OVER_SCREEN.style.display = "none";
    }

    direction = "n";

    
    let startX = randint(0, LINES);
    let startY = randint(0, COLUMS);
    fillCase(startX, startY, "white", false);
    //Setting a random spawn point for the snake

    snakeLenght = 0;
    snakePosition = [];
    snakePosition[0] = [startX, startY];
    //Resettings all values 

    fruitPosition = [[]];
    isFruitPresent = false;

    gameOver = false; 

    score = 0;
    updateScore(false, 0); 

    gameStarted = true;
    loop = setInterval(updateTable, SPEED);
    gameCount++;
    START_MENU.style.display = "none";
}

//This callback is executed when any key is pressed while the page have the focus
document.addEventListener("keyup", (event) => {
    
    if(gameStarted) {
        if(event.key === "ArrowLeft" || event.key == "q") {
            direction = "w";

        } else if(event.key === "ArrowRight" || event.key == "d") {
            direction = "e";

        } else if(event.key === "ArrowDown" || event.key == "s") {
            direction = "s";

        } else if(event.key === "ArrowUp" || event.key == "z") {
            direction = "n";

        }

    } else if(event.key === " ") { //Space bar
        startGame();
    }

});

//This callback is executed when the document is double clicked
document.addEventListener("dblclick", (event) => {
    event.preventDefault();
    //On computer devices, this does nothing but on mobile devices
    //it prevent automatic zoom that can't be really anoying for
    //user
});


//This callback is executed when the game table is clicked
TABLE.addEventListener("click", (event) => {

    if(!gameStarted) {
        startGame();
    }
});

//This callback is executed when the up arrow is clicked (mobile only)
UP_ARROW.addEventListener("click", (event) => {

    direction = "n";
});

//This callback is executed when the left arrow is clicked (mobile only)
LEFT_ARROW.addEventListener("click", (event) => {

    direction = "w";
});

//This callback is executed when the right arrow is clicked (mobile only)
RIGHT_ARROW.addEventListener("click", (event) => {

    direction = "e";
});

//This callback is executed when the down arrow is clicked (mobile only)
DOWN_ARROW.addEventListener("click", (event) => {

    direction = "s";
});
