import axios from 'axios'

const config = {
  baseURL: process.env.REACT_APP_API_ENDPOINT
}

if (typeof window.adamkyc_frontend_nonce === 'undefined') {
  config.auth = {
    username: process.env.REACT_APP_AUTH_USERNAME,
    password: process.env.REACT_APP_AUTH_PASSWORD
  }
} else {
  config.headers = {
    'X-WP-Nonce': window.adamkyc_frontend_nonce.nonce
  }
}

export const instance = axios.create(config)
