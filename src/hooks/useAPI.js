import { useCookies } from 'react-cookie';
import axios from 'axios';

function useAPI() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const accessToken = cookies.access_token;
  const API = axios.create({
    baseURL: 'https://api-stg.piction.network/',
    headers: {
      'X-Auth-Token': accessToken,
      accept: 'application/vnd.piction.v1+json',
    },
  });
  const patchConfig = {
    headers: { 'Content-Type': 'multipart/form-data' },
  };

  const my = {
    wallet: () => API.get('my/wallet'),
    projects: () => API.get('my/projects'),
    subscriptions: () => API.get('my/subscriptions'),
  };

  const post = projectId => ({
    getAll: params => API.get(`/projects/${projectId}/posts`, params),
    create: params => API.post(`/projects/${projectId}/posts`, params),
    get: params => API.get(`/projects/${projectId}/posts/${params.postId}`),
    getContent: params => API.get(`/projects/${projectId}/posts/${params.postId}/content`),
    getIsLike: params => API.get(`/projects/${projectId}/posts/${params.postId}/isLike`),
    update: params => API.put(`/projects/${projectId}/posts/${params.postId}`, params),
    like: params => API.post(`/projects/${projectId}/posts/${params.postId}/like`),
    uploadContentImage: params => API.patch(`/projects/${projectId}/posts/content`, params, patchConfig),
    uploadCoverImage: params => API.patch(`/projects/${projectId}/posts/cover`, params, patchConfig),
  });

  const project = {
    create: params => API.post('/projects', params),
    get: params => API.get(`/projects/${params.projectId}`),
    update: params => API.put(`/projects/${params.projectId}`, params),
    subscribe: params => API.post(`/projects/${params.projectId}/subscription`, params),
    getSubscription: params => API.get(`/projects/${params.projectId}/subscription`),
    uploadThumbnail: params => API.patch('/projects/thumbnail', params, patchConfig),
    uploadWideThumbnail: params => API.patch('/projects/wide-thumbnail', params, patchConfig),
  };

  const recommended = {
    getProjects: params => API.get('/recommended/projects', params),
  };

  const series = projectId => ({
    getAll: () => API.get(`/projects/${projectId}/series`),
  });

  const session = {
    create: params => API.post('/sessions', params),
    delete: () => API.delete('/sessions'),
  };

  const user = {
    me: () => API.get('/users/me'),
    create: params => API.post('/users', params),
    update: params => API.put('/users/me', params),
    updatePassword: params => API.patch('/users/me/password', params),
    uploadPicture: params => API.patch('/users/me/picture', params, patchConfig),
  };

  const token = {
    get: () => accessToken,
    create: (value, params) => setCookie('access_token', value, { ...params, path: '/' }),
    delete: () => removeCookie('access_token'),
  };

  return [{
    my,
    post,
    project,
    recommended,
    series,
    session,
    user,
    token,
  }];
}

export default useAPI;
