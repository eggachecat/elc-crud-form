import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    DatePicker,
    Modal,
    message,
    Divider,
    Steps,
    Table,
    Upload,
    Popconfirm,
    Tag,
    Badge,
    Spin,
    Descriptions,
    Dropdown,
    Menu,
    Pagination,
} from 'antd';

import { formatMessage } from 'umi-plugin-react/locale';
import ReactEcharts from 'echarts-for-react';
import { cloneDeep } from 'lodash';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ELCBuildingResponsive from '@/components/ELCBuildingResponsive';
import styles from './AccountManagement.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const InputGroup = Input.Group;

const TAG_DICT = {
  "roles": {
    "0": {
      "msgId": "AccountManagement.roles.0",
      "color": "#3366cc"
    },
    "1": {
      "msgId": "AccountManagement.roles.1",
      "color": "#dc3912"
    }
  }
};
const BADGE_DICT = {
  "auth": {
    "series": {
      "msgId": "AccountManagement.auth.series",
      "color": "#3366cc"
    },
    "normal": {
      "msgId": "AccountManagement.auth.normal",
      "color": "#dc3912"
    }
  }
};


function CreateOrUpdateAccountForm(props) {
    const {
        form: { getFieldDecorator },
        current,
    } = props;

    return (
        <Form>
            
        <Form.Item label={formatMessage({ id: 'AccountManagement.username' })}>
            {getFieldDecorator('username', {
                rules: [{ required: false }],
                initialValue: current['username'],
            })(<Input placeholder={formatMessage({ id: 'common.input' })} style={{ width: '100%' }} />)}
        </Form.Item>
    
        <Form.Item label={formatMessage({ id: 'AccountManagement.roles' })}>
            {getFieldDecorator('roles', {
                rules: [{ required: false }],
                initialValue: current['roles'],
            })(
                <Select placeholder={formatMessage({ id: 'common.select' })} style={{ width: '100%' }} mode="multiple">
                    {Object.keys(TAG_DICT['roles']).map(k => (
                        <Option key={TAG_DICT['roles'][k].msgId} value={k}>
                            {formatMessage({ id: TAG_DICT['roles'][k].msgId })}
                        </Option>
                    ))}
                </Select>
            )}
        </Form.Item>
    
        <Form.Item label={formatMessage({ id: 'AccountManagement.auth' })}>
            {getFieldDecorator('auth', {
                rules: [{ required: false }],
                initialValue: current['auth'],
            })(
                <Select placeholder={formatMessage({ id: 'common.select' })} style={{ width: '100%' }} mode="multiple">
                    {Object.keys(BADGE_DICT['auth']).map(k => (
                        <Option key={BADGE_DICT['auth'][k].msgId} value={k}>
                            {formatMessage({ id: BADGE_DICT['auth'][k].msgId })}
                        </Option>
                    ))}
                </Select>
            )}
        </Form.Item>
    
        </Form>
    );
}

const WrappedCreateOrUpdateAccountForm = Form.create()(CreateOrUpdateAccountForm);

/* eslint react/no-multi-comp:0 */
@connect(({ accountmanagement, setting, loading }) => ({
    accountmanagement,
    setting,
    loading: loading.effects['accountmanagement/fetchAccountManagementList'],
    updating: loading.effects['accountmanagement/updateAccountManagement'],
    creating: loading.effects['accountmanagement/createAccountManagement']
}))
@Form.create()
@ELCBuildingResponsive
class AccountManagement extends React.Component {
    state = {
        createOrUpdateModalVisible: false,
        current: {},
        pageSize: 3,
        page: 1,
    };

    // 这就是基本上每一列的渲染方式 请折叠
    columns = [
        
        {
            title: formatMessage({ id: 'AccountManagement.username' }),
            dataIndex: 'username',
            render: (val, record) => val,
        },
    
        {
            title: formatMessage({ id: 'AccountManagement.roles' }),
            dataIndex: 'roles',
            render: vals => (
                <span>
                    {
                        vals.map(val => (
                            <Tag className="priority-pill" color={TAG_DICT['roles'][val].color}>
                                {formatMessage({ id: TAG_DICT['roles'][val].msgId })}
                            </Tag>
                        ))
                    }
                </span>
            ),
        },
    
        {
            title: formatMessage({ id: 'AccountManagement.auth' }),
            dataIndex: 'auth',
            render: vals => (
                <span>
                    {
                        vals.map(val => (
                            <Badge
                            color={BADGE_DICT['auth'][val].color}
                            text={formatMessage({ id: BADGE_DICT['auth'][val].msgId })}
                            />
                        ))
                    }
                </span>
            ),
        },
    
        {
            key: 'operation',
            render: (text, record) => (
                <div onClick={e => e.stopPropagation()}>
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item
                            key="update"
                            onClick={e => {
                                console.log('update', record);
                                this.setState({
                                    current: cloneDeep(record),
                                    createOrUpdateModalVisible: true,
                                });
                            }}
                            >
                            {formatMessage({ id: 'common.update' })}
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <a>
                    {formatMessage({ id: 'common.action' })} <Icon type="down" />
                    </a>
                </Dropdown>
                </div>
            ),
        },
    ];

    constructor(props) {
        super(props);
        this.wrappedCreateOrUpdateAccountFormRef = React.createRef();
        this.onUpdate = this.onUpdate.bind(this);
    }

    componentDidMount() {
        const {
            setting: { selectedBuildingId },
        } = this.props;
        this.onBuildingChange(selectedBuildingId);
    }

    onBuildingChange(selectedBuildingId) {
        this.fetchAccountManagementList();
    }

    onUpdate() {
        const {
            dispatch,
            setting: { selectedBuildingId },
        } = this.props;
        const { current } = this.state;
        const form = this.wrappedCreateOrUpdateAccountFormRef.current;
        const self = this;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            console.log('fieldsValue', fieldsValue);

            function onSuccess() {
                self.fetchAccountManagementList();
                form.resetFields();
                self.setState({ createOrUpdateModalVisible: false, current: {} });
            }

            if (current.id) {
                dispatch({
                    type: 'accountmanagement/updateAccountManagement',
                    payload: { ...fieldsValue, building_id: selectedBuildingId, id: current.id },
                    onSuccess,
                });
            } else {
                dispatch({
                    type: 'accountmanagement/createAccountManagement',
                    payload: { ...fieldsValue, building_id: selectedBuildingId },
                    onSuccess,
                });
            }
        });
    }

    handleFormReset = () => {
        const { form } = this.props;
        this.setState({ page: 1 });
        form.resetFields();
        this.fetchAccountManagementList();
    };

    // 搜索的更新
    onSearch = e => {
        // e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            console.log(err, fieldsValue);
            if (err) {
                console.log('err', err);
            }
            const { isactive, type } = fieldsValue;
            this.fetchAccountManagementList({
                ...Object.keys(fieldsValue).reduce((dict, key) => {
                    return {
                        ...dict,
                        ...(fieldsValue[key] !== undefined && { [key]: fieldsValue[key]}),
                    }
                }, {})
            });
        });
    };

    fetchAccountManagementList(params) {
        console.log('params', params);
        const { dispatch } = this.props;
        const {
            setting: { selectedBuildingId },
        } = this.props;
        dispatch({
            type: 'accountmanagement/fetchAccountManagementList',
            payload: { building_id: selectedBuildingId, page: this.state.page, ...params },
        });
    }

    // 搜索的那个form
    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.onSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                     
        <Col md={6} sm={24}>
            
        <Form.Item label={formatMessage({ id: 'AccountManagement.username' })}>
            {getFieldDecorator('username', {
                rules: [{ required: false }],
                
            })(<Input placeholder={formatMessage({ id: 'common.input' })} style={{ width: '100%' }} />)}
        </Form.Item>
    
        </Col>
     
        <Col md={6} sm={24}>
            
        <Form.Item label={formatMessage({ id: 'AccountManagement.roles' })}>
            {getFieldDecorator('roles', {
                rules: [{ required: false }],
                
            })(
                <Select placeholder={formatMessage({ id: 'common.select' })} style={{ width: '100%' }} mode="multiple">
                    {Object.keys(TAG_DICT['roles']).map(k => (
                        <Option key={TAG_DICT['roles'][k].msgId} value={k}>
                            {formatMessage({ id: TAG_DICT['roles'][k].msgId })}
                        </Option>
                    ))}
                </Select>
            )}
        </Form.Item>
    
        </Col>
     
        <Col md={6} sm={24}>
            
        <Form.Item label={formatMessage({ id: 'AccountManagement.auth' })}>
            {getFieldDecorator('auth', {
                rules: [{ required: false }],
                
            })(
                <Select placeholder={formatMessage({ id: 'common.select' })} style={{ width: '100%' }} mode="multiple">
                    {Object.keys(BADGE_DICT['auth']).map(k => (
                        <Option key={BADGE_DICT['auth'][k].msgId} value={k}>
                            {formatMessage({ id: BADGE_DICT['auth'][k].msgId })}
                        </Option>
                    ))}
                </Select>
            )}
        </Form.Item>
    
        </Col>
    
                    <Col md={6} sm={24}>
                        <span>
                            <Button type="primary" onClick={this.onSearch}>
                                {formatMessage({ id: 'common.search' })}
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                {formatMessage({ id: 'common.reset' })}
                            </Button>
                        </span>
                    </Col>
                </Row>

                <Button
                    icon="plus"
                    type="primary"
                    onClick={() => {
                        const form = this.wrappedCreateOrUpdateAccountFormRef.current;
                        form && form.resetFields();
                        this.setState({
                            current: {},
                            createOrUpdateModalVisible: true,
                        });
                    }}
                >
                    {formatMessage({ id: 'common.create' })}
                </Button>
            </Form>
        );
    }

    render() {
        const {
            loading,
            searching,
            accountmanagement: { list: data, total },
            updating,
            creating
        } = this.props;
        const self = this;
        console.log('data', data);
        const { current } = this.state;
        return (
            <GridContent>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <Table
                            loading={loading}
                            dataSource={data}
                            columns={this.columns}
                            pagination={{
                                pageSize: this.state.pageSize,
                                current: this.state.page,
                                total,
                                onChange: v => {
                                    this.setState({ page: v }, () => {
                                        this.onSearch();
                                    });
                                },
                            }}
                        />
                    </div>
                </Card>
                <Modal
                    visible={this.state.createOrUpdateModalVisible}
                    footer={[
                        <Button
                          key="0"
                          onClick={() => {
                            this.setState({ createOrUpdateModalVisible: false, current: {} });
                        }}
                        >
                          {formatMessage({ id: 'common.cancel' })}
                        </Button>,
                        <Button
                          type="primary"
                          key="1"
                          loading={updating || creating}
                          onClick={ () => this.onUpdate()}
                        >
                          {formatMessage({ id: 'common.confirm' })}
                        </Button>,
                      ]}
                >
                    <WrappedCreateOrUpdateAccountForm
                        current={current}
                        ref={this.wrappedCreateOrUpdateAccountFormRef}
                    />
                </Modal>
            </GridContent>
        );
    }
}

export default AccountManagement;
