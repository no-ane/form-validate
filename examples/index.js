const validateForm = require('../index').default

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
  phone: '',
  equal: 11,
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
  ['equal', 11, '结果不相等', 1, 'equal'],
  ['equal', 11, '结果相等', 1, 'notEqual'],
]

const result = validateForm.setData(formData).validate(rules)
console.log(result)
console.log(validateForm.getError())
