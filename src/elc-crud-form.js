#!/usr/bin/env node

import { ELC_COLORS } from './elc-colors'

import fs from 'fs'
import path from 'path'
import program from 'commander'


const global_dict = {
    __ELC_CRUD__TAG_DICT: {},
    __ELC_CRUD__BADGE_DICT: {},
    __ELC_CRUD__MOCK_DATA: [],
    __ELC_CRUD__MOCK_DATA_ROW: {},
    __ELC_CRUD__NAME: ``, // 模型的名称: 首字母大写
    __ELC_CRUD__MODEL: ``, // 模型的model的名称
    __ELC_CRUD__API_NAME: ``,
    __ELC_CRUD__COLUMNS: null,
    __ELC_CRUD__CREATE_OR_UPDATE_FORM_ITEMS: null,// items的字符串
    __ELC_CRUD__BUILDING_MOCK_DATA: null, // mock的数据
    __ELC_CRUD__CLASS_NAME: ``, // export的class的名称
    __ELC_CRUD__BUILDING_RESPONSIVE: `@ELCBuildingResponsive`, // 是否建筑响应?
    __ELC_CRUD__VARIABLE_FORM: ``, // CU的modal的名称
    __ELC_CRUD__SEARCH_FORM: null, // 搜索的字段
    __ELC_CRUD__LOCALS_LOCALS: {}
}

function createTextColumn({ prefix, dataIndex }) {
    global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = `${Math.random()}`
    global_dict.__ELC_CRUD__LOCALS_LOCALS[`${prefix}.${dataIndex}`] = `${prefix}.${dataIndex}`
    return `
        {
            title: formatMessage({ id: '${prefix}.${dataIndex}' }),
            dataIndex: '${dataIndex}',
            render: (val, record) => val,
        },
    `
}

function createBadgeColumn({ prefix, dataIndex, enumerates, multiple = false }) {
    if (multiple) {
        global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = [`${enumerates[0]}`, `${enumerates[0]}`]
    } else {
        global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = `${enumerates[0]}`
    }
    global_dict.__ELC_CRUD__BADGE_DICT[dataIndex] = enumerates.reduce((dict, item, index) => {
        global_dict.__ELC_CRUD__LOCALS_LOCALS[`${prefix}.${dataIndex}.${item}`] = `${prefix}.${dataIndex}.${item}`

        dict[item] = {
            msgId: `${prefix}.${dataIndex}.${item}`,
            color: ELC_COLORS[index]
        }
        return dict
    }, {});
    global_dict.__ELC_CRUD__LOCALS_LOCALS[`${prefix}.${dataIndex}`] = `${prefix}.${dataIndex}`

    if (multiple) {
        return `
        {
            title: formatMessage({ id: '${prefix}.${dataIndex}' }),
            dataIndex: '${dataIndex}',
            render: vals => (
                <span>
                    {
                        vals.map(val => (
                            <Badge
                            color={BADGE_DICT['${dataIndex}'][val].color}
                            text={formatMessage({ id: BADGE_DICT['${dataIndex}'][val].msgId })}
                            />
                        ))
                    }
                </span>
            ),
        },
    `
    } else {
        return `
            {
                title: formatMessage({ id: '${prefix}.${dataIndex}' }),
                dataIndex: '${dataIndex}',
                render: (val, record) => (
                    <Badge
                    color={BADGE_DICT['${dataIndex}'][val].color}
                    text={formatMessage({ id: BADGE_DICT['${dataIndex}'][val].msgId })}
                    />
                ),
            },
        `
    }
}

function createTagColumn({ prefix, dataIndex, enumerates, multiple = false }) {
    if (multiple) {
        global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = [`${enumerates[0]}`, `${enumerates[0]}`]
    } else {
        global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = `${enumerates[0]}`
    }
    global_dict.__ELC_CRUD__LOCALS_LOCALS[`${prefix}.${dataIndex}`] = `${prefix}.${dataIndex}`

    global_dict.__ELC_CRUD__TAG_DICT[dataIndex] = enumerates.reduce((dict, item, index) => {
        global_dict.__ELC_CRUD__LOCALS_LOCALS[`${prefix}.${dataIndex}.${item}`] = `${prefix}.${dataIndex}.${item}`

        dict[item] = {
            msgId: `${prefix}.${dataIndex}.${item}`,
            color: ELC_COLORS[index]
        }
        return dict
    }, {});
    if (multiple) {
        return `
        {
            title: formatMessage({ id: '${prefix}.${dataIndex}' }),
            dataIndex: '${dataIndex}',
            render: vals => (
                <span>
                    {
                        vals.map(val => (
                            <Tag className="priority-pill" color={TAG_DICT['${dataIndex}'][val].color}>
                                {formatMessage({ id: TAG_DICT['${dataIndex}'][val].msgId })}
                            </Tag>
                        ))
                    }
                </span>
            ),
        },
    `
    } else {
        return `
        {
            title: formatMessage({ id: '${prefix}.${dataIndex}' }),
            dataIndex: '${dataIndex}',
            render: val => (
                <Tag className="priority-pill" color={TAG_DICT['${dataIndex}'][val].color}>
                    {formatMessage({ id: TAG_DICT['${dataIndex}'][val].msgId })}
                </Tag>
            ),
        },
    `
    }

}


function createFormItemText({ prefix, dataIndex, required = false, updateForm = false }) {
    global_dict.__ELC_CRUD__LOCALS_LOCALS[`${prefix}.${dataIndex}`] = `${prefix}.${dataIndex}`
    return `
        <Form.Item label={formatMessage({ id: '${prefix}.${dataIndex}' })}>
            {getFieldDecorator('${dataIndex}', {
                rules: [{ required: ${required} }],
                ${updateForm ? `initialValue: current['${dataIndex}'],` : ""}
            })(<Input placeholder={formatMessage({ id: 'common.input' })} style={{ width: '100%' }} />)}
        </Form.Item>
    `
}

function createFormItemSelect({ prefix, dataIndex, dictName, required = false, updateForm = false }) {
    global_dict.__ELC_CRUD__LOCALS_LOCALS[`${prefix}.${dataIndex}`] = `${prefix}.${dataIndex}`
    return `
        <Form.Item label={formatMessage({ id: '${prefix}.${dataIndex}' })}>
            {getFieldDecorator('${dataIndex}', {
                rules: [{ required: ${required} }],
                ${updateForm ? `initialValue: current['${dataIndex}'],` : ""}
            })(
                <Select placeholder={formatMessage({ id: 'common.select' })} style={{ width: '100%' }}>
                    {Object.keys(${dictName}['${dataIndex}']).map(k => (
                        <Option key={${dictName}['${dataIndex}'][k].msgId} value={k}>
                            {formatMessage({ id: ${dictName}['${dataIndex}'][k].msgId })}
                        </Option>
                    ))}
                </Select>
            )}
        </Form.Item>
    `
}


function generateColumn(row) {
    switch (row.type) {
        case 'tag':
            return createTagColumn({ ...row })
        case 'badge':
            return createBadgeColumn({ ...row })
        default:
            return createTextColumn({ ...row })
    }
}

function generateSearchForm(row) {
    if (row.searchable) {
        switch (row.type) {
            case 'tag':
                return createFormItemSelect({ ...row, dictName: 'TAG_DICT' })
            case 'badge':
                return createFormItemSelect({ ...row, dictName: 'BADGE_DICT' })
            default:
                return createFormItemText({ ...row })
        }
    }
    return ""
}

function generateCreateOrUpdateForm(row) {
    switch (row.type) {
        case 'tag':
            return createFormItemSelect({ ...row, dictName: 'TAG_DICT', updateForm: true })
        case 'badge':
            return createFormItemSelect({ ...row, dictName: 'BADGE_DICT', updateForm: true })
        default:
            return createFormItemText({ ...row, updateForm: true })
    }
}

function fillTemplate(template) {
    return Object.keys(global_dict).reduce((_template, k) => {
        return _template.replace(new RegExp(`%{${k}}%`, 'g'), typeof global_dict[k] === 'object' ? JSON.stringify(global_dict[k], null, 2) : global_dict[k])
    }, template)
}


function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return filePath;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
    return filePath
}


function isUpperCase(character) {
    return character === character.toUpperCase()
}

function convertToMinusCase(str) {
    return str.split('').map(c => isUpperCase(c) ? `-${c.toLowerCase()}` : c).join('') // 第一个必须大写
}


// __dirname
// function test() {
//     const configs = [
//         { dataIndex: 'username', type: 'text', searchable: true, multiple: true },
//         { dataIndex: 'roles', type: 'tag', enumerates: ['0', '1'], searchable: true, multiple: true },
//         { dataIndex: 'auth', type: 'badge', enumerates: ['series', 'normal'], searchable: true, multiple: true },
//     ]
//     console.log(configs.length)
//     // console.log();
//     // console.log(configs.map(config => generateCreateOrUpdateForm({ prefix, ...config })).join(""));

//     global_dict.__ELC_CRUD__COLUMNS = configs.map(config => generateColumn({ prefix: global_dict.__ELC_CRUD__NAME, ...config })).join("")
//     global_dict.__ELC_CRUD__SEARCH_FORM = configs.map(config => ` 
//         <Col md={6} sm={24}>
//             ${generateSearchForm({ prefix: global_dict.__ELC_CRUD__NAME, ...config })}
//         </Col>
//     `).join("")
//     global_dict.__ELC_CRUD__CREATE_OR_UPDATE_FORM_ITEMS = configs.map(config => generateCreateOrUpdateForm({ prefix: global_dict.__ELC_CRUD__NAME, ...config })).join("")

//     console.log(global_dict.__ELC_CRUD__MOCK_DATA_ROW)
//     const pageTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form.txt').toString());
//     console.log(pageTemplate)
//     fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\pages\\Account\\Settings\\AccountManagement.js', pageTemplate)

//     const modelTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form_model.txt').toString());
//     fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\pages\\Account\\Settings\\models\\accountmanagement.js', modelTemplate)

//     global_dict.__ELC_CRUD__MOCK_DATA = [global_dict.__ELC_CRUD__MOCK_DATA_ROW]
//     const apiTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form_api.txt').toString());
//     fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\services\\api-account-management.js', apiTemplate)

//     const lessTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_less.txt').toString());
//     fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\pages\\Account\\Settings\\AccountManagement.less', lessTemplate)

//     // const localTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_local.txt').toString());
//     // fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\locales\\zh-CN\\accountmanagement.js', localTemplate)

// }


function generate(file) {
    const config = JSON.parse(fs.readFileSync(file).toString())
    const { configs, name, formName, folder } = config

    global_dict.__ELC_CRUD__NAME = `${name}` // 模型的名称: 首字母大写
    global_dict.__ELC_CRUD__MODEL = global_dict.__ELC_CRUD__NAME.toLowerCase() // 模型的model的名称
    global_dict.__ELC_CRUD__API_NAME = `api${convertToMinusCase(global_dict.__ELC_CRUD__NAME)}`
    global_dict.__ELC_CRUD__CLASS_NAME = global_dict.__ELC_CRUD__NAME
    global_dict.__ELC_CRUD__VARIABLE_FORM = `CreateOrUpdate${formName}Form`

    const baseFolder = folder ? folder : global_dict.__ELC_CRUD__NAME

    console.log(global_dict)


    global_dict.__ELC_CRUD__COLUMNS = configs.map(config => generateColumn({ prefix: global_dict.__ELC_CRUD__NAME, ...config })).join("")
    global_dict.__ELC_CRUD__SEARCH_FORM = configs.map(config => ` 
        <Col md={6} sm={24}>
            ${generateSearchForm({ prefix: global_dict.__ELC_CRUD__NAME, ...config })}
        </Col>
    `).join("")
    global_dict.__ELC_CRUD__CREATE_OR_UPDATE_FORM_ITEMS = configs.map(config => generateCreateOrUpdateForm({ prefix: global_dict.__ELC_CRUD__NAME, ...config })).join("")

    const pageTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form.txt').toString());
    fs.writeFileSync(ensureDirectoryExistence(path.join(__dirname, `src\\pages\\${baseFolder}\\${global_dict.__ELC_CRUD__NAME}.js`)), pageTemplate)

    const modelTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form_model.txt').toString());
    fs.writeFileSync(ensureDirectoryExistence(path.join(__dirname, `src\\pages\\${baseFolder}\\models\\${global_dict.__ELC_CRUD__MODEL}.js`)), modelTemplate)

    global_dict.__ELC_CRUD__MOCK_DATA = [global_dict.__ELC_CRUD__MOCK_DATA_ROW]
    const apiTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form_api.txt').toString());
    fs.writeFileSync(ensureDirectoryExistence(path.join(__dirname, `src\\services\\${global_dict.__ELC_CRUD__API_NAME}.js`)), apiTemplate)


    const lessTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_less.txt').toString());
    fs.writeFileSync(ensureDirectoryExistence(path.join(__dirname, `src\\pages\\${baseFolder}\\${global_dict.__ELC_CRUD__NAME}.less`)), lessTemplate)

    const localTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_local.txt').toString());
    fs.writeFileSync(ensureDirectoryExistence(path.join(__dirname, `src\\locales\\zh-CN\\${global_dict.__ELC_CRUD__NAME}.js`)), localTemplate)
    fs.writeFileSync(ensureDirectoryExistence(path.join(__dirname, `src\\locales\\en-US\\${global_dict.__ELC_CRUD__NAME}.js`)), localTemplate)

}

program
    .command('create <model> [otherParams...]')
    .alias('c')
    .description('Generates new code')
    .action(function (model, otherParams) {
        console.log('model', model);
        generate(model)
    });

program.parse(process.argv);

