interface Validator {
  setData(formData:object):Validator,
  validate(rules: Array<Array<string>>):boolean,
  getError():object
}

declare function setData(formData:object):Validator
declare function validate(rules: Array<Array<string>>):boolean
declare function getError():object

export { setData, validate, getError }
