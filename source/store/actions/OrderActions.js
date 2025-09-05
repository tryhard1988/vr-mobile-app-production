import {getCart, saveCart} from '../../helpers/Storages';
import Actions from './Actions';
import {handleLoading, rawError} from './UtilsActions';
import WooCommerce from '../../config/ApiWooCommerce';

// create order
const createOrderSuccess = (data) => {
  return {
    type: Actions.CREATE_ORDER_SUCCESS,
    data,
  };
};

export const submitCreateOrder = (params, onSuccess) => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    WooCommerce.post(`orders`, params)
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.message) {
          dispatch(rawError(res?.message));
        } else {
          onSuccess ? onSuccess() : null;
        }
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        dispatch(rawError(err?.message));
      });
  };
};

// payment method
const getPaymentSuccess = (data) => {
  return {
    type: Actions.GET_PAYMENT_METHOD_SUCCESS,
    data,
  };
};

export const getPaymentMethod = () => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    WooCommerce.get('payment_gateways')
      .then((res) => {
        if (res?.message) {
          dispatch(rawError(res?.message));
        } else {
          let result = res.filter((item) => item?.enabled == true);
          dispatch(getPaymentSuccess(result));
          dispatch(handleLoading(false));
        }
      })
      .catch((err) => {
        dispatch(rawError(err?.message));
        dispatch(handleLoading(false));
      });
  };
};

// my order
const getMyOrdersRequest = () => {
  return {
    type: Actions.GET_HISTORY_ORDER_REQUEST,
  };
};

const getMyOrdersSuccess = (data) => {
  return {
    type: Actions.GET_HISTORY_ORDER_SUCCESS,
    data,
  };
};

const getMyOrdersFailure = () => {
  return {
    type: Actions.GET_HISTORY_ORDER_FAILURE,
  };
};

export const getMyOrders = (userId) => {
  let params = {per_page: 10, page: 1, customer: userId};
  return (dispatch) => {
    dispatch(handleLoading(true));
    dispatch(getMyOrdersRequest());
    WooCommerce.get('orders', params)
      .then((res) => {
        dispatch(getMyOrdersSuccess(res));
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(getMyOrdersFailure(err));
        dispatch(handleLoading(false));
        dispatch(rawError(err?.message));
      });
  };
};

// my orders more
const getMoreMyOrdersRequest = () => {
  return {
    type: Actions.GET_MORE_HISTORY_ORDER_REQUEST,
  };
};

const getMoreMyOrdersSuccess = (data) => {
  return {
    type: Actions.GET_MORE_HISTORY_ORDER_SUCCESS,
    data,
  };
};

const getMoreMyOrdersFailure = () => {
  return {
    type: Actions.GET_MORE_HISTORY_ORDER_FAILURE,
  };
};

export const getMoreMyOrders = (userId, pageIndex) => {
  let params = {per_page: 10, page: pageIndex, customer_id: userId};
  return (dispatch) => {
    dispatch(getMoreMyOrdersRequest());
    WooCommerce.get('orders', params)
      .then((res) => {
        dispatch(getMoreMyOrdersSuccess(res));
      })
      .catch((err) => {
        dispatch(getMoreMyOrdersFailure(err));
      });
  };
};
