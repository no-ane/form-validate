'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
var hasOwnProperty = function hasOwnProperty(obj, key) {
  return obj.hasOwnProperty(key);
};

// 判断不为空
var isNoNull = function isNoNull(val) {
  return val !== undefined && val !== null && val !== '';
};

// 验证类型
var customRules = ['require', 'email', 'url', 'number', 'phone'];

// 其他自定义类型
var otherRules = ['equal', 'notEqual', 'confirm', 'in', 'notIn', 'length', 'between', 'notBetween', 'expire', 'ipAllow', 'ipDeny'];

exports.default = {
  data: {},
  error: {},
  // 设置数据
  setData: function setData(formData) {
    if ((typeof formData === 'undefined' ? 'undefined' : _typeof(formData)) !== 'object') {
      return new Error('data must be object');
    }
    this.data = Object.assign({}, formData);
    this.error = {}; // reset error
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
    var _rule2 = _slicedToArray(rule, 5),
        fieldName = _rule2[0],
        customRule = _rule2[1],
        errorMessage = _rule2[2],
        type = _rule2[3],
        otherRule = _rule2[4];

    if (!otherRule && !customRules.includes(customRule)) {
      throw Error('The rule is wrong. Your rules must be one of ' + customRules.map(function (v) {
        return v;
      }) + ' if you don\'t use additional rules');
    }
    if (!isNoNull(fieldName) || !isNoNull(errorMessage)) {
      throw Error('The rule is wrong. It must have fileName, validate rules, error message');
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
    // 转译成数字


    condition = Number(condition) || 0;
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

    var _require = customRules[0],
        email = customRules[1],
        url = customRules[2],
        number = customRules[3],
        phone = customRules[4];

    switch (customRule) {
      case _require:
        return this._handleCustomRuleByRequire(rule);
      case email:
        return this._handleCustomRuleByEmail(rule);
      case url:
        return this._handleCustomRuleByUrl(rule);
      case number:
        return this._handleCustomRuleByNumber(rule);
      case phone:
        return this._handleCustomRuleByPhone(rule);
    }
  },

  // 使用自定义规则 如regex
  _validateByOtherRule: function _validateByOtherRule(rule) {
    var _rule6 = _slicedToArray(rule, 5),
        otherRule = _rule6[4];
    // 这里上层其实拦截了。 不过再做一层 增加健壮性


    if (!otherRule) return false;
    if (otherRule instanceof RegExp) {
      return this._handleOtherRuleByReg(rule);
    }
    if (typeof otherRule === 'function') {
      return this._handleOtherRuleByFunc(rule);
    }
    if (typeof otherRule === 'string') {
      var equal = otherRules[0],
          notEqual = otherRules[1],
          confirm = otherRules[2],
          _in = otherRules[3],
          notIn = otherRules[4],
          length = otherRules[5],
          between = otherRules[6],
          notBetween = otherRules[7],
          expire = otherRules[8],
          ipAllow = otherRules[9],
          ipDeny = otherRules[10];

      switch (otherRule) {
        case equal:
          return this._handleOtherRuleByEqual(rule);
        case notEqual:
          return !this._handleOtherRuleByEqual(rule);
        case confirm:
          return this._handleOtherRuleByConfirm(rule);
        case _in:
          return this._handleOtherRuleByIn(rule);
        case notIn:
          return !this._handleOtherRuleByIn(rule);
        case length:
          return this._handleOtherRuleByLength(rule);
        case between:
          return this._handleOtherRuleByBetween(rule);
        case notBetween:
          return !this._handleOtherRuleByBetween(rule);
        case expire:
          return this._handleOtherRuleByExpire(rule);
        case ipAllow:
          return this._handleOtherRuleByIpAllow(rule);
        case ipDeny:
          return !this._handleOtherRuleByIpAllow(rule);
      }
    }
  },

  // require 默认提供条件
  _handleCustomRuleByRequire: function _handleCustomRuleByRequire(rule) {
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

  // phone 默认提供条件
  _handleCustomRuleByPhone: function _handleCustomRuleByPhone(rule) {
    var _rule8 = _slicedToArray(rule, 1),
        fieldName = _rule8[0];
    // 如果不存在就为false


    if (!hasOwnProperty(this.data, fieldName)) {
      return false;
    }
    return (/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data[fieldName])
    );
  },

  // email 默认提供条件
  _handleCustomRuleByEmail: function _handleCustomRuleByEmail(rule) {
    var emailReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;

    var _rule9 = _slicedToArray(rule, 1),
        fieldName = _rule9[0];
    // 检验是否存在这个数据


    var ret = this._handleCustomRuleByRequire(rule);
    if (ret && !emailReg.test(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // url 默认提供条件
  _handleCustomRuleByUrl: function _handleCustomRuleByUrl(rule) {
    // TODO: 感觉这个正则不是特别好
    // http2://www.baidu.com 这种都能通过... 
    function isNoURL(str) {
      return !str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
    }

    var _rule10 = _slicedToArray(rule, 1),
        fieldName = _rule10[0];
    // 检验是否存在这个数据


    var ret = this._handleCustomRuleByRequire(rule);
    if (ret && isNoURL(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // number 默认提供条件
  _handleCustomRuleByNumber: function _handleCustomRuleByNumber(rule) {
    var _rule11 = _slicedToArray(rule, 1),
        fieldName = _rule11[0];
    // 检验是否存在这个数据


    var ret = this._handleCustomRuleByRequire(rule);
    if (ret && typeof this.data[fieldName] !== 'number') {
      ret = false;
    }
    return ret;
  },

  // reg 附加条件
  _handleOtherRuleByReg: function _handleOtherRuleByReg(rule) {
    var _rule12 = _slicedToArray(rule, 5),
        fieldName = _rule12[0],
        customRule = _rule12[1],
        errorMessage = _rule12[2],
        _rule12$ = _rule12[3],
        condition = _rule12$ === undefined ? 0 : _rule12$,
        otherRule = _rule12[4];
    // 检验是否存在这个数据


    var ret = this._handleCustomRuleByRequire(rule);
    if (ret && !otherRule.test(this.data[fieldName])) {
      ret = false;
    }
    return ret;
  },

  // function 附加条件
  _handleOtherRuleByFunc: function _handleOtherRuleByFunc(rule) {
    var _rule13 = _slicedToArray(rule, 5),
        fieldName = _rule13[0],
        value = _rule13[1],
        errorMessage = _rule13[2],
        _rule13$ = _rule13[3],
        condition = _rule13$ === undefined ? 0 : _rule13$,
        otherRule = _rule13[4];
    // 检验是否存在这个数据


    var ret = this._handleCustomRuleByRequire(rule);
    if (ret && !otherRule(this.data[fieldName], value)) {
      ret = false;
    }
    return ret;
  },

  // equal 附加条件
  _handleOtherRuleByEqual: function _handleOtherRuleByEqual(rule) {
    var _rule14 = _slicedToArray(rule, 5),
        fieldName1 = _rule14[0],
        val = _rule14[1],
        errorMessage = _rule14[2],
        _rule14$ = _rule14[3],
        condition = _rule14$ === undefined ? 0 : _rule14$,
        otherRule = _rule14[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(val);
    if (val1 && val2 && this.data[fieldName1] === val) {
      return true;
    }
    return false;
  },

  // confirm 附加条件
  _handleOtherRuleByConfirm: function _handleOtherRuleByConfirm(rule) {
    var _rule15 = _slicedToArray(rule, 5),
        fieldName1 = _rule15[0],
        fieldName2 = _rule15[1],
        errorMessage = _rule15[2],
        _rule15$ = _rule15[3],
        condition = _rule15$ === undefined ? 0 : _rule15$,
        otherRule = _rule15[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(this.data[fieldName2]);
    if (val1 && val2 && this.data[fieldName1] === this.data[fieldName2]) {
      return true;
    }
    return false;
  },

  // in 附加条件
  _handleOtherRuleByIn: function _handleOtherRuleByIn(rule) {
    var _rule16 = _slicedToArray(rule, 5),
        fieldName1 = _rule16[0],
        rangs = _rule16[1],
        errorMessage = _rule16[2],
        _rule16$ = _rule16[3],
        condition = _rule16$ === undefined ? 0 : _rule16$,
        otherRule = _rule16[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(rangs);
    if (val1 && val2 && rangs.includes(this.data[fieldName1])) {
      return true;
    }
    return false;
  },

  // length 附加条件
  _handleOtherRuleByLength: function _handleOtherRuleByLength(rule) {
    var _rule17 = _slicedToArray(rule, 5),
        fieldName1 = _rule17[0],
        len = _rule17[1],
        errorMessage = _rule17[2],
        _rule17$ = _rule17[3],
        condition = _rule17$ === undefined ? 0 : _rule17$,
        otherRule = _rule17[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    if (val1 && +len === String(this.data[fieldName1]).length) {
      return true;
    }
    return false;
  },

  // between 附加条件
  _handleOtherRuleByBetween: function _handleOtherRuleByBetween(rule) {
    var _rule18 = _slicedToArray(rule, 5),
        fieldName1 = _rule18[0],
        val = _rule18[1],
        errorMessage = _rule18[2],
        _rule18$ = _rule18[3],
        condition = _rule18$ === undefined ? 0 : _rule18$,
        otherRule = _rule18[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(val);
    if (val1 && val2) {
      var _val$split = val.split(','),
          _val$split2 = _slicedToArray(_val$split, 2),
          start = _val$split2[0],
          end = _val$split2[1];

      if (val1 >= start && val1 <= end) {
        return true;
      }
    }
    return false;
  },

  // expire 附加条件
  _handleOtherRuleByExpire: function _handleOtherRuleByExpire(rule) {
    var _rule19 = _slicedToArray(rule, 5),
        fieldName1 = _rule19[0],
        val = _rule19[1],
        errorMessage = _rule19[2],
        _rule19$ = _rule19[3],
        condition = _rule19$ === undefined ? 0 : _rule19$,
        otherRule = _rule19[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(val);
    if (val1 && val2) {
      val1 = String(val1);
      // 如果是 2018-5-11 格式
      if (val.includes('-') || val.includes('/')) {
        val1 = this.data[fieldName1].replace(/\-/g, '/');
        val = val.replace(/\-/g, '/');

        var _val$split3 = val.split(','),
            _val$split4 = _slicedToArray(_val$split3, 2),
            startTime = _val$split4[0],
            endTime = _val$split4[1];

        startTime = +new Date(startTime);
        endTime = +new Date(endTime);
        val1 = +new Date(val1);
        if (isNaN(startTime) || isNaN(endTime)) {
          console.error('\r\nPlease check ' + fieldName1 + ' conditions, maybe the date is wrong \uD83D\uDCC5 \r\n');
          return false;
        }
        if (val1 >= startTime && val1 <= endTime) {
          return true;
        }
      } else {
        // 时间戳格式 规定如果是时间戳全部都得是时间戳
        var _val$split5 = val.split(','),
            _val$split6 = _slicedToArray(_val$split5, 2),
            _startTime = _val$split6[0],
            _endTime = _val$split6[1];

        var v = this.data[fieldName1];
        if (v >= _startTime && v <= _endTime) {
          return true;
        }
      }
    }
    return false;
  },

  // ipAllow 附加条件
  _handleOtherRuleByIpAllow: function _handleOtherRuleByIpAllow(rule) {
    var _rule20 = _slicedToArray(rule, 5),
        fieldName1 = _rule20[0],
        val = _rule20[1],
        errorMessage = _rule20[2],
        _rule20$ = _rule20[3],
        condition = _rule20$ === undefined ? 0 : _rule20$,
        otherRule = _rule20[4];
    // 检验是否存在这个数据


    var val1 = isNoNull(this.data[fieldName1]);
    var val2 = isNoNull(val);
    if (val1 && val2) {
      var ips = val.split(',');
      if (ips.includes(this.data[fieldName1])) {
        return true;
      }
    }
    return false;
  }
};
