const assert = require('assert');
const validator = require('../index');

describe('validate-type', function () {
  it('init validate type', function () {
    {
      const formData = {
        name: '小明',
      }
      const rules = [
        ['age', 'require', 'error message']
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), true);
    }

    {
      const formData = {
        name: '小明',
      }
      const rules = [
        ['name', 'xiao li', 'The name must be xiao li', 0, (val, secondVal) => val === secondVal]
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), false);
      assert.strictEqual(Object.values(validator.getError()).join(), 'The name must be xiao li');
    }
  });

  it('1 validate type', function () {
    {
      const formData = {
        name: '小明',
      }
      const rules = [
        ['name', 'require', 'The name can not be empty when the validate type is 1', 1],
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), true);
      assert.strictEqual(Object.values(validator.getError()).join(), '');
    }

    {
      const formData = {
        age: 18,
      }
      const rules = [
        ['name', 'require', 'The name is empty.', 1],
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), false);
      assert.strictEqual(Object.values(validator.getError()).join(), 'The name is empty.');
    }

    {
      const formData = {
        age: 18,
      }
      const rules = [
        ['name', 'require', 'The name can not be empty..', 1],
        ['age', 'number', 'The age must be 18', 1],
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), false);
      assert.strictEqual(Object.values(validator.getError()).join(), 'The name can not be empty..');
    }
  });

  it('2 validate type', function () {
    {
      const formData = {
        name: '小明',
      }
      const rules = [
        ['age', 'number', 'The age can be empty.', 2],
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), true);
      assert.strictEqual(Object.values(validator.getError()).join(), '');
    }

    {
      const formData = {
        name: '小李',
        age: 18,
      }
      const rules = [
        ['name', 'number', 'The name must be a number..', 2],
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), false);
      assert.strictEqual(Object.values(validator.getError()).join(), 'The name must be a number..');
    }

    {
      const formData = {
        name: '小李',
        age: 18,
      }
      const rules = [
        ['name', 'require', 'no error message', 2],
        ['age', 'number', 'The age must be a number..', 2],
      ]
      assert.strictEqual(validator.setData(formData).validate(rules), true);
      assert.strictEqual(Object.values(validator.getError()).join(''), '');
    }
  });
});