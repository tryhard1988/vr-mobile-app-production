import Actions from './Actions'

export const changeLanguage = language => {
  return {
    type: Actions.CHANGE_LANGUAGE,
    language,
  }
}
