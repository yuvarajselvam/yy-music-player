import {getLocalStore} from '../utils/funtions';
import {getUniqueId} from 'react-native-device-info';

const URL_LINK = 'http://34.72.197.44/';

export const getMethod = async endPoint => {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  return fetch(URL_LINK + endPoint, {
    method: 'GET',
    headers: {
      Authorization: bearer,
      Device: getUniqueId(),
    },
  });
};

export const postMethod = async (endPoint, data) => {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  return fetch(URL_LINK + endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
      Device: getUniqueId(),
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
      'Content-Type': 'application/json',
      Authorization: bearer,
      Device: getUniqueId(),
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
      'Content-Type': 'application/json',
      Authorization: bearer,
      Device: getUniqueId(),
    },
    body: JSON.stringify(data),
  });
};

export const getUserId = async () => {
  let localObj = await getLocalStore();
  return localObj.userId;
};
