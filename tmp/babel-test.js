import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator';
import * as types from '@babel/types'
import fs from 'fs'
import { type } from "os";



// const code = `function square(n) {
//     if(n>0){
//         return n;
//     }
//   return n * n;
// }`;

// const code = `
// import A from 'B';

//  class D {
//   constructor() {
//     var a = 'middle';
//   }
//  }

// export default {
//     foo, awesome, bar
// }
// `;

const code = fs.readFileSync('./examples/app/config/router.config.js').toString()
const ast = parser.parse(code, {
    sourceType: 'module'
});
// console.log(ast)
let once_1 = true
let once_2 = true
let job_done = false
traverse(ast, {
    enter(path) {

        let node = path.node;
        if (path.isImportDeclaration() && once_1) {
            once_1 = false
            path.insertAfter(
                types.importDeclaration(
                    [
                        types.importSpecifier(
                            types.identifier('hehe'),
                            types.identifier('hehe2')
                        )
                    ],
                    types.stringLiteral("../file.js")
                ),
            );
        }

        if (path.isClassDeclaration()) {
            path.get('body').unshiftContainer('body', types.expressionStatement(types.stringLiteral('before')));
            path.get('body').pushContainer('body', types.expressionStatement(types.stringLiteral('after')));
        }

        if (path.isExportDefaultDeclaration() && once_2) {
            once_2 = false
            console.log('1')

            // path.insertAfter(types.expressionStatement(types.stringLiteral("A little high, little low.")));
        }

        if (path.isObjectExpression() && !job_done) {
            console.log('2')
            // console.log('node>>>', path.get('properties').length)
            job_done = true
            const lastIndex = path.get('properties').length - 1


            for (let i = 0; i < path.get('properties').length; i++) {
                // 可以用来判断是否已经用过了
                // 如果是 可以提醒更新
                console.log(path.get(`properties.${i}`).get(`key`).node.name)
            }

            // types.objectExpression(types.objectProperty(types.identifier('sunao'), types.identifier('11')))
            path.get(`properties.${lastIndex}`).insertAfter(
                // types.objectProperty(types.identifier('sunao'), types.identifier('11'),)
                types.objectExpression(
                    [types.objectProperty(types.identifier('sunao'), types.identifier('11'))]
                )

            );

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

console.log(`================`)

const output = generate(ast, { /* options */ }, code);

console.log(output.code)

// const code = fs.readFileSync('./examples/app/config/router.config.js').toString()

// const ast = parse(code, {
//     sourceType: 'module'
// });

// console.log(ast)

// const output = generate(ast, { /* options */ }, code);

// console.log(output.code)