import Cookies from 'js-cookie'
import axios from 'axios'

export const UsersService = {
  currentUserToken() {
    return Cookies.get('token')
  },

  login(userName, password) {
    return axios({
      url: '/login',
      method: 'post',
      data: { userName, password },
      responseType: 'json',
    })
  },

  verify(url) {
    return axios({
      url,
      method: 'get',
      responseType: 'json',
    })
  },

  register(user) {
    return axios({
      url: '/register',
      method: 'post',
      data: user,
      responseType: 'json',
    })
  },

  logout() {
    return axios({
      url: '/logout',
      method: 'post',
      headers: { Authorization: `Bearer ${this.currentUserToken()}` },
    })
  },

  checkAuth() {
    return axios({
      url: '/checkToken',
      method: 'get',
      headers: { Authorization: `Bearer ${this.currentUserToken()}` },
    })
  },

  getCurrentUser() {
    return axios({
      url: 'users/me',
      method: 'get',
      headers: { Authorization: `Bearer ${this.currentUserToken()}` },
    })
  },

  getUserByUserName(userName) {
    return axios({
      url: `/users/${userName}`,
      method: 'get',
      headers: { Authorization: `Bearer ${this.currentUserToken()}` },
    })
  },

  getUsers() {
    return axios({
      url: '/users',
      method: 'get',
      headers: { Authorization: `Bearer ${this.currentUserToken()}` },
      responseType: 'json',
    })
  },
}
