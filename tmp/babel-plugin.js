module.exports = function testPlugin(babel) {
    return {
        visitor: {
            Identifier(path) {
                console.log(`in plugin>>> ${path.node.name}`)
                if (path.node.name === 'foo') {
                    path.node.name = 'baz';
                }
            }
        }
    };
};