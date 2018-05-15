/*
 * @Author: jchen
 * @Date: 2017-10-11 13:31:41
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-04-25 14:01:32
 */

import React from 'react'
import { Input, Icon } from 'antd'

export default class SelectInput extends React.Component {
    render() {
      const { size, placeholder,value, onClick, disabled } = this.props
      return (
        <Input
          disabled={disabled}
          onClick={()=> { onClick() }}
          value={value && value.length ? value.join(','):''}
          size={size}
          placeholder={placeholder}
          addonAfter={<Icon type="ellipsis" />}
          style={{ width: '100%' }}
        />
      )
    }
}
