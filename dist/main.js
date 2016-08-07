"use strict";
var greet_1 = require('./greet');
function hello(compiler) {
    console.log('hello from ${compiler}');
}
// hello('Typescript');
console.log(greet_1.sayHello('Typescript___'));
function showHello(divName, name) {
    var elt = document.getElementById(divName);
    elt.innerHTML = greet_1.sayHello(name);
}
showHello('greeting', 'Typescript');
