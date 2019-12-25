// rules
// [验证字段1,验证规则,错误提示,[验证条件,附加规则]],

// 验证规则
// require 字段必须、email 邮箱、url URL地址、number 数字、手机号码 phone

// 验证条件 （可选）
// 包含下面几种情况：
//  0 存在字段就验证（默认）
//  1 必须验证
//  2 值不为空的时候验证

// 附加规则
// 规则	说明
// regex	    正则验证，定义的验证规则是一个正则表达式（默认）
// function	  函数验证，定义的验证规则是一个函数名
// confirm	  验证表单中的两个字段是否相同，定义的验证规则是一个字段名

// equal     	验证是否等于某个值，该值由前面的验证规则定义
// notEqual	  验证是否不等于某个值，该值由前面的验证规则定义
// in	        验证是否在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串
// notIn	    验证是否不在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串（3.1.2版本新增）
// length	    验证长度，定义的验证规则可以是一个数字（表示固定长度）或者数字范围（例如3,12 表示长度从3到12的范围）

// between	  验证范围，定义的验证规则表示范围，可以使用字符串或者数组，例如1,31或者array(1,31)
// notBetween	验证不在某个范围，定义的验证规则表示范围，可以使用字符串或者数组
// expire	    验证是否在有效期，定义的验证规则表示时间范围，可以到时间，例如可以使用 2012-1-15,2013-1-15 表示当前提交有效期在2012-1-15到2013-1-15之间，也可以使用时间戳定义
// ipAllow	  验证IP是否允许，定义的验证规则表示允许的IP地址列表，用逗号分隔，例如201.12.2.5,201.12.2.6
// ipDeny	  验证IP是否禁止，定义的验证规则表示禁止的ip地址列表，用逗号分隔，例如201.12.2.5,201.12.2.6

// 是否拥有该字段
const hasOwnProperty = (obj, key) => obj.hasOwnProperty(key)

// 判断不为空
const isNoNull = (val) => val !== undefined && val !== null && val !== ''

// 验证类型
const customRules = ['require','email','url','number','phone']

// 其他自定义类型
const otherRules = ['equal','notEqual','confirm','in','notIn','length','between','notBetween','expire','ipAllow','ipDeny']

export default {
  data: {},
  error: {},
  // 设置数据
  setData(formData) {
    if (typeof formData !== 'object') {
      return new Error('data must be object')
    }
    this.data = Object.assign({}, formData)
    this.error = {} // reset error
    return this
  },
  // 验证规则
  validate(rules) {
    let result = true // 返回结果 默认是通过
    rules.forEach(rule => {
      const [fieldName,, errorMessage] = rule
      // 如果错误
      if (!this._validateByRuleOne(rule)) {
        // 目前只用判断第一个..
        if (!this.error[fieldName]) {
          this.error[fieldName] = [errorMessage]
        }
        // else {
        //   this.error[fieldName].push(errorMessage)
        // }
        result = false
      }
    })
    return result
  },
  // 获取错误 返回Array
  getError() {
    let ret = {}
    Object.entries(this.error).map(([key, value]) => {
      ret[key] = value.join(',')
    })
    return ret
  },
  // 验证单条规则
  _validateByRuleOne(rule = []) {
    // 如果必要条件没有的话 就直接退出吧
    let [fieldName, customRule, errorMessage, type, otherRule] = rule
    if (!otherRule && !customRules.includes(customRule)) {
      throw Error(`The rule is wrong. Your rules must be one of ${customRules.map(v => v)} if you don't use additional rules`)
    }
    if (!isNoNull(fieldName) || !isNoNull(errorMessage)) {
      throw Error('The rule is wrong. It must have fileName, validate rules, error message')
    }
    // 验证条件 先解决这个问题
    return this._validateByCondition(rule)
  },
  // 验证条件
  _validateByCondition(rule = []) {
    let [fieldName,,, condition = 0] = rule
    // 转译成数字
    condition = Number(condition) || 0
    // 如果有字段，进行校验， 没有允许通过
    if (condition === 0) {
      if (hasOwnProperty(this.data, fieldName)) {
        return this._validateByCustomRuleOrOtherRule(rule)
      } else {
        return true
      }
    }
    // 必须进行校验，没有字段证明为false
    if (condition === 1) {
      if (hasOwnProperty(this.data, fieldName)) {
        return this._validateByCustomRuleOrOtherRule(rule)
      } else {
        return false
      }
    }
    // 值不为空的时候验证
    if (condition === 2) {
      if (hasOwnProperty(this.data, fieldName) && isNoNull(this.data[fieldName])) {
        return this._validateByCustomRuleOrOtherRule(rule)
      } else {
        return true
      }
    }
  },
  // 检测验证条件
  _validateByCustomRuleOrOtherRule(rule) {
    let [,,,, otherRule] = rule
    if (otherRule) {
      return this._validateByOtherRule(rule)
    } else {
      return this._validateByCustomRule(rule)
    }
  },
  // 使用默认的条件 如require
  _validateByCustomRule(rule) {
    let [, customRule] = rule
    const [_require, email, url, number, phone] = customRules
    switch (customRule) {
      case _require:
        return this._handleCustomRuleByRequire(rule)
      case email:
        return this._handleCustomRuleByEmail(rule)
      case url:
        return this._handleCustomRuleByUrl(rule)
      case number:
        return this._handleCustomRuleByNumber(rule)
      case phone:
        return this._handleCustomRuleByPhone(rule)
    }
  },
  // 使用自定义规则 如regex
  _validateByOtherRule(rule) {
    let [,,,, otherRule] = rule
    // 这里上层其实拦截了。 不过再做一层 增加健壮性
    if (!otherRule) return false
    if (otherRule instanceof RegExp) {
      return this._handleOtherRuleByReg(rule)
    }
    if (typeof otherRule === 'function') {
      return this._handleOtherRuleByFunc(rule)
    }
    if (typeof otherRule === 'string') {
      const [equal, notEqual, confirm, _in, notIn, length, between, notBetween, expire, ipAllow, ipDeny] = otherRules;
      switch (otherRule) {
        case equal:
          return this._handleOtherRuleByEqual(rule)
        case notEqual:
          return !this._handleOtherRuleByEqual(rule)
        case confirm:
          return this._handleOtherRuleByConfirm(rule)
        case _in:
          return this._handleOtherRuleByIn(rule)
        case notIn:
          return !this._handleOtherRuleByIn(rule)
        case length:
          return this._handleOtherRuleByLength(rule)
        case between:
          return this._handleOtherRuleByBetween(rule)
        case notBetween:
          return !this._handleOtherRuleByBetween(rule)
        case expire:
          return this._handleOtherRuleByExpire(rule)
        case ipAllow:
          return this._handleOtherRuleByIpAllow(rule)
        case ipDeny:
          return !this._handleOtherRuleByIpAllow(rule)
      }
    }
  },
  // require 默认提供条件
  _handleCustomRuleByRequire(rule) {
    let [fieldName] = rule
    let ret = true
    // 如果不存在就为false
    if (ret && !hasOwnProperty(this.data, fieldName)) {
      ret = false
    }
    // 如果为null或者空或者undefined 就让它为false
    if (ret && !isNoNull(this.data[fieldName])) {
      ret = false
    }
    return ret
  },
  // phone 默认提供条件
  _handleCustomRuleByPhone(rule) {
    let [fieldName] = rule
    // 如果不存在就为false
    if (!hasOwnProperty(this.data, fieldName)) {
      return false
    }
    return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.data[fieldName])
  },
  // email 默认提供条件
  _handleCustomRuleByEmail(rule) {
    var emailReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/
    let [fieldName] = rule
    // 检验是否存在这个数据
    let ret = this._handleCustomRuleByRequire(rule)
    if (ret && !emailReg.test(this.data[fieldName])) {
      ret = false
    }
    return ret
  },
  // url 默认提供条件
  _handleCustomRuleByUrl(rule) {
    // TODO: 感觉这个正则不是特别好
    // http2://www.baidu.com 这种都能通过... 
    function isNoURL (str) {
      return !str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g)
    }
    let [fieldName] = rule
    // 检验是否存在这个数据
    let ret = this._handleCustomRuleByRequire(rule)
    if (ret && isNoURL(this.data[fieldName])) {
      ret = false
    }
    return ret
  },
  // number 默认提供条件
  _handleCustomRuleByNumber(rule) {
    let [fieldName] = rule
    // 检验是否存在这个数据
    let ret = this._handleCustomRuleByRequire(rule)
    if (ret && (typeof (this.data[fieldName]) !== 'number')) {
      ret = false
    }
    return ret
  },
  // reg 附加条件
  _handleOtherRuleByReg(rule) {
    let [fieldName, customRule, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    let ret = this._handleCustomRuleByRequire(rule)
    if (ret && !otherRule.test(this.data[fieldName])) {
      ret = false
    }
    return ret
  },
  // function 附加条件
  _handleOtherRuleByFunc(rule) {
    let [fieldName, value, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    let ret = this._handleCustomRuleByRequire(rule)
    if (ret && !otherRule(this.data[fieldName], value)) {
      ret = false
    }
    return ret
  },
  // equal 附加条件
  _handleOtherRuleByEqual(rule) {
    let [fieldName1, val, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    const val1 = isNoNull(this.data[fieldName1])
    const val2 = isNoNull(val)
    if (val1 && val2 && this.data[fieldName1] === val) {
      return true
    }
    return false
  },
  // confirm 附加条件
  _handleOtherRuleByConfirm(rule) {
    let [fieldName1, fieldName2, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    const val1 = isNoNull(this.data[fieldName1])
    const val2 = isNoNull(this.data[fieldName2])
    if (val1 && val2 && this.data[fieldName1] === this.data[fieldName2]) {
      return true
    }
    return false
  },
  // in 附加条件
  _handleOtherRuleByIn(rule) {
    let [fieldName1, rangs, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    const val1 = isNoNull(this.data[fieldName1])
    const val2 = isNoNull(rangs)
    if (val1 && val2 && rangs.includes(this.data[fieldName1])) {
      return true
    }
    return false
  },
  // length 附加条件
  _handleOtherRuleByLength(rule) {
    let [fieldName1, len, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    const val1 = isNoNull(this.data[fieldName1])
    if (val1 && +len === String(this.data[fieldName1]).length) {
      return true
    }
    return false
  },
  // between 附加条件
  _handleOtherRuleByBetween(rule) {
    let [fieldName1, val, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    const val1 = isNoNull(this.data[fieldName1])
    const val2 = isNoNull(val)
    if (val1 && val2) {
      const [start, end] = val.split(',')
      if (val1 >= start && val1 <= end) {
        return true
      }
    }
    return false
  },
  // expire 附加条件
  _handleOtherRuleByExpire(rule) {
    let [fieldName1, val, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    let val1 = isNoNull(this.data[fieldName1])
    let val2 = isNoNull(val)
    if (val1 && val2) {
      val1 = String(val1)
      // 如果是 2018-5-11 格式
      if (val.includes('-') || val.includes('/')) {
        val1 = this.data[fieldName1].replace(/\-/g, '/')
        val = val.replace(/\-/g, '/')
        let [startTime, endTime] = val.split(',')
        startTime = (+new Date(startTime))
        endTime = (+new Date(endTime))
        val1 = (+new Date(val1))
        if (isNaN(startTime) || isNaN(endTime)) {
          console.error(`\r\nPlease check ${fieldName1} conditions, maybe the date is wrong 📅 \r\n`)
          return false
        }
        if (val1 >= startTime && val1 <= endTime) {
          return true
        }
      } else {
        // 时间戳格式 规定如果是时间戳全部都得是时间戳
        const [startTime, endTime] = val.split(',')
        const v = this.data[fieldName1]
        if (v >= startTime && v <= endTime) {
          return true
        }
      }
    }
    return false
  },
  // ipAllow 附加条件
  _handleOtherRuleByIpAllow(rule) {
    let [fieldName1, val, errorMessage, condition = 0, otherRule] = rule
    // 检验是否存在这个数据
    let val1 = isNoNull(this.data[fieldName1])
    let val2 = isNoNull(val)
    if (val1 && val2) {
      const ips = val.split(',')
      if (ips.includes(this.data[fieldName1])) {
        return true
      }
    }
    return false
  }
}
