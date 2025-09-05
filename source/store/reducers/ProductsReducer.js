import Actions from '../actions/Actions'

const initialState = {
  category: [],
  packingVariation: [],
  listProducts: [],
  listProductsTodayOffers: [],
  isDoneTodayOffers: false,
  listProductsNewest: [],
  isDoneProductsNewest: false,
  pageIndex: 1,
  isMore: false,
  productReview: [],
}

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    // category
    case Actions.GET_CATEGORY_REQUEST: {
      return {...state}
    }
    case Actions.GET_CATEGORY_SUCCESS: {
      return {...state, category: action.data}
    }
    case Actions.GET_CATEGORY_FAILURE: {
      return {...state, category: []}
    }
    // product preview
    case Actions.GET_PRODUCT_REVIEW_REQUEST: {
      return {...state, productReview: []}
    }
    case Actions.GET_PRODUCT_REVIEW_SUCCESS: {
      return {...state, productReview: action.data}
    }
    case Actions.GET_PRODUCT_REVIEW_FAILURE: {
      return {...state, productReview: []}
    }
    // send product preview
    case Actions.SEND_PRODUCT_REVIEW_SUCCESS: {
      return {...state, productReview: [...state.productReview, action.data]}
    }
    // products list today offers
    case Actions.GET_LIST_PRODUCTS_TODAY_OFFERS_SUCCESS: {
      return {
        ...state,
        listProductsTodayOffers: action.data,
        isDoneTodayOffers: true,
      }
    }
    // products list newest
    case Actions.GET_LIST_PRODUCTS_NEWEST_SUCCESS: {
      return {
        ...state,
        listProductsNewest: action.data,
        isDoneProductsNewest: true,
      }
    }
    // products list
    case Actions.GET_LIST_PRODUCTS_REQUEST: {
      return {...state, listProducts: [], pageIndex: 1}
    }
    case Actions.GET_LIST_PRODUCTS_SUCCESS: {
      return {
        ...state,
        listProducts: action.data,
        isMore: action.data.length == 10 ? true : false,
      }
    }
    case Actions.GET_LIST_PRODUCTS_FAILURE: {
      return {...state, listProducts: []}
    }
    // products list more
    case Actions.GET_MORE_LIST_PRODUCTS_REQUEST: {
      return {...state, isMore: false}
    }
    case Actions.GET_MORE_LIST_PRODUCTS_SUCCESS: {
      return {
        ...state,
        listProducts: [...state.listProducts, ...action.data],
        pageIndex: state.pageIndex + 1,
        isMore: action.data.length == 10 ? true : false,
      }
    }
    case Actions.GET_MORE_LIST_PRODUCTS_FAILURE: {
      return {...state, isMore: false}
    }

    default:
      return state
  }
}

export default productsReducer
