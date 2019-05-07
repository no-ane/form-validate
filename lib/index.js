'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// rules
// [验证字段1,验证规则,错误提示,[验证条件,附加规则]],

// 验证规则
// require 字段必须、email 邮箱、url URL地址、number 数字

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
// notequal	  验证是否不等于某个值，该值由前面的验证规则定义
// in	        验证是否在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串
// notin	    验证是否不在某个范围内，定义的验证规则可以是一个数组或者逗号分割的字符串（3.1.2版本新增）
// length	    验证长度，定义的验证规则可以是一个数字（表示固定长度）或者数字范围（例如3,12 表示长度从3到12的范围）

// TODO:
// between	  验证范围，定义的验证规则表示范围，可以使用字符串或者数组，例如1,31或者array(1,31)
// notbetween	验证不在某个范围，定义的验证规则表示范围，可以使用字符串或者数组
// expire	    验证是否在有效期，定义的验证规则表示时间范围，可以到时间，例如可以使用 2012-1-15,2013-1-15 表示当前提交有效期在2012-1-15到2013-1-15之间，也可以使用时间戳定义
// ip_allow	  验证IP是否允许，定义的验证规则表示允许的IP地址列表，用逗号分隔，例如201.12.2.5,201.12.2.6
// ip_deny	  验证IP是否禁止，定义的验证规则表示禁止的ip地址列表，用逗号分隔，例如201.12.2.5,201.12.2.6

// 是否拥有该字段
var hasOwnProperty = function hasOwnProperty(obj, key) {
  return obj.hasOwnProperty(key);
};

// 判断不为空
var isNoNull = function isNoNull(val) {
  return val !== undefined && val !== null && val !== '';
};

exports.default = {
  data: {},
  error: {},
  // 设置数据
  setData: function setData(formData) {
    this.data = formData;
    return this;
  },

  // 验证规则
  validate: function validate(rules) {
    var _this = this;

    var result = true; // 返回结果 默认是通过
    rules.forEach(function (rule) {
      var _rule = _slicedToArray(rule, 3),
          fieldName = _rule[0],
          errorMessage = _rule[2];
      // 如果错误


      if (!_this._validateByRuleOne(rule)) {
        // 目前只用判断第一个..
        if (!_this.error[fieldName]) {
          _this.error[fieldName] = [errorMessage];
        }
        // else {
        //   this.error[fieldName].push(errorMessage)
        // }
        result = false;
      }
    });
    return result;
  },

  // 获取错误 返回Array
  getError: function getError() {
    var ret = {};
    Object.entries(this.error).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      ret[key] = value.join(',');
    });
    return ret;
  },

  // 验证单条规则
  _validateByRuleOne: function _validateByRuleOne() {
    var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    // 如果必要条件没有的话 就直接退出吧
    var _rule2 = _slicedToArray(rule, 3),
        fieldName = _rule2[0],
        customRule = _rule2[1],
        errorMessage = _rule2[2];

    if (!isNoNull(fieldName) || !isNoNull(customRule) || !isNoNull(errorMessage)) {
      return new Error('规则设置错误 必须要有 验证字段,验证规则,错误提示');
    }
    // 验证条件 先解决这个问题
    return this._validateByCondition(rule);
  },

  // 验证条件
  _validateByCondition: function _validateByCondition() {
    var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var _rule3 = _slicedToArray(rule, 4),
        fieldName = _rule3[0],
        _rule3$ = _rule3[3],
        condition = _rule3$ === undefined ? 0 : _rule3$;
    // 如果有字段，进行校验， 没有允许通过


    if (condition === 0) {
      if (hasOwnProperty(this.data, fieldName)) {
        return this._validateByCustomRuleOrOtherRule(rule);
      } else {
        return true;
      }
    }
    // 必须进行校验，没有字段证明为false
    if (condition === 1) {
      if (hasOwnProperty(this.data, fieldName)) {
        return this._validateByCustomRuleOrOtherRule(rule);
      } else {
        return false;
      }
    }
    // 值不为空的时候验证
    if (condition === 2) {
      if (hasOwnProperty(this.data, fieldName) && isNoNull(this.data[fieldName])) {
        return this._validateByCustomRuleOrOtherRule(rule);
      } else {
        return true;
      }
    }
  },

  // 检测验证条件
  _validateByCustomRuleOrOtherRule: function _validateByCustomRuleOrOtherRule(rule) {
    var _rule4 = _slicedToArray(rule, 5),
        otherRule = _rule4[4];

    if (otherRule) {
      return this._validateByOtherRule(rule);
    } else {
      return this._validateByCustomRule(rule);
    }
  },

  // 使用默认的条件 如require
  _validateByCustomRule: function _validateByCustomRule(rule) {
    var _rule5 = _slicedToArray(rule, 2),
        customRule = _rule5[1];

    switch (customRule) {
      case 'require':
        return this.handleCustomRuleByRequire(rule);
      case 'email':
        return this.handleCustomRuleByEmail(rule);
      case 'url':
        return this.handleCustomRuleByUrl(rule);
      case 'number':
        return this.handleCustomRuleByNumber(rule);
    }
  },

  // 使用自定义规则 如regex
  _validateByOtherRule: function _validateByOtherRule(rule) {
    var _rule6 = _slicedToArray(rule, 5),
        otherRule = _rule6[4];
    // 这里上层其实拦截了。 不过再做一层 增加健壮性


    if (!otherRule) return false;
    if (otherRule instanceof RegExp) {
      return this.handleOtherRuleByReg(rule);
    }
    if (typeof otherRule === 'function') {
      return this.handleOtherRuleByFunc(rule);
    }
    if (typeof otherRule === 'string') {
      switch (otherRule) {
        case 'equal':
          return this.handleOtherRuleByEqual(rule);
        case 'notEqual':
          return !this.handleOtherRuleByEqual(rule);
        case 'confirm':
          return this.handleOtherRuleByConfirm(rule);
        case 'in':
          return this.handleOtherRuleByIn(rule);
        case 'notIn':
          return !this.handleOtherRuleByIn(rule);
        case 'length':
          return this.handleOtherRuleByLength(rule);
      }
    }
  },

  // require 默认提供条件
  handleCustomRuleByRequire: function handleCustomRuleByRequire(rule) {
    var _rule7 = _slicedToArray(rule, 1),
        fieldName = _rule7[0];

    var ret = true;
    // 如果不存在就为false
    if (ret && !hasOwnProperty(this.data, fieldName)) {
      ret = false;
    }
    // 如果为null或者空或者undefined 就让它为false
    if (ret && !isNoNull(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // email 默认提供条件
  handleCustomRuleByEmail: function handleCustomRuleByEmail(rule) {
    var emailReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;

    var _rule8 = _slicedToArray(rule, 1),
        fieldName = _rule8[0];
    // 检验是否存在这个数据


    var ret = this.handleCustomRuleByRequire(rule);
    if (ret && !emailReg.test(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // url 默认提供条件
  handleCustomRuleByUrl: function handleCustomRuleByUrl(rule) {
    // TODO: 感觉这个正则不是特别好
    // http2://www.baidu.com 这种都能通过... 
    function isNoURL(str) {
      return !str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
    }

    var _rule9 = _slicedToArray(rule, 1),
        fieldName = _rule9[0];
    // 检验是否存在这个数据


    var ret = this.handleCustomRuleByRequire(rule);
    if (ret && isNoURL(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // number 默认提供条件
  handleCustomRuleByNumber: function handleCustomRuleByNumber(rule) {
    var _rule10 = _slicedToArray(rule, 1),
        fieldName = _rule10[0];
    // 检验是否存在这个数据


    var ret = this.handleCustomRuleByRequire(rule);
    if (ret && typeof this.data[fieldName] !== 'number') {
      ret = false;
    }
    return ret;
  },

  // reg 附加条件
  handleOtherRuleByReg: function handleOtherRuleByReg(rule) {
    var _rule11 = _slicedToArray(rule, 5),
        fieldName = _rule11[0],
        customRule = _rule11[1],
        errorMessage = _rule11[2],
        _rule11$ = _rule11[3],
        condition = _rule11$ === undefined ? 0 : _rule11$,
        otherRule = _rule11[4];
    // 检验是否存在这个数据


    var ret = this.handleCustomRuleByRequire(rule);
    if (ret && !otherRule.test(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // function 附加条件
  handleOtherRuleByFunc: function handleOtherRuleByFunc(rule) {
    var _rule12 = _slicedToArray(rule, 5),
        fieldName = _rule12[0],
        customRule = _rule12[1],
        errorMessage = _rule12[2],
        _rule12$ = _rule12[3],
        condition = _rule12$ === undefined ? 0 : _rule12$,
        otherRule = _rule12[4];
    // 检验是否存在这个数据


    var ret = this.handleCustomRuleByRequire(rule);
    if (ret && !otherRule(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // equal 附加条件
  handleOtherRuleByEqual: function handleOtherRuleByEqual(rule) {
    var _rule13 = _slicedToArray(rule, 5),
        fieldName1 = _rule13[0],
        val = _rule13[1],
        errorMessage = _rule13[2],
        _rule13$ = _rule13[3],
        condition = _rule13$ === undefined ? 0 : _rule13$,
        otherRule = _rule13[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(val);
    if (val1 && val2 && this.data[fieldName1] === val) {
      return true;
    }
    return false;
  },

  // confirm 附加条件
  handleOtherRuleByConfirm: function handleOtherRuleByConfirm(rule) {
    var _rule14 = _slicedToArray(rule, 5),
        fieldName1 = _rule14[0],
        fieldName2 = _rule14[1],
        errorMessage = _rule14[2],
        _rule14$ = _rule14[3],
        condition = _rule14$ === undefined ? 0 : _rule14$,
        otherRule = _rule14[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(this.data[fieldName2]);
    if (val1 && val2 && this.data[fieldName1] === this.data[fieldName2]) {
      return true;
    }
    return false;
  },

  // in 附加条件
  handleOtherRuleByIn: function handleOtherRuleByIn(rule) {
    var _rule15 = _slicedToArray(rule, 5),
        fieldName1 = _rule15[0],
        rangs = _rule15[1],
        errorMessage = _rule15[2],
        _rule15$ = _rule15[3],
        condition = _rule15$ === undefined ? 0 : _rule15$,
        otherRule = _rule15[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(rangs);
    if (val1 && val2 && rangs.includes(this.data[fieldName1])) {
      return true;
    }
    return false;
  },

  // length 附加条件
  handleOtherRuleByLength: function handleOtherRuleByLength(rule) {
    var _rule16 = _slicedToArray(rule, 5),
        fieldName1 = _rule16[0],
        len = _rule16[1],
        errorMessage = _rule16[2],
        _rule16$ = _rule16[3],
        condition = _rule16$ === undefined ? 0 : _rule16$,
        otherRule = _rule16[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    if (val1 && +len === String(this.data[fieldName1]).length) {
      return true;
    }
    return false;
  }
};
