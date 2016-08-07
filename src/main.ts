import { sayHello } from './greet';

function hello(compiler:string) {
    console.log('hello from ${compiler}');
}
// hello('Typescript');

console.log(sayHello('Typescript___'));

function showHello(divName:string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerHTML = sayHello(name);
}

showHello('greeting','Typescript');