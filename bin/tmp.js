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
import styles from './AlarmLog.less';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { CONST_PRIORITY_MAP, CONST_STATUS_MAP } from '@/pages/IntelligentAlarm/constants';
import { EMPTY_CHART_OPTION } from '@/constants';
import ELCBuildingResponsive from '@/components/ELCBuildingResponsive';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const InputGroup = Input.Group;

const CONST_CONTACT_STATUS_MAP = {
    true: { color: 'green', msgId: 'common.active' },
    false: { color: 'red', msgId: 'common.in_active' },
};
const CONST_CONTACT_TYPE_MAP = {
    1: { msgId: 'common.emergency_contact' },
    0: { msgId: 'common.others' },
};

function CreateOrUpdateContactForm(props) {
    const {
        form: { getFieldDecorator },
        current,
    } = props;

    return (
        <Form>
            <Form.Item label={formatMessage({ id: 'common.building' })}>
                {getFieldDecorator('building_displayname', {
                    rules: [{ required: true }],
                    initialValue: current.building_displayname,
                })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'common.name' })}>
                {getFieldDecorator('contacts_name', {
                    rules: [{ required: true }],
                    initialValue: current.contacts_name,
                })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'common.phone' })}>
                {getFieldDecorator('phones', {
                    rules: [{ required: true }],
                    initialValue: current.phones,
                })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'common.email' })}>
                {getFieldDecorator('mails', {
                    rules: [{ required: true }],
                    initialValue: current.mails,
                })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'common.contact_type' })}>
                {getFieldDecorator('type', {
                    rules: [{ required: true }],
                    initialValue: `${current.type ? current.type : 0}`,
                })(
                    <Select style={{ width: '100%' }}>
                        {Object.keys(CONST_CONTACT_TYPE_MAP).map(_type => (
                            <Option key={`${_type}`} value={_type}>
                                {formatMessage({ id: CONST_CONTACT_TYPE_MAP[_type].msgId })}
                            </Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'common.status' })}>
                {getFieldDecorator('isactive', {
                    rules: [{ required: true }],
                    initialValue: `${current.isactive ? current.isactive : true}`,
                })(
                    <Select style={{ width: '100%' }}>
                        {Object.keys(CONST_CONTACT_STATUS_MAP).map(_status => (
                            <Option key={`${_status}`} value={_status}>
                                <Badge
                                    color={CONST_CONTACT_STATUS_MAP[_status].color}
                                    text={formatMessage({ id: CONST_CONTACT_STATUS_MAP[_status].msgId })}
                                />
                            </Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
        </Form>
    );
}

const WrappedCreateOrUpdateContactForm = Form.create()(CreateOrUpdateContactForm);

/* eslint react/no-multi-comp:0 */
@connect(({ intelligentalarm, contactmanagement, setting, loading }) => ({
    intelligentalarm,
    setting,
    contactmanagement,
    loading: loading.effects['contactmanagement/fetchContactList'],
}))
@Form.create() // 搜索的form
@ELCBuildingResponsive
class ContactManagement extends React.Component {
    state = {
        createOrUpdateModalVisible: false,
        //
        current: {},
        // 尽量flat
        currentStatus: false,
        currentMemo: '',
        page: 1,
    };

    // 这就是基本上每一列的渲染方式 请折叠
    columns = [
        {
            title: formatMessage({ id: 'common.order_number' }),
            dataIndex: 'id',
            sorter: true,
        },
        {
            title: formatMessage({ id: 'common.building' }),
            dataIndex: 'building_displayname',
            sorter: true,
        },
        {
            title: formatMessage({ id: 'common.name' }),
            dataIndex: 'contacts_name',
            sorter: true,
        },
        {
            title: formatMessage({ id: 'common.phone' }),
            dataIndex: 'phones',
            sorter: true,
        },
        {
            title: formatMessage({ id: 'common.email' }),
            dataIndex: 'mails',
            sorter: true,
        },
        {
            title: formatMessage({ id: 'common.status' }),
            dataIndex: 'isactive',
            render: (val, record) => (
                <Badge
                    color={CONST_CONTACT_STATUS_MAP[val].color}
                    text={formatMessage({ id: CONST_CONTACT_STATUS_MAP[val].msgId })}
                />
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
        this.wrappedCreateOrUpdateContactFormRef = React.createRef();
        this.onUpdate = this.onUpdate.bind(this);
    }

    componentDidMount() {
        const {
            setting: { selectedBuildingId },
        } = this.props;
        this.onBuildingChange(selectedBuildingId);
    }

    onBuildingChange(selectedBuildingId) {
        this.fetchContactList();
    }

    onUpdate() {
        const {
            dispatch,
            setting: { selectedBuildingId },
        } = this.props;
        const { current } = this.state;
        const form = this.wrappedCreateOrUpdateContactFormRef.current;
        const self = this;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            console.log('fieldsValue', fieldsValue);

            function onSuccess() {
                self.fetchContactList();
                form.resetFields();
                self.setState({ createOrUpdateModalVisible: false, current: {} });
            }

            if (current.id) {
                dispatch({
                    type: 'contactmanagement/updateContact',
                    payload: { ...fieldsValue, building_id: selectedBuildingId, contact_id: current.id },
                    onSuccess,
                });
            } else {
                dispatch({
                    type: 'contactmanagement/createContact',
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
        this.fetchContactList();
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
            this.fetchContactList({
                ...(isactive !== undefined && { isactive: isactive === 'true' }),
                ...(type !== undefined && { type: parseInt(type, 10) }),
            });
        });
    };

    fetchContactList(params) {
        console.log('params', params);
        const { dispatch } = this.props;
        const {
            setting: { selectedBuildingId },
        } = this.props;
        dispatch({
            type: 'contactmanagement/fetchContactList',
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
                    <Col md={4} sm={24}>
                        <FormItem label={formatMessage({ id: 'common.status' })}>
                            {getFieldDecorator('isactive')(
                                <Select
                                    placeholder={formatMessage({ id: 'common.select' })}
                                    style={{ width: '100%' }}
                                >
                                    {Object.keys(CONST_CONTACT_STATUS_MAP).map(k => {
                                        return (
                                            <Option value={k} key={k}>
                                                {formatMessage({ id: CONST_CONTACT_STATUS_MAP[k].msgId })}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label={formatMessage({ id: 'common.contact_type' })}>
                            {getFieldDecorator('type')(
                                <Select
                                    placeholder={formatMessage({ id: 'common.select' })}
                                    style={{ width: '100%' }}
                                >
                                    {Object.keys(CONST_CONTACT_TYPE_MAP).map(k => {
                                        return (
                                            <Option value={k} key={k}>
                                                {formatMessage({ id: CONST_CONTACT_TYPE_MAP[k].msgId })}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
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
            contactmanagement: { list: data, total },
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
                                pageSize: 10,
                                current: this.state.page,
                                total,
                                onChange: v => {
                                    console.log('v', v);
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
                    onCancel={() => {
                        // Esc也可以推出
                        this.setState({ createOrUpdateModalVisible: false, current: {} });
                    }}
                    onOk={() => {
                        this.onUpdate();
                    }}
                >
                    <WrappedCreateOrUpdateContactForm
                        current={current}
                        ref={this.wrappedCreateOrUpdateContactFormRef}
                    />
                </Modal>
            </GridContent>
        );
    }
}

export default ContactManagement;
