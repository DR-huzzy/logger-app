import axios from 'axios';


 
// Custom axios instance with base URL and cookie support
const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true, // allows axios to send and receive cookies
})


export default api;