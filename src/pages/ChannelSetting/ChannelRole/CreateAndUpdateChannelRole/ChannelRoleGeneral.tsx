import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui'
import { ROUTES } from '@/configs'
import { useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { createChannelRoleSchema } from '@/schema'
import { ChannelRoleService } from '@/services/api'
import { CreateChannelRolePayload, TChannelRoleDetail, TCreateChannelRoleSchema } from '@/types'
import { ToastUtil } from '@/utils'

const defaultValues = {
  name: '',
}

interface ChannelRoleGeneralProps {
  channelRole?: TChannelRoleDetail
}

export const ChannelRoleGeneral = ({ channelRole }: ChannelRoleGeneralProps) => {
  const { showLoading, hideLoading } = useLoading()
  const { channelId } = useParams()
  const navigate = useNavigate()

  const form = useForm<TCreateChannelRoleSchema>({
    resolver: yupResolver(createChannelRoleSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!channelRole) {
      form.reset(defaultValues)
    } else {
      form.reset({
        name: channelRole.name,
      })
    }
  }, [channelRole, form])

  if (!channelId) return null

  const { name: nameError } = form.formState.errors

  const onSubmit = async (values: TCreateChannelRoleSchema) => {
    try {
      showLoading()
      const payload: CreateChannelRolePayload = {
        ...values,
        channelId,
      }
      if (channelRole) {
        await ChannelRoleService.update(channelRole.id, payload)
        ToastUtil.success('Cập nhật vai trò thành công')
      } else {
        await ChannelRoleService.create(payload)
        ToastUtil.success('Tạo vai trò thành công')
      }
      navigate(ROUTES.CHANNEL_SETTING.ROLE.INDEX.replace(':channelId', channelId))
    } catch (err: any) {
      displayError(err)
    } finally {
      hideLoading()
    }
  }

  return (
    <div className="px-2 py-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên vai trò" error={!!nameError} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
