import axios from 'axios'

const currentEnv = {
  name: 'production',
  url: 'https://vietrau.com/wp-json/',
  version: 'v1.0.4',

  // name: 'uat',
  // url: 'https://vietrau-uat.aegona.work/wp-json/',
  // version: 'v1.0.0',
}

export const apiJson = axios.create({
  baseURL: currentEnv.url,
  timeout: 20000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const apiFormData = axios.create({
  baseURL: currentEnv.url,
  timeout: 20000,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
})

export const qrScanJson = axios.create({
  baseURL: 'https://a2xgzlcpfa.execute-api.ap-southeast-1.amazonaws.com/',
  timeout: 20000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const versionApp = `${currentEnv.name}-${currentEnv.version}`
