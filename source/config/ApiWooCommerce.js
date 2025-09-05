import WooCommerceAPI from 'react-native-woocommerce-api'
// import WooCommerceAPI from "@woocommerce/woocommerce-rest-api"

const WooCommerce = WooCommerceAPI({
  // Test
  // url: 'https://vietrau-test.aegona.work/',
  // Prod
  url: 'https://vietrau.com',
  consumerKey: 'ck_f036161451c89c24432beb8512241c285f397e94', // Your consumer key
  consumerSecret: 'cs_c23468dff43d653af17834c53d0cdee7468799aa', // Your consumer secret
  ssl: false,
  wpAPI: true, // Enable the WP REST API integration
  version: 'wc/v3', // WooCommerce WP REST API version
  queryStringAuth: true,
})

export default WooCommerce
