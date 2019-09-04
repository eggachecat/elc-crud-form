ELC_CRUD_FORM
-------------

# 介绍
- 基于antd.pro的CRUD表单的自动生成
- 支持新增、修改、搜索

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
