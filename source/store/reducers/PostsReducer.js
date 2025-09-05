import Actions from '../actions/Actions'

const initialState = {
    listPosts: [],
    listPostsHome: [],
    isDonePostsHome: false,
    detailPost: {},
    isMore: false,
    pageIndex: 1,
}

const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        // list posts
        case Actions.GET_LIST_POSTS_REQUEST: {
            return { ...state, listPosts: [], pageIndex: 1 }
        }
        case Actions.GET_LIST_POSTS_SUCCESS: {
            return { ...state, listPosts: action.data, listPostsHome: action.data, isDonePostsHome: true, isMore: action.data.length == 10 ? true : false }
        }
        case Actions.GET_LIST_POSTS_FAILURE: {
            return { ...state, listPosts: [] }
        }
        // list posts more
        case Actions.GET_MORE_LIST_POSTS_REQUEST: {
            return { ...state, isMore: false }
        }
        case Actions.GET_MORE_LIST_POSTS_SUCCESS: {
            return {
                ...state, listPosts: [...state.listPosts, ...action.data],
                pageIndex: state.pageIndex + 1, isMore: action.data.length == 10 ? true : false
            }
        }
        case Actions.GET_MORE_LIST_POSTS_FAILURE: {
            return { ...state, isMore: false }
        }
        default:
            return state
    }
}

export default postsReducer