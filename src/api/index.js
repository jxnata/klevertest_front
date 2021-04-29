import axios from 'axios'

const api = axios.create({
    baseURL: 'https://klever-test-jxnata.herokuapp.com'
})

export default api