/* =========================================
   BASIC UTILITIES
========================================= */

function textToBytes(text) {

    let arr = [];

    for (let i = 0; i < text.length; i++) {

        arr.push(text.charCodeAt(i));

    }

    return arr;

}

function bytesToText(arr) {

    let text = "";

    for (let n of arr) {

        text += String.fromCharCode(n);

    }

    return text;

}

/* XOR helper */

function xor(a, b) {

    return a ^ b;

}


/* =========================================
   AES SIMULATION 
========================================= */

function aesEncrypt(x, key) {

    return (x + key) % 256;

}

function aesDecrypt(x, key) {

    return (x - key + 256) % 256;

}


/* =========================================
   ECB MODE
========================================= */

function encryptECB(blocks, key) {

    return blocks.map(b => aesEncrypt(b, key));

}

function decryptECB(blocks, key) {

    return blocks.map(b => aesDecrypt(b, key));

}


/* =========================================
   CBC MODE
========================================= */

function encryptCBC(blocks, key) {

    let iv = 1;
    let result = [];

    for (let b of blocks) {

        let x = xor(b, iv);

        let c = aesEncrypt(x, key);

        result.push(c);

        iv = c;

    }

    return result;

}

function decryptCBC(blocks, key) {

    let iv = 1;
    let result = [];

    for (let c of blocks) {

        let x = aesDecrypt(c, key);

        let p = xor(x, iv);

        result.push(p);

        iv = c;

    }

    return result;

}


/* =========================================
   CFB MODE
========================================= */

function encryptCFB(blocks, key) {

    let iv = 1;
    let result = [];

    for (let b of blocks) {

        let o = aesEncrypt(iv, key);

        let c = xor(b, o);

        result.push(c);

        iv = c;

    }

    return result;

}

function decryptCFB(blocks, key) {

    let iv = 1;
    let result = [];

    for (let c of blocks) {

        let o = aesEncrypt(iv, key);

        let p = xor(c, o);

        result.push(p);

        iv = c;

    }

    return result;

}


/* =========================================
   OFB MODE
========================================= */

function encryptOFB(blocks, key) {

    let iv = 1;
    let result = [];

    for (let b of blocks) {

        iv = aesEncrypt(iv, key);

        let c = xor(b, iv);

        result.push(c);

    }

    return result;

}

function decryptOFB(blocks, key) {

    return encryptOFB(blocks, key);

}


/* =========================================
   MAIN ENCRYPT
========================================= */

function encrypt() {

    let text = document.getElementById("text").value;

    let key = parseInt(document.getElementById("key").value);

    if (isNaN(key)) {
        alert("Key harus berupa angka");
        return;
    }

    let mode = document.getElementById("mode").value;

    let blocks = textToBytes(text);

    let result;

    if (mode === "ECB") {

        result = encryptECB(blocks, key);

    }

    if (mode === "CBC") {

        result = encryptCBC(blocks, key);

    }

    if (mode === "CFB") {

        result = encryptCFB(blocks, key);

    }

    if (mode === "OFB") {

        result = encryptOFB(blocks, key);

    }

    let format = document.getElementById("format").value;

    if(format === "decimal"){
        document.getElementById("result").value = result.join(" ");
    }

    if(format === "base64"){
        document.getElementById("result").value = bytesToBase64(result);
    }

}


/* =========================================
   MAIN DECRYPT
========================================= */

function decrypt() {

    let text = document.getElementById("text").value;

    let key = parseInt(document.getElementById("key").value);

    if (isNaN(key)) {
        alert("Key harus berupa angka");
        return;
    }

    let mode = document.getElementById("mode").value;

    let format = document.getElementById("format").value;

    let blocks;

    if(format === "decimal"){
        blocks = text.split(" ").map(Number);
    }

    if(format === "base64"){
        blocks = base64ToBytes(text);
    }

    let result;

    if (mode === "ECB") {

        result = decryptECB(blocks, key);

    }

    if (mode === "CBC") {

        result = decryptCBC(blocks, key);

    }

    if (mode === "CFB") {

        result = decryptCFB(blocks, key);

    }

    if (mode === "OFB") {

        result = decryptOFB(blocks, key);

    }

    document.getElementById("result").value = bytesToText(result);

}

function bytesToBase64(arr){

    let binary = "";

    for(let b of arr){
        binary += String.fromCharCode(b);
    }

    return btoa(binary);

}

function base64ToBytes(str){

    let binary = atob(str);

    let arr = [];

    for(let i=0;i<binary.length;i++){
        arr.push(binary.charCodeAt(i));
    }

    return arr;

}
