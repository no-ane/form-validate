# validate-form-p 🎉🎉📄

English | [简体中文](./README-zh_CN.md)

## validator

[![NPM](https://nodei.co/npm/validate-form-p.png)](https://nodei.co/npm/validate-form-p/)

In a lot of the front-end logic, we'll get into the form validation part of the logic.

Abstracted out, can let us reduce workload greatly

## Usage

SAMPLE DEMO

```js
import validator from 'validate-form-p'

const rules = [
  ['name', 'require', 'The name has to exist']
]

const data = {
  name: 'leo'
}

validator.setData(data).validate(rules) // ture
```

```js
import validator from 'validate-form-p'

const rules = [
  ['name', 'require', 'The name has to exist']
]

const rules1 = [
  ['name', 'require', 'The name has to exist', 1] // 1: You have to check whether the name field is in the data or not
]

const data = {
  phone: ''
}

validator.setData(data).validate(rules) // ture
validator.setData(data).validate(rules1) // false
console.log(validator.getError()) // { name: The name has to exist }
// maybe you want to do : 
// Toast.info(Object.values(validateFrom.getError()).join('，'))
```

```js
import validator from 'validate-form-p'
// Define rules

const rules = [
  ['email', 'email', 'Email must be filled in', 1],
  ['email', 'email', 'Email must be in email format', 1],
  ['contact', 'url', 'Contact required', 1],
  ['isNumber', 'number', 'It has to be a number', 1],
  ['reuqireButIs2', 'require', 'Contact required', 2],
  ['password', 'repassword', 'The passwords do not match', 1, 'confirm'],
  ['reg', '', 'The regex tests are inconsistent', 1, /aava/],
  ['in', [1,2,4,5,6], 'Not in the second data range', 1, 'in'],
  ['notIn', [1,2,4,5,6], 'In the second data range', 1, 'notIn'],
  ['phone', 'require', 'The phone number must exist', 1],
  ['phone', '11', 'The mobile phone number must be 11 digits', 1, 'length'], // If the above condition does not satisfy the error condition here it will not be triggered
  ['phone', 'phone', 'Wrong mobile phone number'], // Verify phone number accuracy but only in mainland China
  ['equal', 11, 'Not equal', 1, 'equal'],
  ['notEqual', 12, 'euqal', 1, 'notEqual'],
  ['between', '1,22', 'wrong', 1, 'between'],
  ['expire', '2017-12-22,2018-4-2', 'Expire is not in the lawful domain', 1, 'expire'],
  ['expireTs', '1557986437547,1557999437000', 'ExpireTs is not in the lawful domain', 1, 'expire'],
  ['ipAllow', '127.0.0.1', 'IP is not allowed to pass', 1, 'ipAllow'],
  ['ipDeny', '127.0.0.2', 'IP is not allowed to pass', 1, 'ipDeny'],
  ['func', 'func val', 'deny', 1, (data, val) => {
    console.log(data) // whatever
    console.log(val) // func val
    return val === data
  }],
]

// Set the data to be validated
// Then verify that it returns true or false
const result = validator.setData(formData).validate(rules)
// If true, the form can be submitted directly
console.log(result)
// If false is returned, an error message can be obtained by getError()
console.log(validator.getError())
```

### Rules

Validation fields, validation rules, error messages,[validation conditions, additional rules]


### validation conditions (options)
|Value | trigger condition|
|---|----|
|0|Validate if a field exists (default)|
|1|Must be validated|
|2|Verify when the value is not empty|


### additional rules (options)
|rules|explain|
|----|----|
|regex|Regular validation. The validation rule defined is a regular expression (default)|
|function|Function validation. The validation rule defined is a function name|
|confirm|To verify that two fields in a form are the same, the validation rule defined is a field name|
|equal|Verifies that it is equal to a value defined by the previous validation rule|
|notEqual|Verifies that does not equal a value defined by the previous validation rule|
|in|To verify that a range is defined, the validation rule can be an array or a comma-separated string|
|notIn|To verify that the validation rule is not in a range, the defined validation rule can be an array or a comma-separated string|
|length|Validation length. The defined validation rules can be a number (representing a fixed length) or a number range (for example, 3,12, representing a length range from 3 to 12)|


## Try

codesanbox.io : https://codesandbox.io/embed/sleepy-pond-pkiti?fontsize=14

## License
MIT

## Postscript
```js
import you, { star } from 'you'
import me, { thank } from 'me'

star(me) && thank(you)
```
