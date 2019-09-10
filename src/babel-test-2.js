import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator';
import * as types from '@babel/types'
import fs from 'fs'
import { type } from "os";

function addRouter(code){

    const ast = parser.parse(code, {
        sourceType: 'module'
    });
    // console.log(ast)
    let once_1 = true
    let once_2 = true
    traverse(ast, {
        enter(path) {
            if (path.isArrayExpression()) {
                console.log('2')
                // console.log('node>>>', path.get('properties').length)

                const lastIndex = path.get('elements').length - 1


                for (let i = 0; i < path.get('elements').length; i++) {
                    // 可以用来判断是否已经用过了
                    // 如果是 可以提醒更新
                    console.log(path.get(`elements.${i}`).get(`properties.${i}`).get(`key`).node.name)
                }


                path.get(`properties.${lastIndex}`).insertAfter(
                    types.objectProperty(types.identifier('sunao'), types.identifier('11'))
                );

            }
        },
    });

}