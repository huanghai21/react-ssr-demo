// import axios from 'axios';

// const API_USERS = 'https://react-ssr-api.herokuapp.com/users';
// const API_USERS_XSS = 'https://react-ssr-api.herokuapp.com/users/xss';
const API_USERS = '/users';
export const FETCH_USERS = 'fetch_users';
export const fetchUsers = () => {
  // `axiosInstance` came from src\client\client.js 
  return async (dispatch, getState, axiosInstance) => {
    const res = await axiosInstance.get(API_USERS);

    return dispatch({
      type: FETCH_USERS,
      payload: res
    });
  };
};

export const FETCH_CURRENT_USER = 'fetch_current_user';
export const fetchCurrentUser = () => async (dispatch, getState, api) => {
  const res = await api.get('/current_user');

  return dispatch({
    type: FETCH_CURRENT_USER,
    payload: res
  });
};

