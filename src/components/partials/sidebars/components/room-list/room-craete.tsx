import { yupResolver } from '@hookform/resolvers/yup'
import { LockKeyhole, Volume2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { SharpIcon } from '@/components/icons'
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
import { RoomTypeEnum } from '@/enums'
import { displayError } from '@/helpers'
import { useChannelDetail, useRoomDetail } from '@/hooks'
import { cn } from '@/lib/utils'
import { createRoomSchema } from '@/schema'
import { RoomService } from '@/services/api'
import { CreateRoomPayload, TCreateRoomSchema } from '@/types'
import { ToastUtil } from '@/utils'

interface RoomCreateProps {
  groupId: string
  isModalOpen: boolean
  onClose: () => void
}

const DEFAULT_FORM_VALUE = {
  name: '',
  type: RoomTypeEnum.Chat,
  isPrivate: false,
} as const

const ROOM_TYPES = [
  {
    type: RoomTypeEnum.Chat,
    icon: SharpIcon,
    title: 'Văn bản',
    description: 'Gửi tin nhắn, hình ảnh, video và tệp tin',
  },
  {
    type: RoomTypeEnum.Call,
    icon: Volume2,
    title: 'Giọng nói',
    description: 'Cùng gặp mặt bằng gọi thoại, và chia sẻ màn hình',
  },
] as const

export const RoomCreate = ({ groupId, isModalOpen, onClose }: RoomCreateProps) => {
  const { showLoading, hideLoading } = useLoading()
  const { channelId } = useParams()
  const { updateRoom } = useRoomDetail()
  const { invalidateChannelDetail } = useChannelDetail(channelId)

  const form = useForm<TCreateRoomSchema>({
    resolver: yupResolver(createRoomSchema),
    defaultValues: DEFAULT_FORM_VALUE,
  })

  const { name: nameError } = form.formState.errors

  const onSubmit = async (fields: TCreateRoomSchema) => {
    try {
      showLoading()
      const payload: CreateRoomPayload = {
        ...fields,
        groupId,
      }
      const data = await RoomService.createRoom(payload)
      ToastUtil.success('Kênh đã được tạo thành công')
      updateRoom(data)
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
          name="type"
          render={() => (
            <FormItem>
              <FormLabel required>Loại kênh</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {ROOM_TYPES.map(roomType => {
                    const Icon = roomType.icon
                    const isSelected = form.watch('type') === roomType.type
                    return (
                      <button
                        key={roomType.type}
                        type="button"
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                          isSelected ? 'bg-primary/10' : 'hover:bg-primary/8 bg-primary/5',
                        )}
                        onClick={() => form.setValue('type', roomType.type)}
                      >
                        <div>
                          <Icon className="w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-base font-medium">{roomType.title}</p>
                          <p className="text-sm">{roomType.description}</p>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id={`r-${roomType.type}`}
                            className="size-4 cursor-pointer accent-primary"
                            value={roomType.type.toString()}
                            checked={isSelected}
                            onChange={() => {}}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tên kênh</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên kênh" error={!!nameError} {...field} />
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
                      <Label className="text-base">Kênh riêng</Label>
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
          <Button type="submit">Tạo kênh</Button>
        </div>
      </form>
    </Form>
  )
}
