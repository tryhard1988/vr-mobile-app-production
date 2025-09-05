import Actions from '../actions/Actions'

var initialState = {
  language: 'vi',
}

var languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CHANGE_LANGUAGE: {
      return {language: action.language}
    }
    default:
      return state
  }
}

export default languageReducer
