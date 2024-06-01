//include input
const readline = require('readline')

//include external resources
external = require('./external.js');

main ();

function main () {
//START PROGRAM
//set up variables
    var arrayWord = [];
    var arrayWordInvisible = [];
    var lettersToGuess = 0;
    var theWord = '';
    var theDefinition = '';
    var hangmanLives = 6;

    init();

//GET INITIAL DATA
    async function init() {
        //loop till get correct
        let response = {
            data: '',
            error: '',
        }

        do {
            //getting the word
            theWord = await external.getWord();

            //get the definition
            response = await external.getDefinition(theWord);
            theDefinition = response.data;
            if (response.error !== '') {
                console.log(response.error)
            }
        } while (response.error !== '')
        //STARTING GAME
        initGame(theWord, theDefinition);
    }

//SETTING UP GAME VARIABLES
    function initGame(theWord, theDefinition) {
        //make visible array
        arrayWord = Array.from(theWord);
        //make invisible array
        arrayWordInvisible = arrayWord.map((x) => x);
        for (let n = 0; n < arrayWordInvisible.length; n++) {
            for (let i = 0; i < external.alphabet.length; i++) {
                if (arrayWordInvisible[n] === external.alphabet[i]) {
                    arrayWordInvisible[n] = '_';
                    lettersToGuess++;
                }
            }
        }
        //external.printArray(arrayWordDefinition);  //uncomment to peek at the word at the start
        external.printArrayAndDef(arrayWordInvisible, theDefinition);
        gameLoop();
    }

//GAME LOOP
    async function gameLoop() {
        //init variables
        let input = 'it should not show this';
        let winState = false; //win when true
        let lettersGuessedArray = [];

        //MAIN LOOP
        let gameStop = false; //ends when gameStop true
        while (gameStop === false) {

            //INPUT LOOP
            let loopCondition = true;
            while (loopCondition === true) {
                try {
                    input = await external.getInput();
                    console.log(input)
                    //check if letter was guessed already
                    let letterGuessedState = false; // was guessed when true
                    for (n = 0; n < lettersGuessedArray.length; n++) {
                        if (input === lettersGuessedArray[n]) {
                            letterGuessedState = true
                        }
                    }
                    if (letterGuessedState === true) {
                        console.log(`letter was guessed already`)
                    } else {
                        loopCondition = false;
                        console.clear();
                    }
                } catch {
                    console.log(`rejected!`);
                }
            }


            //CHECKING GUESS
            let guessCorrect = false; //guess correct when true

            //check if letter present
            for (let n = 0; n < arrayWord.length; n++) {
                if (input === arrayWord[n]) {
                    arrayWordInvisible[n] = input;
                    guessCorrect = true; //setting guess correctness
                    lettersToGuess = lettersToGuess - 1;
                    //console.log(`letters to guess: ${lettersToGuess}`)
                }
            }
            //guess result handle
            if (guessCorrect === true) {
                console.log(`correct!`);
            } else {
                hangmanLives = hangmanLives - 1;
                console.log(`no such letter; you have ${hangmanLives} lives`);
            } //TODO lives


            //end of loop conditionals and stuff
            lettersGuessedArray[lettersGuessedArray.length + 1] = input;
            external.printArrayAndDef(arrayWordInvisible, theDefinition);
            let lettersGuessedString = lettersGuessedArray.join('');
            console.log(lettersGuessedString);
            if (hangmanLives === 0) {
                gameStop = true;
                winState = false;
            }
            if (lettersToGuess === 0) {
                winState = true;
                gameStop = true;
            }
        }

        //ENDING
        if (winState === true) {
            console.log(`YOU WIN!!!`)
        } else {
            console.log(`NO MORE LIVES; YOU GOT HANGED!`);
            external.printArrayAndDef(arrayWord, 'the word');
        }
    }

}
