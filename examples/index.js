const validator = require('../index').default

const formData = {
  email: '123123@12.com', // 判断
  contact: 'http2://www.baidu.com',
  isNumber: 2,
  reuqireButIs2: '',
  password: '123',
  repassword: '123',
  reg: 'aaaa',
  in: '2',
  notIn: '2',
  phone: '11122233344',
  equal: 11,
  notEqual: 11,
  between: 11,
  expire: '2018-4-1',
  expireTs: 1557989437547,
  ipAllow: '127.0.0.1',
  ipDeny: '127.0.0.1',
  func: 'whatever',
}

const rules = [
  ['email', 'email', 'email必须填写', 1],
  ['email', 'email', 'email必须是email格式', 1],
  ['contact', 'url', 'contact必填', 1],
  ['isNumber', 'number', '必须是数字', 1],
  ['reuqireButIs2', 'require', 'contact必填', 2],
  ['password', 'repassword', '两次密码不一致', 1, 'confirm'],
  ['reg', '', '正则测试不一致', 1, /aava/],
  ['in', [1,2,4,5,6], '不在第二个数据范围中', 1, 'in'],
  ['notIn', [1,2,4,5,6], '在第二个数据范围中', 1, 'notIn'],
  ['phone', 'require', '手机号码必须是存在', 1],
  ['phone', '11', '手机号码必须是11位', 1, 'length'], // 如果上面的条件不满足 这里的错误条件不会促发
  ['phone', 'phone', '手机号码错误'], // 验证手机号码准确性
  ['equal', 11, '结果不相等', 1, 'equal'],
  ['notEqual', 12, '结果相等', 1, 'notEqual'],
  ['between', '1,22', '不在合法范围内', 1, 'between'],
  ['expire', '2017-12-22,2018-4-2', 'expire不在合法范围内', 1, 'expire'],
  ['expireTs', '1557986437547,1557999437000', 'expireTs不在合法范围内', 1, 'expire'],
  ['ipAllow', '127.0.0.1', 'ip不允许通过', 1, 'ipAllow'],
  ['ipDeny', '127.0.0.2', 'ip不允许通过', 1, 'ipDeny'],
  ['func', 'func val', 'deny', 1, (data, val) => {
    console.log(data) // whatever
    console.log(val) // func val
    return val === data
  }],
]

const result = validator.setData(formData).validate(rules)
console.log(result)
console.log(validator.getError())
