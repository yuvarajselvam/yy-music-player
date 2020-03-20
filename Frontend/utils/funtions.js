import { AsyncStorage } from "react-native";

export const getLocalStore = async () => {
  let data = await AsyncStorage.getItem("localStore");
  let dataObj = JSON.parse(data);
  return dataObj;
};

export const setLocalStore = async obj => {
  await AsyncStorage.setItem("localStore", JSON.stringify(obj));
};
