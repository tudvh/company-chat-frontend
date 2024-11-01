import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Switch,
} from '@/components/ui'
import { useLoading } from '@/contexts'
import { displayError } from '@/helpers'
import { useChannelDetail } from '@/hooks'
import { createGroupSchema } from '@/schema'
import { GroupService } from '@/services/api'
import { TCreateGroupSchema } from '@/types'
import { ToastUtil } from '@/utils'
import { LockKeyhole } from 'lucide-react'

interface GroupCreateProps {
  isModalOpen: boolean
  channelId: string
  onClose: () => void
}

const DEFAULT_FORM_VALUE = {
  name: '',
  isPrivate: false,
} as const

export const GroupCreate = ({ isModalOpen, channelId, onClose }: GroupCreateProps) => {
  const { showLoading, hideLoading } = useLoading()
  const { invalidateChannelDetail } = useChannelDetail(channelId)

  const form = useForm<TCreateGroupSchema>({
    resolver: yupResolver(createGroupSchema),
    defaultValues: DEFAULT_FORM_VALUE,
  })

  const { name: nameError } = form.formState.errors

  const onSubmit = async (fields: TCreateGroupSchema) => {
    try {
      showLoading()
      await GroupService.createGroup({
        ...fields,
        channelId,
      })
      ToastUtil.success('Tạo danh mục thành công')
      invalidateChannelDetail()
      onClose()
    } catch (error) {
      displayError(error)
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      form.reset(DEFAULT_FORM_VALUE)
    }
  }, [isModalOpen])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tên danh mục</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên danh mục" error={!!nameError} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="space-y-1">
                  <div className="flex justify-between gap-3">
                    <div className="flex items-center gap-0.5">
                      <LockKeyhole className="h-5" />
                      <Label className="text-base">Danh mục riêng</Label>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                  <p className="text-sm">
                    Chỉ có thành viên và vai trò được chọn mới có thể nhìn thấy kênh này
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit">Tạo danh mục</Button>
        </div>
      </form>
    </Form>
  )
}
