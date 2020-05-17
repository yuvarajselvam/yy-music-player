import {getMethod, postMethod, getUserId} from './service.util';

export const userService = {
  getUser: data => {
    let endPoint = 'user/' + `${data.userId}/`;
    return getMethod(endPoint);
  },

  getUsers: data => {
    let endPoint = 'users/?' + 'searchKey=';
    return getMethod(endPoint);
  },

  followRequest: data => {
    let endPoint = 'follow-request/';
    return postMethod(endPoint, data);
  },

  acceptRequest: data => {
    let endPoint = 'follow-request/accept/';
    return postMethod(endPoint, data);
  },

  rejectRequest: data => {
    let endPoint = 'follow-request/reject/';
    return postMethod(endPoint, data);
  },

  getFollowers: async data => {
    let userId = await getUserId();
    let endPoint = 'user/' + userId + '/followers/';
    return getMethod(endPoint);
  },

  getFollowing: async data => {
    let userId = await getUserId();
    let endPoint = 'user/' + userId + '/following/';
    return getMethod(endPoint);
  },

  getPendingRequests: async data => {
    let userId = await getUserId();
    let endPoint = 'user/' + userId + '/pending-requests/';
    return getMethod(endPoint);
  },
};
