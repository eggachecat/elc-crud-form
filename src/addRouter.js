import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator';
import * as types from '@babel/types'

function findInObject(path, targetKey) {
    for (let i = 0; i < path.get('properties').length; i++) {
        // 可以用来判断是否已经用过了
        // 如果是 可以提醒更新
        const key = path.get(`properties.${i}`).get(`key`).node.name
        if (key === targetKey) {
            return i
        }
    }

}


/**
 * 默认是
 * export default [
 *      {}
 * ] 
 * 支持:
 *  1. [] 单独的路由 `/<route>/`
 *  2. [] 嵌套的子路有`/<pRoute>/<cRoute>/` 
 */
function addRouter({ code, config, entranceIndex = 1 }) {
    // console.log(config)
    const ast = parser.parse(code, {
        sourceType: 'module'
    });
    const routeConfig = types.objectExpression(
        Object.keys(config).map(k => types.objectProperty(
            types.identifier(k), types.stringLiteral(config[k])))
    )

    const { path: targetPath } = config
    let job_done = false
    traverse(ast, {
        enter(path) {
            if (path.isExportDefaultDeclaration()) {
                path.traverse({
                    ArrayExpression(path) {
                        if (job_done) {
                            // 找到 export 底下的那个array
                            return
                        }

                        const rootRoute = path.get(`elements.${entranceIndex}`)
                        const routesIndex = findInObject(rootRoute, "routes")
                        if (!routesIndex) {
                            return
                        }
                        job_done = true

                        const routes = rootRoute.get(`properties.${routesIndex}`).get("value");
                        const routeObjects = routes.get('elements')
                        let isRouteExist = false
                        for (var i = 0; i < routeObjects.length; i += 1) {
                            const _route = routeObjects[i]
                            const _properites = _route.get('properties')
                            for (var j = 0; j < _properites.length; j += 1) {
                                const __properity = _properites[j]
                                if (__properity.get(`key`).node.name === 'path') {
                                    if (__properity.get(`value`).node.value === targetPath) {
                                        // 找到了就做replace
                                        console.log(`found!`)
                                        isRouteExist = true
                                        _route.replaceWith(routeConfig)
                                    }
                                }
                            }
                        }
                        if (!isRouteExist) {
                            routes.unshiftContainer("elements", routeConfig);
                        }
                    }
                });
            }
        },
    });
    return generate(ast, {}, code).code
}

// const code = fs.readFileSync('./examples/app/config/router.config.js').toString()

// const output = generate(addRouter({
//     code, config: {
//         'path': '/sunao',
//         'name': 'sunao',
//         'component': '/Sunao/Sunao'
//     }
// }), { /* options */ }, code);

// console.log(output.code)
export default addRouter