import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "https://permisosturismo.herokuapp.com/",
    headers: { 'Content-Type': 'application/vnd.api+json' }
});

export default axiosClient;