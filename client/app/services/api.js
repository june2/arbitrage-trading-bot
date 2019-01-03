import Config from '../constants/config';
import axios from 'axios';

const domain = `http://${Config.apiUrl}:3001/api/`;
const api = (entity) => {
  return {
    get: async (resource, params) => {
      try {
        if (!params) params = '';
        else '?' + params;
        let res = await axios.get(`${domain + entity + resource}${params}`);
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    create: async (resource, params) => {
      try {
        return await axios.post(`${domain + entity + resource}`)
      } catch (err) {
        throw err;
      }
    },
    update: async (resource, params) => {
      try {
        return await axios.put(`${domain + entity + resource}`, params)
      } catch (err) {
        throw err;
      }
    },
    delete: async (resource, params) => {
      try {
        return await axios.delete(`${domain + entity + resource}`)
      } catch (err) {
        throw err;
      }
    },
  }
}

export default api;