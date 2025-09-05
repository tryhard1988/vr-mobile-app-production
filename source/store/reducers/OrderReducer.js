import Actions from '../actions/Actions'

const initialState = {
  productsCart: [],
  isEditCart: false,
  paymentMethod: [],
  myOrders: [],
  isMore: false,
  pageIndex: 1,
}

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.GET_CART: {
      return {...state, productsCart: action.data}
    }
    case Actions.ADD_PRODUCT_TO_CART: {
      return {...state, productsCart: action.data}
    }
    case Actions.HANDLE_EDIT_CART: {
      return {...state, isEditCart: action.value}
    }
    case Actions.GET_PAYMENT_METHOD_SUCCESS: {
      return {...state, paymentMethod: action.data}
    }
    // history order
    case Actions.GET_HISTORY_ORDER_REQUEST: {
      return {...state, myOrders: [], pageIndex: 1}
    }
    case Actions.GET_HISTORY_ORDER_SUCCESS: {
      return {
        ...state,
        myOrders: action.data,
        isMore: action.data.length == 10 ? true : false,
      }
    }
    case Actions.GET_HISTORY_ORDER_FAILURE: {
      return {...state, myOrders: []}
    }
    // more history order
    case Actions.GET_MORE_HISTORY_ORDER_REQUEST: {
      return {...state, isMore: false}
    }
    case Actions.GET_MORE_HISTORY_ORDER_SUCCESS: {
      return {
        ...state,
        myOrders: [...state.myOrders, ...action.data],
        pageIndex: state.pageIndex + 1,
        isMore: action.data.length == 10 ? true : false,
      }
    }
    case Actions.GET_MORE_HISTORY_ORDER_FAILURE: {
      return {...state, isMore: false}
    }

    default:
      return state
  }
}

export default cartReducer
