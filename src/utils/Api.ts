// Api.js
import axios from "axios";
import qs from "Qs";
import { apiDomain } from "./const";
// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  baseURL: `${apiDomain}/`,
  // withCredentials: true,
  // headers:{"m2np-token": "TEST"}
});

// implement a method to execute all the request from here.
const apiRequest = (method, url, params, data) => {
  const headers = {
    "m2np-token": localStorage.getItem("M2NP_TOKEN"),
  };
  //using the axios instance to perform the request that received from each http method
  return axiosAPI({
    method,
    url,
    data: data,
    headers: headers,
    params: params,
  })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

const get = (url, params) => apiRequest("get", url, params, null);
const deleteRequest = (url, request) =>
  apiRequest("delete", url, request, null);
const post = (url, request) => apiRequest("post", url, null, request);
const formPost = (url, request) => {
  return axiosAPI
    .post(url, qs.stringify(request))
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
const formPostFile = (url, formData, progressUpdateCallback) => {
  return axiosAPI
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "m2np-token": localStorage.getItem("M2NP_TOKEN"),
      },
      onUploadProgress: progressUpdateCallback,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
const put = (url, request) => apiRequest("put", url, null, request);
const patch = (url, request) => apiRequest("patch", url, null, request);

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
