//DISCLAIMER
//This script automates the generation of four sets of EC keys for use in the token generation prototype.
//This script is by no means optimized for performance, and was created out of necessity.


//import the methods
const { count } = require("console");
const { generateKeyPair, createSign, createVerify } = require("crypto");
//generate the key pair

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Input: ${answer}`);
    var reciever = answer; //Max 4
    SuperFunc(reciever);
    rl.close();
  });

function SuperFunc(reciever){

  var pubName;
  var privName;

generateKeyPair(
  "ec", //ec
  {
    //modulusLength: 2048, // It holds a number. It is the key size in bits and is applicable for RSA, and DSA algorithm only.
    namedCurve: "secp521r1", //prime256v1 = P-256 || secp384r1 = P-384 || secp521r1 = P-521
    publicKeyEncoding: {
      type: "spki", //Note the type is spki not pkcs1
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8", //For RSA use pkcs1 format, for EC use pkcs8 or sec1
      format: "pem",
      //cipher: "aes-256-cbc", //Optional
      //passphrase: "", //Optional
    },
  },
  (err, publicKey, privateKey) => {
    // Handle errors and use the generated key pair.
    if (err) console.log("Error!", err);

    reciever = parseInt(reciever);

    switch(reciever){
      case 1:
        pubName = "./keys/pubKeyAlice.pem"
        privName = "./keys/privKeyAlice.pem"
        break;
      case 2:
        pubName = "./keys/pubKeyBob.pem"
        privName = "./keys/privKeyBob.pem"
        break;
      case 3:
        pubName = "./keys/pubKeyCharlie.pem"
        privName = "./keys/privKeyCharlie.pem"
        break;
      case 4:
        pubName = "./keys/pubKeyDory.pem"
        privName = "./keys/privKeyDory.pem"
        break;
    };

    const fs = require('fs');

    fs.writeFile(pubName, publicKey, function(err) {
        if(err) {
            return console.log(err);
        }
    console.log("Public key saved for: ", reciever);
    }); 

    fs.writeFile(privName, privateKey, function(err) {
        if(err) {
            return console.log(err);
        }
    console.log("Private key saved for: ", reciever);
    });  
  }
);
}