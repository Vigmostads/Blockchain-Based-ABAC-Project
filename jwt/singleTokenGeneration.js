//DISCLAIMER
//This script was made as part of a token prototype for the master's thesis of Victor Vigmostad & Torbjørn Lauen
//The script is not optimized for performance, and serves purely as a proof of concept for the thesis.


//SET THE TIME FOR PERFORMANCE


var jwt = require("jsonwebtoken");

var tokenStruct = { //Token structure object used to pass to functions.
    DP: "0",
    ID: "1",
    Algorithm: "ES512", 
    ExpirationTime: 86400, //24h in seconds.
    Action: "RW",
    ObjectID: 12345678,
    Previous: "NULL",
    Reciever: "Error: No reciever set",
    Issuer: "Error: No issuer set",
    PrivateKey: "Error: No key set",
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (answer) => {
    // TODO: Log the answer in a database
    //console.log(`Input: ${answer}`);
    var user_input = answer;
    var t1 = Date.now();
    SuperFunc(user_input, t1);
    rl.close();
  });


function SuperFunc(user_input, t1){

const fs = require('fs');
var privkeyAlice = fs.readFileSync("./keys/privKeyAlice.pem"); //Get the private key of issuer
var certAlice = fs.readFileSync("./keys/pubKeyAlice.pem"); //Get the public key of issuer

var privKeyBob = fs.readFileSync("./keys/privKeyBob.pem"); //Get the private key of issuer
var certBob = fs.readFileSync("./keys/pubKeyBob.pem"); //Get the public key of issuer

var privKeyCharlie = fs.readFileSync("./keys/privKeyCharlie.pem"); //Get the private key of issuer
var certCharlie = fs.readFileSync("./keys/pubKeyCharlie.pem"); //Get the public key of reciever

var privKeyDory = fs.readFileSync("./keys/privKeyDory.pem"); //Get the private key of issuer
var certDory = fs.readFileSync("./keys/pubKeyDory.pem"); //Get the public key of reciever


var input_name = "./tokens/token" + user_input + ".txt";
//console.log("Reading file:", input_name);
var input_token = fs.readFileSync(input_name, {encoding: "utf8", flag: "r"}); //Get the stored token

var howManyTokensToMake = 1; //100 x 33 = ran out of memory.
var tokenDelegationLevel = 1; //33 seem to be max with RSA //42 max with EC256 key //41 max with EC512
var tokensArray = [];
var delegatedArray = [];

GenerateManyTokens(howManyTokensToMake, tokenDelegationLevel);

function GenerateToken(tokenStruct){
    var time = new Date().valueOf();
    var Seed = Math.floor(Math.random() * time);

    var generatedToken = jwt.sign(
    {
        DP: tokenStruct.DP,
        ObjectId: tokenStruct.ObjectID,
        Action: tokenStruct.Action,
        Receiver: tokenStruct.Reciever,
        RS: Seed,
        Previous: tokenStruct.Previous,   
        Issuer: tokenStruct.Issuer,
    }, 
    tokenStruct.PrivateKey, 
    { 
        algorithm: tokenStruct.Algorithm,
        expiresIn: tokenStruct.ExpirationTime,
    });
    return generatedToken;
};

function GenerateManyTokens(amount, delegationLevel){

    var delegationCount = delegationLevel;
    var delegating = true;

    for (a = 0; a < delegationCount; a++){

        //Generates "amount" number of tokens into the tokensArray
        for (i = 0; i < amount; i++){

            if(delegating){
                //tokenStruct.Previous = tokensArray[i];
                tokenStruct.Previous = input_token;
            }

            tokenStruct.ObjectID = Math.floor(Math.random() * 90000) + 10000; //Ranodom ObjectID
            tokenStruct.ID = i.toString(); //Set token ID

            var randomAction = Math.floor(Math.random() * 3);
            switch(randomAction){
                case 0: 
                    tokenStruct.Action = "R";
                    break;
                case 1:
                    tokenStruct.Action = "W";
                    break;
                case 2: 
                    tokenStruct.Action = "RW";
                    break;
            }
            
            var randomIssuer = Math.floor(Math.random() * 4);
            switch(randomIssuer){
                case 0:
                    //FROM ALICE
                    tokenStruct.Issuer = certAlice.toString();
                    tokenStruct.PrivateKey = privkeyAlice.toString();
                    //RANDOM RECIEVER
                    var randomReciever = Math.floor(Math.random() * 3);
                    switch(randomReciever){
                        case 0:
                            tokenStruct.Reciever = certBob.toString();
                            break;
                        case 1: 
                            tokenStruct.Reciever = certCharlie.toString();
                            break;
                        case 2: 
                            tokenStruct.Reciever = certDory.toString();
                            break;
                    };
                    break;
                case 1:
                    //FROM BOB
                    tokenStruct.Issuer = certBob.toString();
                    tokenStruct.PrivateKey = privKeyBob.toString();
                    //RANOM RECIEVER
                    var randomReciever = Math.floor(Math.random() * 3);
                    switch(randomReciever){
                        case 0:
                            tokenStruct.Reciever = certAlice.toString();
                            break;
                        case 1: 
                            tokenStruct.Reciever = certCharlie.toString();
                            break;
                        case 2: 
                            tokenStruct.Reciever = certDory.toString();
                            break;
                    };
                    break;
                case 2:
                    //FROM CHARLIE
                    tokenStruct.Issuer = certCharlie.toString();
                    tokenStruct.PrivateKey = privKeyCharlie.toString();
                    //RANOM RECIEVER
                    var randomReciever = Math.floor(Math.random() * 3);
                    switch(randomReciever){
                        case 0:
                            tokenStruct.Reciever = certAlice.toString();
                            break;
                        case 1: 
                            tokenStruct.Reciever = certBob.toString();
                            break;
                        case 2: 
                            tokenStruct.Reciever = certDory.toString();
                            break;
                    };
                    break;
                case 3: 
                    //FROM DORY
                    tokenStruct.Issuer = certDory.toString();
                    tokenStruct.PrivateKey = privKeyDory.toString();
                    //RANOM RECIEVER
                    var randomReciever = Math.floor(Math.random() * 3);
                    switch(randomReciever){
                        case 0:
                            tokenStruct.Reciever = certAlice.toString();
                            break;
                        case 1: 
                            tokenStruct.Reciever = certBob.toString();
                            break;
                        case 2: 
                            tokenStruct.Reciever = certCharlie.toString();
                            break;
                    };
                    break;
            };



            var output = GenerateToken(tokenStruct);

            if(delegating){
                tokensArray.splice(i, 1, output); //Replaces token in array with delegated versions.
                
            }else{
                tokensArray.push(output); //Adds newly made tokens to empty array.
            }
            delegatedArray.push(output);
        }
        //In case the loop continues.
        delegating = true;
        

        var timeNow = Date.now() - t1;
        //console.log(timeNow); //For testing purposes it prints the time.
    }
}

/*
var fileName = "./tokens/testToken.txt"; //Sets the filename for the token.

fs.writeFile(fileName, tokensArray[0], function(err) {
    if(err) {
        return console.log(err);
    }
console.log("The token was written to filepath: ", fileName);
var t2 = Date.now();
var timeMs = t2 - t1
var timeSeconds = Math.floor(timeMs / 1000); 
timeMs = timeMs - (timeSeconds*1000)
console.log("Successfully wrote", howManyTokensToMake, "token(s) at level", tokenDelegationLevel, "at", timeSeconds, "s and", timeMs, "ms.");
});  
  
*/

for (i = 1; i <= delegatedArray.length; i++){
    //var fileName = "./tokens/token" + i + ".txt"; //Sets the filename for the token.
    var fileName = "./tokens/testToken.txt";
    var token = delegatedArray[i-1];
    writeAll(fileName, token, i);
};

function writeAll(path, token, i){
    fs.writeFile(path, token, function(err) {
        if(err) {
            return console.log(err);
        }
    //console.log(" ")
    //console.log("The token was written to filepath: ", path);
    var t2 = Date.now();
    var timeMs = t2 - t1
    var timeSeconds = Math.floor(timeMs / 1000); 
    timeMs = timeMs - (timeSeconds*1000)
    var level = parseInt(user_input) + 1;
    //console.log("Successfully wrote", howManyTokensToMake, "token(s) at level", level, "at", timeSeconds, "s and", timeMs, "ms, to path: ", path);
    console.log(timeMs);
    });  
};
};