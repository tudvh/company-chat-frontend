import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'Vui lòng nhập thông tin này',
  },
  string: {
    email: 'Vui lòng nhập đúng định dạng email',
  },
})

export default yup
