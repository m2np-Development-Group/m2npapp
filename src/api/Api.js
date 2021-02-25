// Api.js
import axios from "axios";
import qs from 'Qs'

// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  baseURL: "https://m2np.com/ajax",
  withCredentials: true,
  headers: {
    //xabby: "heyhey"
  },
});

// implement a method to execute all the request from here.
const apiRequest = (method, url, request) => {
  const headers = {
    authorization: "",
  };
  //using the axios instance to perform the request that received from each http method
  return axiosAPI({
    method,
    url,
    data: request,
    headers,
  })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

const get = (url, request) => apiRequest("get", url, request);
const deleteRequest = (url, request) => apiRequest("delete", url, request);
const post = (url, request) => apiRequest("post", url, request);
const formPost = (url, request) => {
  return axiosAPI.post(url, qs.stringify(request))
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
const formPostFile = (url, formData) => {
  return axiosAPI.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
const put = (url, request) => apiRequest("put", url, request);
const patch = (url, request) => apiRequest("patch", url, request);

const API = {
  get,
  delete: deleteRequest,
  post,
  formPost,
  formPostFile,
  put,
  patch,
};
export default API;
