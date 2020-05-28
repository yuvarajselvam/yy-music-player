import AsyncStorage from '@react-native-community/async-storage';

export const getLocalStore = async () => {
  let data = await AsyncStorage.getItem('localStore');
  let dataObj = JSON.parse(data);
  return dataObj;
};

export const setLocalStore = async obj => {
  await AsyncStorage.setItem('localStore', JSON.stringify(obj));
};

export const removeLocalStore = async obj => {
  await AsyncStorage.clear();
};
