import axios from 'axios'

const api = axios.create({
    baseURL: 'https://blockbook-bitcoin.tronwallet.me/api/v2/utxo/'
})

export default api