const {
  Enum: { CompilerTypeKind: { PARAMETRIZABLE } }
} = require('../../utils')

module.exports = {
  Read: {
    'switch': [PARAMETRIZABLE, (compiler, struct) => {
      let compare = struct.compareTo ? struct.compareTo : struct.compareToValue
      let args = []
      if (compare.startsWith('$')) args.push(compare)
      else if (struct.compareTo) {
        compare = compiler.getField(compare)
      }
      let code = `switch (${compare}) {\n`
      for (const key in struct.fields) {
        let val = key
        if (isNaN(val) && val !== 'true' && val !== 'false') val = `"${val}"`
        code += compiler.indent(`case ${val}: return ` + compiler.callType(struct.fields[key])) + '\n'
      }
      code += compiler.indent('default: return ' + compiler.callType(struct.default ? struct.default : 'void')) + '\n'
      code += `}`
      return compiler.wrapCode(code, args)
    }],
    'option': [PARAMETRIZABLE, (compiler, type) => {
      let code = 'const {value} = ctx.bool(buffer, offset)\n'
      code += 'if (value) {\n'
      code += '  const result = ' + compiler.callType(type, 'offset + 1') + '\n'
      code += '  return new Result(result.value, result.size + 1)\n'
      code += '}\n'
      code += 'return new Result(undefined, 1)'
      return compiler.wrapCode(code)
    }]
  },

  Write: {
    'switch': [PARAMETRIZABLE, (compiler, struct) => {
      let compare = struct.compareTo ? struct.compareTo : struct.compareToValue
      let args = []
      if (compare.startsWith('$')) args.push(compare)
      else if (struct.compareTo) {
        compare = compiler.getField(compare)
      }
      let code = `switch (${compare}) {\n`
      for (const key in struct.fields) {
        let val = key
        if (isNaN(val) && val !== 'true' && val !== 'false') val = `"${val}"`
        code += compiler.indent(`case ${val}: return ` + compiler.callType('value', struct.fields[key])) + '\n'
      }
      code += compiler.indent('default: return ' + compiler.callType('value', struct.default ? struct.default : 'void')) + '\n'
      code += `}`
      return compiler.wrapCode(code, args)
    }],
    'option': [PARAMETRIZABLE, (compiler, type) => {
      let code = 'if (value != null) {\n'
      code += '  offset = ctx.bool(1, buffer, offset)\n'
      code += '  offset = ' + compiler.callType('value', type) + '\n'
      code += '} else {\n'
      code += '  offset = ctx.bool(0, buffer, offset)\n'
      code += '}\n'
      code += 'return offset'
      return compiler.wrapCode(code)
    }]
  },

  SizeOf: {
    'switch': [PARAMETRIZABLE, (compiler, struct) => {
      let compare = struct.compareTo ? struct.compareTo : struct.compareToValue
      let args = []
      if (compare.startsWith('$')) args.push(compare)
      else if (struct.compareTo) {
        compare = compiler.getField(compare)
      }
      let code = `switch (${compare}) {\n`
      for (const key in struct.fields) {
        let val = key
        if (isNaN(val) && val !== 'true' && val !== 'false') val = `"${val}"`
        code += compiler.indent(`case ${val}: return ` + compiler.callType('value', struct.fields[key])) + '\n'
      }
      code += compiler.indent('default: return ' + compiler.callType('value', struct.default ? struct.default : 'void')) + '\n'
      code += `}`
      return compiler.wrapCode(code, args)
    }],
    'option': [PARAMETRIZABLE, (compiler, type) => {
      let code = 'if (value != null) {\n'
      code += '  return 1 + ' + compiler.callType('value', type) + '\n'
      code += '}\n'
      code += 'return 1'
      return compiler.wrapCode(code)
    }]
  }
}
