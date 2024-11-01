import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'Trường này là bắt buộc',
  },
  string: {
    email: 'Email không hợp lệ',
  },
})

export default yup
