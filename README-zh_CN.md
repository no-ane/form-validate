# validate-form-p

[English](./README.md) | 简体中文

## 表单验证 

[![NPM](https://nodei.co/npm/validate-form-p.png)](https://nodei.co/npm/validate-form-p/)

在前端许多逻辑中，我们都会出现到表单验证这一部分逻辑。

抽象出来，即可让我们极大的减少工作量

## Usage

SAMPLE DEMO

```js
import validator from 'validate-form-p'

const rules = [
  ['name', 'require', '名字必须存在']
]

const data = {
  name: 'leo'
}

validator.setData(data).validate(rules) // ture
```

```js
import validator from 'validate-form-p'

const rules = [
  ['name', 'require', '名字必须存在']
]

const rules1 = [
  ['name', 'require', '名字必须存在', 1] // 1: 必须不管data里有没有name字段都进行校验
]

const data = {
  phone: ''
}

validator.setData(data).validate(rules) // ture
validator.setData(data).validate(rules1) // false
console.log(validator.getError()) // { name: 名字必须存在 }
// maybe you want to do : 
// Toast.info(Object.values(validator.getError()).join('，'))
```

```js
import validator from 'validate-form-p'
// 定义 rules 规则

const formData = {
  name: "小明",
  number: "2"
};

const rules = [
  ["name", "require", "名字必须填写"],
  ["name", "小明", "我只能叫小明哦", "0", "equal"],
  [
    "number",
    "2",
    "值不能为2",
    0,
    (value, secondIndexValue) => {
      return value !== secondIndexValue;
    }
  ]
];
```

### Rules

验证字段,验证规则,错误提示,[验证条件,附加规则]


### 验证规则

require 字段必须、email 邮箱、url URL地址、number 数字、 phone 手机号码


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
|notEqual|验证是否不等于某个值，该值由前面的验证规则定义|
|in|验证是否在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串|
|notIn|验证是否不在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串|
|length|验证长度，定义的验证规则可以是一个数字（表示固定长度）或者数字范围（例如3,12 表示长度从3到12的范围）|


## 体验

codesanbox.io: https://codesandbox.io/embed/festive-field-k66vh

## 开源协议
MIT

## 结语
```js
import you, { star } from 'you'
import me, { thank } from 'me'

star(me) && thank(you)
```
