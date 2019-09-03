import { ELC_COLORS } from './elc-colors'
// const fs = require('fs'),
import fs from 'fs'


const global_dict = {
    __ELC_CRUD__TAG_DICT: {},
    __ELC_CRUD__BADGE_DICT: {},
    __ELC_CRUD__MOCK_DATA: [],
    __ELC_CRUD__MOCK_DATA_ROW: {},
    __ELC_CRUD__NAME: `AccountManagement`, // 模型的名称: 首字母大写
    __ELC_CRUD__MODEL: `accountmanagement`, // 模型的model的名称
    __ELC_CRUD__API_NAME: `account-management`,
    __ELC_CRUD__COLUMNS: null,
    __ELC_CRUD__CREATE_OR_UPDATE_FORM_ITEMS: null,// items的字符串
    __ELC_CRUD__BUILDING_MOCK_DATA: null, // mock的数据
    __ELC_CRUD__CLASS_NAME: `AccountManagement`, // export的class的名称
    __ELC_CRUD__BUILDING_RESPONSIVE: `@ELCBuildingResponsive`, // 是否建筑响应?
    __ELC_CRUD__VARIABLE_FORM: `CreateOrUpdateAccountForm`, // CU的modal的名称
    __ELC_CRUD__SEARCH_FORM: null // 搜索的字段
}

function createTextColumn({ prefix, dataIndex }) {
    global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = `${Math.random()}`
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

    global_dict.__ELC_CRUD__TAG_DICT[dataIndex] = enumerates.reduce((dict, item, index) => {
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


function createFormItemText({ prefix, dataIndex, required = false }) {
    return `
        <Form.Item label={formatMessage({ id: '${prefix}.${dataIndex}' })}>
            {getFieldDecorator('${dataIndex}', {
                rules: [{ required: ${required} }],
            })(<Input />)}
        </Form.Item>
    `
}

function createFormItemSelect({ prefix, dataIndex, dictName, required = false }) {
    return `
        <Form.Item label={formatMessage({ id: '${prefix}.${dataIndex}' })}>
            {getFieldDecorator('${dataIndex}', {
                rules: [{ required: ${required} }],
            })(
                <Select>
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
            return createTagColumn(row)
        case 'badge':
            return createBadgeColumn(row)
        default:
            return createTextColumn(row)
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
                return createFormItemText(row)
        }
    }
    return ""
}

function generateCreateOrUpdateForm(row) {
    switch (row.type) {
        case 'tag':
            return createFormItemSelect({ ...row, dictName: 'TAG_DICT' })
        case 'badge':
            return createFormItemSelect({ ...row, dictName: 'BADGE_DICT' })
        default:
            return createFormItemText(row)
    }
}

function fillTemplate(template) {
    return Object.keys(global_dict).reduce((_template, k) => {
        return _template.replace(new RegExp(`%{${k}}%`, 'g'), typeof global_dict[k] === 'object' ? JSON.stringify(global_dict[k], null, 2) : global_dict[k])
    }, template)
}

function test() {
    const configs = [
        { dataIndex: 'username', type: 'text', searchable: true, multiple: true },
        { dataIndex: 'roles', type: 'tag', enumerates: ['0', '1'], searchable: true, multiple: true },
        { dataIndex: 'auth', type: 'badge', enumerates: ['series', 'normal'], searchable: true, multiple: true },
    ]
    console.log(configs.length)
    // console.log();
    // console.log(configs.map(config => generateCreateOrUpdateForm({ prefix, ...config })).join(""));

    global_dict.__ELC_CRUD__COLUMNS = configs.map(config => generateColumn({ prefix: global_dict.__ELC_CRUD__NAME, ...config })).join("")
    global_dict.__ELC_CRUD__SEARCH_FORM = configs.map(config => ` 
        <Col md={6} sm={24}>
            ${generateSearchForm({ prefix: global_dict.__ELC_CRUD__NAME, ...config })}
        </Col>
    `).join("")
    global_dict.__ELC_CRUD__CREATE_OR_UPDATE_FORM_ITEMS = configs.map(config => generateCreateOrUpdateForm({ prefix: global_dict.__ELC_CRUD__NAME, ...config })).join("")

    console.log(global_dict.__ELC_CRUD__MOCK_DATA_ROW)
    const pageTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form.txt').toString());
    console.log(pageTemplate)
    fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\pages\\Account\\Settings\\AccountManagement.js', pageTemplate)


    const modelTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form_model.txt').toString());
    fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\pages\\Account\\Settings\\models\\accountmanagement.js', modelTemplate)

    global_dict.__ELC_CRUD__MOCK_DATA = [global_dict.__ELC_CRUD__MOCK_DATA_ROW]
    const apiTemplate = fillTemplate(fs.readFileSync(__dirname + '/template_create_crud_form_api.txt').toString());
    fs.writeFileSync('D:\\Workspace\\elc\\v2.preview.pro.ant.design\\src\\services\\api-account-management.js', apiTemplate)

}

test()