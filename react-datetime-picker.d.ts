declare module 'react-datetime-picker' {
  import React from 'react'

  export interface DateTimePickerProps {
    onChange: (date: Date | null) => void
    value: Date | null
    className?: string
    calendarClassName?: string
    clockClassName?: string
    format?: string
    disableClock?: boolean
    clearIcon?: React.ReactNode | null
    calendarIcon?: React.ReactNode | null
  }

  const DateTimePicker: React.FC<DateTimePickerProps>
  export default DateTimePicker
}
