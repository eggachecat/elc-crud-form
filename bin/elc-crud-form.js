#!/usr/bin/env node
"use strict";

var _elcColors = require("./elc-colors");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global_dict = {
  __ELC_CRUD__TAG_DICT: {},
  __ELC_CRUD__BADGE_DICT: {},
  __ELC_CRUD__MOCK_DATA: [],
  __ELC_CRUD__MOCK_DATA_ROW: {},
  __ELC_CRUD__NAME: "",
  // 模型的名称: 首字母大写
  __ELC_CRUD__MODEL: "",
  // 模型的model的名称
  __ELC_CRUD__API_NAME: "",
  __ELC_CRUD__COLUMNS: null,
  __ELC_CRUD__CREATE_OR_UPDATE_FORM_ITEMS: null,
  // items的字符串
  __ELC_CRUD__BUILDING_MOCK_DATA: null,
  // mock的数据
  __ELC_CRUD__CLASS_NAME: "",
  // export的class的名称
  __ELC_CRUD__BUILDING_RESPONSIVE: "@ELCBuildingResponsive",
  // 是否建筑响应?
  __ELC_CRUD__VARIABLE_FORM: "",
  // CU的modal的名称
  __ELC_CRUD__SEARCH_FORM: null,
  // 搜索的字段
  __ELC_CRUD__LOCALS_LOCALS: {}
};

function createTextColumn(_ref) {
  var prefix = _ref.prefix,
      dataIndex = _ref.dataIndex;
  global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = "".concat(Math.random());
  global_dict.__ELC_CRUD__LOCALS_LOCALS["".concat(prefix, ".").concat(dataIndex)] = "".concat(prefix, ".").concat(dataIndex);
  return "\n        {\n            title: formatMessage({ id: '".concat(prefix, ".").concat(dataIndex, "' }),\n            dataIndex: '").concat(dataIndex, "',\n            render: (val, record) => val,\n        },\n    ");
}

function createBadgeColumn(_ref2) {
  var prefix = _ref2.prefix,
      dataIndex = _ref2.dataIndex,
      enumerates = _ref2.enumerates,
      _ref2$multiple = _ref2.multiple,
      multiple = _ref2$multiple === void 0 ? false : _ref2$multiple;

  if (multiple) {
    global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = ["".concat(enumerates[0]), "".concat(enumerates[0])];
  } else {
    global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = "".concat(enumerates[0]);
  }

  global_dict.__ELC_CRUD__BADGE_DICT[dataIndex] = enumerates.reduce(function (dict, item, index) {
    global_dict.__ELC_CRUD__LOCALS_LOCALS["".concat(prefix, ".").concat(dataIndex, ".").concat(item)] = "".concat(prefix, ".").concat(dataIndex, ".").concat(item);
    dict[item] = {
      msgId: "".concat(prefix, ".").concat(dataIndex, ".").concat(item),
      color: _elcColors.ELC_COLORS[index]
    };
    return dict;
  }, {});
  global_dict.__ELC_CRUD__LOCALS_LOCALS["".concat(prefix, ".").concat(dataIndex)] = "".concat(prefix, ".").concat(dataIndex);

  if (multiple) {
    return "\n        {\n            title: formatMessage({ id: '".concat(prefix, ".").concat(dataIndex, "' }),\n            dataIndex: '").concat(dataIndex, "',\n            render: vals => (\n                <span>\n                    {\n                        vals.map(val => (\n                            <Badge\n                            color={BADGE_DICT['").concat(dataIndex, "'][val].color}\n                            text={formatMessage({ id: BADGE_DICT['").concat(dataIndex, "'][val].msgId })}\n                            />\n                        ))\n                    }\n                </span>\n            ),\n        },\n    ");
  } else {
    return "\n            {\n                title: formatMessage({ id: '".concat(prefix, ".").concat(dataIndex, "' }),\n                dataIndex: '").concat(dataIndex, "',\n                render: (val, record) => (\n                    <Badge\n                    color={BADGE_DICT['").concat(dataIndex, "'][val].color}\n                    text={formatMessage({ id: BADGE_DICT['").concat(dataIndex, "'][val].msgId })}\n                    />\n                ),\n            },\n        ");
  }
}

function createTagColumn(_ref3) {
  var prefix = _ref3.prefix,
      dataIndex = _ref3.dataIndex,
      enumerates = _ref3.enumerates,
      _ref3$multiple = _ref3.multiple,
      multiple = _ref3$multiple === void 0 ? false : _ref3$multiple;

  if (multiple) {
    global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = ["".concat(enumerates[0]), "".concat(enumerates[0])];
  } else {
    global_dict.__ELC_CRUD__MOCK_DATA_ROW[dataIndex] = "".concat(enumerates[0]);
  }

  global_dict.__ELC_CRUD__LOCALS_LOCALS["".concat(prefix, ".").concat(dataIndex)] = "".concat(prefix, ".").concat(dataIndex);
  global_dict.__ELC_CRUD__TAG_DICT[dataIndex] = enumerates.reduce(function (dict, item, index) {
    global_dict.__ELC_CRUD__LOCALS_LOCALS["".concat(prefix, ".").concat(dataIndex, ".").concat(item)] = "".concat(prefix, ".").concat(dataIndex, ".").concat(item);
    dict[item] = {
      msgId: "".concat(prefix, ".").concat(dataIndex, ".").concat(item),
      color: _elcColors.ELC_COLORS[index]
    };
    return dict;
  }, {});

  if (multiple) {
    return "\n        {\n            title: formatMessage({ id: '".concat(prefix, ".").concat(dataIndex, "' }),\n            dataIndex: '").concat(dataIndex, "',\n            render: vals => (\n                <span>\n                    {\n                        vals.map(val => (\n                            <Tag className=\"priority-pill\" color={TAG_DICT['").concat(dataIndex, "'][val].color}>\n                                {formatMessage({ id: TAG_DICT['").concat(dataIndex, "'][val].msgId })}\n                            </Tag>\n                        ))\n                    }\n                </span>\n            ),\n        },\n    ");
  } else {
    return "\n        {\n            title: formatMessage({ id: '".concat(prefix, ".").concat(dataIndex, "' }),\n            dataIndex: '").concat(dataIndex, "',\n            render: val => (\n                <Tag className=\"priority-pill\" color={TAG_DICT['").concat(dataIndex, "'][val].color}>\n                    {formatMessage({ id: TAG_DICT['").concat(dataIndex, "'][val].msgId })}\n                </Tag>\n            ),\n        },\n    ");
  }
}

function createFormItemText(_ref4) {
  var prefix = _ref4.prefix,
      dataIndex = _ref4.dataIndex,
      _ref4$required = _ref4.required,
      required = _ref4$required === void 0 ? false : _ref4$required,
      _ref4$updateForm = _ref4.updateForm,
      updateForm = _ref4$updateForm === void 0 ? false : _ref4$updateForm;
  global_dict.__ELC_CRUD__LOCALS_LOCALS["".concat(prefix, ".").concat(dataIndex)] = "".concat(prefix, ".").concat(dataIndex);
  return "\n        <Form.Item label={formatMessage({ id: '".concat(prefix, ".").concat(dataIndex, "' })}>\n            {getFieldDecorator('").concat(dataIndex, "', {\n                rules: [{ required: ").concat(required, " }],\n                ").concat(updateForm ? "initialValue: current['".concat(dataIndex, "'],") : "", "\n            })(<Input placeholder={formatMessage({ id: 'common.input' })} style={{ width: '100%' }} />)}\n        </Form.Item>\n    ");
}

function createFormItemSelect(_ref5) {
  var prefix = _ref5.prefix,
      dataIndex = _ref5.dataIndex,
      dictName = _ref5.dictName,
      _ref5$required = _ref5.required,
      required = _ref5$required === void 0 ? false : _ref5$required,
      _ref5$updateForm = _ref5.updateForm,
      updateForm = _ref5$updateForm === void 0 ? false : _ref5$updateForm;
  global_dict.__ELC_CRUD__LOCALS_LOCALS["".concat(prefix, ".").concat(dataIndex)] = "".concat(prefix, ".").concat(dataIndex);
  return "\n        <Form.Item label={formatMessage({ id: '".concat(prefix, ".").concat(dataIndex, "' })}>\n            {getFieldDecorator('").concat(dataIndex, "', {\n                rules: [{ required: ").concat(required, " }],\n                ").concat(updateForm ? "initialValue: current['".concat(dataIndex, "'],") : "", "\n            })(\n                <Select placeholder={formatMessage({ id: 'common.select' })} style={{ width: '100%' }}>\n                    {Object.keys(").concat(dictName, "['").concat(dataIndex, "']).map(k => (\n                        <Option key={").concat(dictName, "['").concat(dataIndex, "'][k].msgId} value={k}>\n                            {formatMessage({ id: ").concat(dictName, "['").concat(dataIndex, "'][k].msgId })}\n                        </Option>\n                    ))}\n                </Select>\n            )}\n        </Form.Item>\n    ");
}

function generateColumn(row) {
  switch (row.type) {
    case 'tag':
      return createTagColumn(_objectSpread({}, row));

    case 'badge':
      return createBadgeColumn(_objectSpread({}, row));

    default:
      return createTextColumn(_objectSpread({}, row));
  }
}

function generateSearchForm(row) {
  if (row.searchable) {
    switch (row.type) {
      case 'tag':
        return createFormItemSelect(_objectSpread({}, row, {
          dictName: 'TAG_DICT'
        }));

      case 'badge':
        return createFormItemSelect(_objectSpread({}, row, {
          dictName: 'BADGE_DICT'
        }));

      default:
        return createFormItemText(_objectSpread({}, row));
    }
  }

  return "";
}

function generateCreateOrUpdateForm(row) {
  switch (row.type) {
    case 'tag':
      return createFormItemSelect(_objectSpread({}, row, {
        dictName: 'TAG_DICT',
        updateForm: true
      }));

    case 'badge':
      return createFormItemSelect(_objectSpread({}, row, {
        dictName: 'BADGE_DICT',
        updateForm: true
      }));

    default:
      return createFormItemText(_objectSpread({}, row, {
        updateForm: true
      }));
  }
}

function fillTemplate(template) {
  return Object.keys(global_dict).reduce(function (_template, k) {
    return _template.replace(new RegExp("%{".concat(k, "}%"), 'g'), _typeof(global_dict[k]) === 'object' ? JSON.stringify(global_dict[k], null, 2) : global_dict[k]);
  }, template);
}

function ensureDirectoryExistence(filePath) {
  var dirname = _path["default"].dirname(filePath);

  if (_fs["default"].existsSync(dirname)) {
    return filePath;
  }

  ensureDirectoryExistence(dirname);

  _fs["default"].mkdirSync(dirname);

  return filePath;
}

function isUpperCase(character) {
  return character === character.toUpperCase();
}

function convertToMinusCase(str) {
  return str.split('').map(function (c) {
    return isUpperCase(c) ? "-".concat(c.toLowerCase()) : c;
  }).join('').replace("-", ""); // 第一个必须大写
}

function generate(file) {
  var config = JSON.parse(_fs["default"].readFileSync(file).toString());
  var configs = config.configs,
      name = config.name,
      formName = config.formName,
      folder = config.folder;
  var cwd = process.cwd();
  global_dict.__ELC_CRUD__NAME = "".concat(name); // 模型的名称: 首字母大写

  global_dict.__ELC_CRUD__MODEL = global_dict.__ELC_CRUD__NAME.toLowerCase(); // 模型的model的名称

  global_dict.__ELC_CRUD__API_NAME = "".concat(convertToMinusCase(global_dict.__ELC_CRUD__NAME));
  global_dict.__ELC_CRUD__CLASS_NAME = global_dict.__ELC_CRUD__NAME;
  global_dict.__ELC_CRUD__VARIABLE_FORM = "CreateOrUpdate".concat(formName, "Form");
  var baseFolder = folder ? folder : global_dict.__ELC_CRUD__NAME;
  console.log(_objectSpread({}, global_dict, {
    baseFolder: baseFolder
  }, config, {
    __dirname: __dirname,
    current_folder: cwd
  }));
  global_dict.__ELC_CRUD__COLUMNS = configs.map(function (config) {
    return generateColumn(_objectSpread({
      prefix: global_dict.__ELC_CRUD__NAME
    }, config));
  }).join("");
  global_dict.__ELC_CRUD__SEARCH_FORM = configs.map(function (config) {
    return " \n        <Col md={6} sm={24}>\n            ".concat(generateSearchForm(_objectSpread({
      prefix: global_dict.__ELC_CRUD__NAME
    }, config)), "\n        </Col>\n    ");
  }).join("");
  global_dict.__ELC_CRUD__CREATE_OR_UPDATE_FORM_ITEMS = configs.map(function (config) {
    return generateCreateOrUpdateForm(_objectSpread({
      prefix: global_dict.__ELC_CRUD__NAME
    }, config));
  }).join("");
  console.log("Generating page template....");
  var pageTemplate = fillTemplate(_fs["default"].readFileSync(__dirname + '/template_create_crud_form.txt').toString());

  _fs["default"].writeFileSync(ensureDirectoryExistence(_path["default"].join(cwd, "src", "pages", "".concat(baseFolder), "".concat(global_dict.__ELC_CRUD__NAME, ".js"))), pageTemplate);

  console.log("Generating model template....");
  var modelTemplate = fillTemplate(_fs["default"].readFileSync(__dirname + '/template_create_crud_form_model.txt').toString());

  _fs["default"].writeFileSync(ensureDirectoryExistence(_path["default"].join(cwd, "src", "pages", "".concat(baseFolder), "models", "".concat(global_dict.__ELC_CRUD__MODEL, ".js"))), modelTemplate);

  console.log("Generating api template....");
  global_dict.__ELC_CRUD__MOCK_DATA = [global_dict.__ELC_CRUD__MOCK_DATA_ROW];
  var apiTemplate = fillTemplate(_fs["default"].readFileSync(__dirname + '/template_create_crud_form_api.txt').toString());

  _fs["default"].writeFileSync(ensureDirectoryExistence(_path["default"].join(cwd, "src", "services", "api-".concat(global_dict.__ELC_CRUD__API_NAME, ".js"))), apiTemplate);

  console.log("Generating styles template....");
  var lessTemplate = fillTemplate(_fs["default"].readFileSync(__dirname + '/template_less.txt').toString());

  _fs["default"].writeFileSync(ensureDirectoryExistence(_path["default"].join(cwd, "src", "pages", "".concat(baseFolder), "".concat(global_dict.__ELC_CRUD__NAME, ".less"))), lessTemplate);

  console.log("Generating local template....");
  var localTemplate = fillTemplate(_fs["default"].readFileSync(__dirname + '/template_local.txt').toString());

  _fs["default"].writeFileSync(ensureDirectoryExistence(_path["default"].join(cwd, "src", "locales", "zh-CN", "".concat(global_dict.__ELC_CRUD__NAME, ".js"))), localTemplate);

  _fs["default"].writeFileSync(ensureDirectoryExistence(_path["default"].join(cwd, "src", "locales", "en-US", "".concat(global_dict.__ELC_CRUD__NAME, ".js"))), localTemplate);
}

_commander["default"].command('create <model> [otherParams...]').alias('c').description('Generates new code').action(function (model, otherParams) {
  console.log('model', model);
  generate(model);
});

_commander["default"].parse(process.argv);