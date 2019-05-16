# 表单验证

在前端许多逻辑中，我们都会出现到表单验证这一部分逻辑。

抽象出来，即可让我们极大的减少工作量

### rules

验证字段,验证规则,错误提示,[验证条件,附加规则]


### 验证规则

require 字段必须、email 邮箱、url URL地址、number 数字


### 验证条件 （可选）
|值|触发条件|
|---|----|
|0|存在字段就验证（默认）|
|1|必须验证|
|2|值不为空的时候验证|


### 附加规则
|规则|说明|
|----|----|
|regex|正则验证，定义的验证规则是一个正则表达式（默认）|
|function|函数验证，定义的验证规则是一个函数名|
|confirm|验证表单中的两个字段是否相同，定义的验证规则是一个字段名|
|equal|验证是否等于某个值，该值由前面的验证规则定义|
|notequal|验证是否不等于某个值，该值由前面的验证规则定义|
|in|验证是否在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串|
|notIn|验证是否不在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串|
|length|验证长度，定义的验证规则可以是一个数字（表示固定长度）或者数字范围（例如3,12 表示长度从3到12的范围）|



## Usage

```js
import validateForm from 'validate-form-p'
// 定义 rules 规则


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

// 设置需要验证的数据
// 然后进行验证 返回 true or false
const result = validateForm.setData(formData).validate(rules)
// 如果返回为 true 即可直接提交表单
console.log(result)
// 如果返回 false 即可通过 getError() 得到错误信息
console.log(validateForm.getError())
```

## 体验

codesanbox.io : https://codesandbox.io/embed/l5jwkv5w17?fontsize=14

## TODO

附加条件中的

- [ ] between
- [ ] notbetween
- [ ] expire
- [ ] ip_allow
- [ ] ip_deny


## 开源协议
MIT，免费拿去用

## 结语
```js
import you, { star } from 'you'
import me, { thank } from 'me'

star(me) && thank(you)
```
