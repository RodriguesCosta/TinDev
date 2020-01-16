import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http://192.168.88.21:3333',
})

export default api
