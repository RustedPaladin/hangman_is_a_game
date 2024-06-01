//include axios
const axios = require('axios');
const readline = require('readline');


//checking if input is valid
function checkIfInputValid (input) {
    let validity = false;
    i = 0; //loop counter;
    if (typeof input != "string") {console.log('input is not valid'); return validity;}
    else if (input.length != 1) {console.log('input is not valid'); return validity;}
    else do {
            if (input === alphabet[i]) {validity = true}
            else {i++;}
        } while (validity != true && i < 26);
    if (validity != true) {console.log(`input is not valid`); return validity;}
    else {return validity;}
}

function checkIfInputValidNoLog (input) {
    let validity = false;
    i = 0; //loop counter;
    if (typeof input != "string") {return validity;}
    else if (input.length != 1) {return validity;}
    else do {
            if (input === alphabet[i]) {validity = true}
            else {i++;}
        } while (validity != true && i < 26);
    if (validity != true) {return validity;}
    else {return validity;}
}

//the alphabet
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


//GET METHODS FOR API
//no internet getWord
function getDummyWord () {
    let word = {
        data: ['hangman']
    }
    return new Promise (function (resolve) {
        resolve (word);
    })
}

//no internet getDefinition
function getDummyDefinition (word) {
    return new Promise (function (resolve) {
        resolve (`a guessing game, that's ${word}`);
    })
}

//get random word in random form
async function getRandomWord () {
    let data = await axios.get('https://random-word-api.herokuapp.com/word');
    return data.data[0];
}

//get random word from different api
async function getLessRandomWord () {
    let data = await axios({
        method: 'get',
        url: 'http://api.api-ninjas.com/v1/randomword',
        headers: {
            'X-Api-Key': 'xxJmjAsPzlhBOlnJb/GLOA==a3SyW6zHFKbuVLpg'
        }});
    return data.data.word;
}

//get weather
async function getWeather () {
    var city = 'Moscow';
    let data = await axios({
        method: 'get',
        url: 'http://api.weatherapi.com/v1/current.json?key=5e514a7fcb8b4436be8162312232509&q=' + city + '&aqi=no',
        headers: {
            'X-Api-Key': '5e514a7fcb8b4436be8162312232509'
        },
    });
    return data.data.current.condition.text.toLowerCase();
}

//GET FIRST DEFINITION; returns object
async function getFirstDefinition (word) {
    let response = {
        data: '',
        error: ''
    }
    try {
        let data = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
        response.data = data.data[0].meanings[0].definitions[0].definition.toLowerCase();
        return response;
    }
    catch (error) {
        response.error = error.response.status;
        return response;
    }
}

//get phonetics
async function getPhoneticDefinition (word) {
    let data = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
    return data.data[0].phonetics[0];
}

//PRINTING ARRAY
function printArrayAndDef (array, string) {console.log(`${array.join('')} is ${string}`)}
function printArray (array) {console.log(array.join(''))}

//HANDLING INPUT STREAM
//returning promise
function getInputPromise() {
    return new Promise((resolve, reject) => {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`write input `, (input) => {
            if (checkIfInputValid(input) === true) {
                resolve(input);
                rl.close();
            } else {
                reject(input);
                rl.close();
            }
        });

    });
}

//just gets and returns input
function getInputPromiseSimple(optionsNumbersArray) {
    return new Promise((resolve) => {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(``, (input) => {
            resolve(input);
            rl.close();
        });
    });
}

module.exports.alphabet = alphabet;
module.exports.checkInputValidity = checkIfInputValidNoLog;
module.exports.printArrayAndDef = printArrayAndDef;
module.exports.printArray = printArray;
module.exports.getWord = getLessRandomWord;
module.exports.getDefinition = getFirstDefinition;
module.exports.getWeather = getWeather;
module.exports.getInput = getInputPromise;
module.exports.getInputSimple = getInputPromiseSimple;


//the .then is a method of a promise object
//'resolve' in a promise-making func is a reference to the function, passed into .then