AUTO_CRUD_TABLE_ANTD_PRO
-------------

# 介绍
- 基于antd.pro的CRUD表单的自动生成
- 从JSON直接mapping到代码
    - 为啥不直接解析json而是生成代码?
    - 因为更想要灵活度
    - 包括字段的和UI的一一对应的灵活调整
- 支持新增、修改、搜索
- 包含了路由的新增，多语言的支持
    - 有啥特别的？
    - 相比前面的字符串拼接 更多了语法树的操作(babel很强大!)
# 使用方法
## 指令

- 安装
    ```
        npm install -g elc-crud-form
    ```
- 使用
    ```
        cd PROJECT_ROOT
        create-elc-crud-form c ./model.json
    ```
## model.json
```json
{
    "name": "MODEL_NAME",
    "formName": "FORM_NAME",
    "folder": "FOLDER_NAME_UNDER_PAGES",
    "configs": [
        {
            "dataIndex": "username",
            "type": "text",
            "searchable": true
        },
        {
            "dataIndex": "roles",
            "type": "tag",
            "enumerates": [
                "0",
                "1"
            ],
            "searchable": true,
            "multiple": true
        },
        {
            "dataIndex": "auth",
            "type": "badge",
            "enumerates": [
                "series",
                "normal"
            ],
            "searchable": true,
            "multiple": true
        }
    ]
}
```
