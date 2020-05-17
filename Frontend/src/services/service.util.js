import {getLocalStore} from '../utils/funtions';

const URL_LINK = 'http://192.168.0.4:5000/';

export const getMethod = async endPoint => {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  return fetch(URL_LINK + endPoint, {
    method: 'GET',
    headers: {
      Authorization: bearer,
    },
  });
};

export const postMethod = async (endPoint, data) => {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  return fetch(URL_LINK + endPoint, {
    method: 'POST',
    headers: {
      Authorization: bearer,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const putMethod = async (endPoint, data) => {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  return fetch(URL_LINK + endPoint, {
    method: 'PUT',
    headers: {
      Authorization: bearer,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteMethod = async (endPoint, data) => {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  return fetch(URL_LINK + endPoint, {
    method: 'DELETE',
    headers: {
      Authorization: bearer,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getUserId = async () => {
  let localObj = await getLocalStore();
  return localObj.userId;
};
