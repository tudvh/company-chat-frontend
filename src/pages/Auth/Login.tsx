import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from '@/components/ui'
import { useAuth, useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { loginSchema } from '@/schema'
import { TLoginSchema } from '@/types'
import { GoogleIcon } from '@/components/icons'
import { useGoogleLogin } from '@react-oauth/google'

const defaultValues = {
  email: '',
  password: '',
}

export const LoginPage = () => {
  const { login, authWithGoogle } = useAuth()
  const { openLoading, closeLoading } = useLoading()
  const [isShowPassword, setIsShowPassword] = useState(false)

  const form = useForm<TLoginSchema>({
    resolver: yupResolver(loginSchema),
    defaultValues,
  })

  const { email: emailError, password: passwordError } = form.formState.errors

  const onSubmit = async (values: TLoginSchema) => {
    try {
      openLoading()
      await login(values)
    } catch (err: any) {
      displayError(err)
    } finally {
      closeLoading()
    }
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        openLoading()
        await authWithGoogle({
          accessToken: tokenResponse.access_token,
        })
      } catch (err: any) {
        displayError(err)
      } finally {
        closeLoading()
      }
    },
    onError: errorResponse => {
      console.error('Login Failed:', errorResponse)
    },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-center text-3xl font-bold">Đăng nhập</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input placeholder="abc@example.com" error={!!emailError} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type={isShowPassword ? 'text' : 'password'}
                    error={!!passwordError}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-password"
              checked={isShowPassword}
              onCheckedChange={isCheck => setIsShowPassword(isCheck as boolean)}
            />
            <Label htmlFor="show-password">Hiển thị mật khẩu</Label>
          </div>
          <Button type="submit" className="!mt-8 w-full">
            Đăng nhập
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => loginWithGoogle()}
          >
            <GoogleIcon />
            <span>Đăng nhập với Google</span>
          </Button>
        </form>
      </Form>
    </div>
  )
}
