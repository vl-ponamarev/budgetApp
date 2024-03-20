import type { DatePickerProps } from 'antd'
import { DatePicker } from 'antd'

const MonthPicker = () => {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }

  return <DatePicker onChange={onChange} picker="month" />
}

export default MonthPicker
