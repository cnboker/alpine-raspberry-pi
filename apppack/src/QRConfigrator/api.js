import axios from "axios";
import { uuidv4 } from "../lib/util";
const qs = require("querystring");

export const requestQR = () => {
  var url = `${process.env.REACT_APP_AUTH_URL}/api/authSession`;
  var sessionId = uuidv4().replace(/-/g, "");
  return axios({
    url,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({ sessionId }),
  });
};

export const requestToken = (sessionId) => {
  var url = `${process.env.REACT_APP_AUTH_URL}/api/crossToken/${sessionId}`;
  return axios({ url, method: "get" });
};

export const postDeviceInfo = (token, authorizeCode) => {
  var url = `${process.env.REACT_APP_LOCAL_PROXY_URL}/api/postDeviceInfo`;
  return axios({
    url,
    method: "post",
    data: { authorizeCode, token },
  });
};

export const postConfigInfo = (info) => {
  var url = `${process.env.REACT_APP_LOCAL_PROXY_URL}/api/postConfigInfo`;
  return axios({
    url,
    method: "post",
    data: info,
  });
};

//key:deviceId
export const requestConfig = (token) => {
  var url = `${process.env.REACT_APP_MEMBER_URL}/api/requestConfig`;
  return axios({
    url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const requestInstance = (token) => {
  var url = `${process.env.REACT_APP_MEMBER_URL}/api/instance`;
  return axios({
    url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
