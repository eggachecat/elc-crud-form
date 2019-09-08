import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator';
import * as types from '@babel/types'
import fs from 'fs'



const code = `function square(n) {
    if(n>0){
        return n;
    }
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
    enter(path) {

        let node = path.node;
        if (types.isIfStatement(node)){
            console.log('node>>>', node)
            traverse(path)
        }

        // if (path.isIdentifier({ name: "n" })) {
        //     path.node.name = "x";
        // }
    },
    // FunctionDeclaration: function (path) {
    //     path.node.id.name = "x";
    // },
    // ifStatement: function(path){
    //     console.log('path>>>', path)
    // }
});

const output = generate(ast, { /* options */ }, code);

console.log(output.code)

// const code = fs.readFileSync('./examples/app/config/router.config.js').toString()

// const ast = parse(code, {
//     sourceType: 'module'
// });

// console.log(ast)

// const output = generate(ast, { /* options */ }, code);

// console.log(output.code)