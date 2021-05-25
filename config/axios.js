import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "http://permisosturismo.herokuapp.com/",
    headers: { 'Content-Type': 'application/vnd.api+json' }
});

export default axiosClient;