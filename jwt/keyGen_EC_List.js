//DISCLAIMER
//This script generates a list of Elliptic Curve key pairs and saves it to a document for testing purposes.
//The script is in no way optimized for what it does, and was merely created out of necessity.


//SET THE TIME FOR PERFORMANCE
var t1 = Date.now();

const { count } = require("console");
var crypto = require("crypto");

const keyAmount = 1000000;
var counter = 0;
var ECPubKeys = [];
var PK = "";

for (i = 1; i <= keyAmount; i++){
    const reciever = crypto.generateKeyPair(
        "ec",
        {
          //modulusLength: 256, // It holds a number. It is the key size in bits and is applicable for RSA, and DSA algorithm only.
          namedCurve: "prime256v1", //prime256v1 = P-256 || secp384r1 = P-384 || secp521r1 = P-521
          publicKeyEncoding: {
            type: "spki", //Note the type is pkcs1 not spki
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
            if(err) console.log("Error!", err);
            PK = publicKey;
            
            ECPubKeys.push(PK);
            counter += 1;
            if(counter === keyAmount){
                writeToFile();
            }
        }
    );//keygen func

}//loop

function writeToFile(){
    const fs = require('fs');
    const writeStream = fs.createWriteStream('./ECKeys/1Mx256ECPubKeyArray.txt');
    const pathName = writeStream.path;
    

    // write each value of the array on the file breaking line
    for (i = 0; i < ECPubKeys.length; i++){
        var toWrite = ECPubKeys[i] + "\n";
        writeStream.write(toWrite);
    };

    //ECPubKeys.forEach(value => writeStream.write(`${value}\n`));

    // the finish event is emitted when all data has been flushed from the stream
    writeStream.on('finish', () => {
    console.log(`wrote all the`, counter, `elements in array to file ${pathName}`);
    });

    // handle the errors on the write process
    writeStream.on('error', (err) => {
        console.error(`There is an error writing the file ${pathName} => ${err}`)
    });

    // close the stream
    writeStream.end();

    var t2 = Date.now();
    console.log(" ");
    console.log("--------TIME-ELAPSED--------");
    console.log("Time spent: ", (t2 - t1), " milliseconds.");
}


