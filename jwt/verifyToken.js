//DISCLAIMER
//This script was made as part of a token prototype for the master's thesis of Victor Vigmostad & Torbjørn Lauen
//The script is not optimized for performance, and serves purely as a proof of concept for the thesis.

//SET THE TIME FOR PERFORMANCE

const jwt = require("jsonwebtoken");
const fs = require('fs');
const { decode } = require("punycode");
const { connected } = require("process");

var privkeyAlice = fs.readFileSync("./keys/privKeyAlice.pem"); //Get the private key of issuer
var certAlice = fs.readFileSync("./keys/pubKeyAlice.pem"); //Get the public key of issuer

var privKeyBob = fs.readFileSync("./keys/privKeyBob.pem"); //Get the private key of issuer
var certBob = fs.readFileSync("./keys/pubKeyBob.pem"); //Get the public key of issuer

var certCharlie = fs.readFileSync("./keys/pubKeyCharlie.pem"); //Get the public key of reciever

var token = fs.readFileSync("./tokens/token41.txt", {encoding: "utf8", flag: "r"}); //Get the stored token
//var token = fs.readFileSync("./tokens/testToken.txt", {encoding: "utf8", flag: "r"}); //Get the stored token
var t1 = Date.now();
var starttime = t1;

function FindFirstToken(input){
    var temp_token = input; //Encoded
    var temp_decode = SimpleDecode(temp_token); //Holds decoded JSON object
    var temp_verify = VerifyToken(temp_token, temp_decode.payload.Issuer); //Holds BOOL

    loop();

    function loop(){
        if((temp_verify) && (temp_decode.payload.Previous != "NULL")){
            temp_token = temp_decode.payload.Previous;
            temp_decode = SimpleDecode(temp_token);
            temp_verify = VerifyToken(temp_token, temp_decode.payload.Issuer);
            
            if(temp_decode.payload.Previous != "NULL" ){
                loop();
            }
        }else{
            console.log("Error: Token is already first token!");
        }
    }
    var returnVar = [temp_decode, temp_verify];
    return returnVar;
}

function VerifyToken(input, cert){
    var isValid = false;
    jwt.verify(input, cert, { complete: true }, function(err, decoded){
        if(err){
            console.log("Error: ", err.message);
            return err;
        }else{
            var truebool = true;
            isValid = true;
            var timeNow = Date.now();
            var timePer = timeNow - t1;
            var timeTot = timeNow - starttime;
            t1 = timeNow;
            //console.log("Verify success at time: ", timeNow);
            console.log(timePer); //Pure number for easy testing.
        }
    });
    return isValid;
};

function SimpleDecode(token){
    var token_decoded = jwt.decode(token, {complete: true});
    return token_decoded;
}

var output = FindFirstToken(token);
console.log(" ");
console.log("--------FIND-FIRST---------");
console.log("Last token verified: ", output[1]);
console.log("Last token seed: ", output[0].payload.RS);

var t2 = Date.now();
console.log("Time spent: ", (t2 - starttime), " milliseconds.");