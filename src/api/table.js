import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/getUserList',
    method: 'post',
    params
  })
}
