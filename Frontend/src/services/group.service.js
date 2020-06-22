import {getMethod, postMethod, putMethod, deleteMethod} from './service.util';

export const groupService = {
  createGroup: data => {
    let endPoint = 'group/create/';
    return postMethod(endPoint, data);
  },

  deleteGroup: data => {
    let endPoint = 'group/' + `${data.id}` + '/delete';
    return deleteMethod(endPoint, data);
  },

  getGroup: data => {
    let endPoint = 'group/' + `${data.id}/`;
    return getMethod(endPoint);
  },

  getGroups: () => {
    let endPoint = 'groups/';
    return getMethod(endPoint);
  },

  inviteMember: data => {
    let endPoint = 'group/' + `${data.id}` + '/invite/';
    return postMethod(endPoint, data);
  },

  acceptInvite: data => {
    let endPoint = 'group/' + `${data.id}` + '/invite/' + 'accept/';
    return postMethod(endPoint, data);
  },

  rejectInvite: data => {
    let endPoint = 'group/' + `${data.id}` + '/invite/' + 'reject/';
    return postMethod(endPoint, data);
  },

  removeMember: data => {
    data.operation = 'removeMember';
    let endPoint = 'group/' + `${data.id}` + '/edit/';
    return putMethod(endPoint, data);
  },

  createPlaylist: data => {
    let endpoint = 'group/' + 'playlist/create';
    return postMethod(endpoint, data);
  },
};
