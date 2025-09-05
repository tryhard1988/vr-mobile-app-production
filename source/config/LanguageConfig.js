import I18n from 'i18n-js'
import * as RNLocalize from 'react-native-localize'

import en from '../translations/en'
import vi from '../translations/vi'

/**
 *Use the device language to become app language
 */
const locales = RNLocalize.getLocales()
if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag
}

/** set app language*/
// I18n.locale = 'vi'

I18n.translations = {
  default: vi,
  en,
  vi,
}

I18n.fallbacks = true
export default I18n
