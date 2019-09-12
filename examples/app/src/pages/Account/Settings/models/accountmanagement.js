import {
    createAccountManagement,
    updateAccountManagement,
    retrieveAccountManagementList,
    deleteAccountManagement,
} from '@/services/api-account-management';
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

export default {
  namespace: 'accountmanagement',
  state: {
    list: [],
    page: 0,
    total: 0,
  },
  effects: {
    *fetchAccountManagementList ({ payload }, { call, put }) {
      if (payload.building_id) {
        const response = yield call(retrieveAccountManagementList, payload);
        console.log('response', response);
        yield put({
          type: 'setList',
          payload: {
            response: response.data,
          },
        });
      }
    },
    *updateAccountManagement({ payload, onSuccess }, { call, put }) {
      const response = yield call(updateAccountManagement, payload);
      onSuccess && onSuccess();
      message.success(formatMessage({ id: 'message.success-create' }));
    },
    *createAccountManagement({ payload, onSuccess }, { call, put }) {
      const response = yield call(createAccountManagement, payload);
      onSuccess && onSuccess();
      message.success(formatMessage({ id: 'message.success-update' }));
    },
  },
  reducers: {
    setList(state, action) {
      return {
        ...state,
        list: action.payload.response.results,
        page: action.payload.response.page_count,
        total: action.payload.response.count,
      };
    },
  },
};
