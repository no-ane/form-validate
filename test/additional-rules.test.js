const assert = require('assert');
const validator = require('../index');

describe('additional-rules', function () {
  it('diff error', function () {
    const formData = {
      name: '小明',
    }
    const rules = [
      ['name', '小明', 'error message', 1, (data, val) => val === data]
    ]
    assert.strictEqual(validator.setData(formData).validate(rules), true);
  });

  it('error message', function () {
    const formData = {
      name: '小明',
    }
    const rules = [
      ['name', '小李', 'error message', 1, (data, val) => val === data],
    ]
    assert.strictEqual(validator.setData(formData).validate(rules), false);
    assert.strictEqual(Object.values(validator.getError()).join(), 'error message');
  });

  it('name diff', function () {
    const formData = {
      name: '小明',
    }
    const rules = [
      ['mingzi', '小李', 'error message', 1, (data, val) => val === data],
    ]
    assert.strictEqual(validator.setData(formData).validate(rules), false);
    assert.strictEqual(Object.values(validator.getError()).join(), 'error message');
  });

});