import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function checkUser(data) {
  return request({
    url: '/checkUser',
    method: 'post',
    data
  })
}
export function delUserById(data) {
  return request({
    url: '/delUserById',
    method: 'post',
    data
  })
}


export function getChartsInfo(data) {
  return request({
    url: '/getChartsInfo',
    method: 'get',
    data
  })
}
