import Actions from '../actions/Actions'

const initialState = {
  productsCart: [],
  isEditCart: false,
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
    default:
      return state
  }
}

export default cartReducer
