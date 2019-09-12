const babel = require('@babel/core');
const plugin = require('./babel-plugin');

// var example = `
// var foo = 1;
// if (foo) console.log(foo);
// `;

// it('works', () => {
//     const { code } = babel.transform(example, { plugins: [plugin] });
//     expect(code).toMatchSnapshot();
// });

it('foo is an alias to baz', () => {
    var input = `
    var foo = 1;
    // test that foo was renamed to baz
    var res = baz;
  `;
    var { code } = babel.transform(input, { plugins: [plugin] });
    console.log(code)
    var f = new Function(`
    ${code};
    return res;
  `);
    var res = f();
    // assert(res === 1, 'res is 1');
    // expect(res).toEqual(1);
    expect(res).toEqual(1);
});