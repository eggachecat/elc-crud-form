import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator';
import * as types from '@babel/types'
import fs from 'fs'
import { type } from "os";


function _addLocales({ ast, locale, name }) {
    let job_done_export = false
    let job_done_import = false
    let last_import_statement = null
    traverse(ast, {
        enter(path) {

            if (path.isImportDeclaration()) {
                if (path.get(`specifiers.0.local`).node.name === name) {
                    job_done_import = true
                }
                last_import_statement = path
            }


            if (path.isExportDefaultDeclaration()) {
                path.traverse({
                    ObjectExpression(path) {
                        if (job_done_export) {
                            // 找到 export 底下的那个array
                            return
                        }
                        job_done_export = true

                        const spreadElements = path.get('properties')
                        for (var i = 0; i < spreadElements.length; i += 1) {
                            const _spreadElement = spreadElements[i]
                            // console.log(`_spreadElement: ${_spreadElement.get('argument').node.name}`)
                            if (_spreadElement.get('argument').node){
                                if (_spreadElement.get('argument').node.name === name) {
                                    // import 过了 不需要在import了
                                    return
                                }
                            }
                        }

                        path.pushContainer("properties", types.spreadElement(
                            types.identifier(name)
                        ));


                    }
                });
            }
        },
    });

    if (!job_done_import) {
        // console.log(`job_done_import`, job_done_import)
        last_import_statement.insertAfter(
            types.importDeclaration(
                [
                    types.importDefaultSpecifier(
                        types.identifier(name),
                    )
                ],
                types.stringLiteral(`./${locale}/${name}`)
            ),
        );
    }
    return ast
}


export default ({ code, name, locale }) => {
    // const code = fs.readFileSync('./examples/app/src/locales/zh-CN.js').toString()
    const ast = parser.parse(code, {
        sourceType: 'module'
    });
    const output = generate(_addLocales({
        ast, name, locale
    }), { /* options */ }, code);

    return output.code
}