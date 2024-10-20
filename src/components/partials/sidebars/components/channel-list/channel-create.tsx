import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Camera } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

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
import { useAuth, useLoading } from '@/contexts'
import { displayError, getDefaultRoomId } from '@/helpers'
import { useMyChannelDetail, useMyChannels } from '@/hooks'
import { createChannelSchema } from '@/schema'
import { ChannelService } from '@/services/api'
import { CreateChannelPayload, TChannelDetail, TCreateChannelSchema } from '@/types'
import { ToastUtil } from '@/utils'

interface ChannelCreateProps {
  isModalOpen: boolean
  onClose: () => void
}

const defaultValues = {
  name: '',
}

export const ChannelCreate = ({ isModalOpen, onClose }: ChannelCreateProps) => {
  const { userProfile } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const { refresh: refreshMyChannelsData } = useMyChannels(userProfile?.id)
  const { setData: setMyChannelDetailData } = useMyChannelDetail()
  const [thumbnailUrlPreview, setThumbnailUrlPreview] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const navigate = useNavigate()

  const form = useForm<TCreateChannelSchema>({
    resolver: yupResolver(createChannelSchema),
    defaultValues: defaultValues,
  })

  const { name: nameError } = form.formState.errors

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
    }
  }

  const resetFormFields = () => {
    form.reset(defaultValues)
    setThumbnailFile(null)
  }

  const { mutate: createChannel } = useMutation<TChannelDetail, Error, CreateChannelPayload>({
    mutationFn: ChannelService.createChannel,
    onMutate: () => showLoading(),
    onSuccess: (newChannel: TChannelDetail) => {
      ToastUtil.success('Tạo máy chủ thành công')
      refreshMyChannelsData()
      setMyChannelDetailData(newChannel)
      const channelId = newChannel.id
      const roomId = getDefaultRoomId(newChannel)
      if (channelId && roomId) {
        navigate(ROUTES.ROOM.replace(':channelId', channelId).replace(':roomId', roomId))
      }
    },
    onError: error => {
      displayError(error)
      console.error('Error creating channel:', error)
    },
    onSettled: () => {
      hideLoading()
      resetFormFields()
      onClose()
    },
  })

  const onSubmit = (fields: TCreateChannelSchema) => {
    const payload: CreateChannelPayload = {
      ...fields,
      thumbnailFile: thumbnailFile,
    }
    createChannel(payload)
  }

  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader()
      reader.onload = () => {
        setThumbnailUrlPreview(reader.result as string)
      }
      reader.readAsDataURL(thumbnailFile)
    } else {
      setThumbnailUrlPreview(null)
    }
  }, [thumbnailFile])

  useEffect(() => {
    if (isModalOpen) {
      resetFormFields()
    }
  }, [isModalOpen])

  return (
    <>
      <div className="flex w-full justify-center">
        <label
          className="relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-full border p-3 transition-transform duration-200 hover:scale-110"
          htmlFor="create-channel-image-input"
        >
          <Camera size={20} />
          <p className="text-sm">Upload</p>
          {thumbnailUrlPreview && (
            <img
              src={thumbnailUrlPreview}
              className="absolute inset-0 h-20 w-20 rounded-full bg-background object-cover"
              alt="channel thumbnail"
            />
          )}
        </label>

        <input
          type="file"
          className="hidden"
          id="create-channel-image-input"
          onChange={handleThumbnailChange}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Tên máy chủ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên máy chủ" error={!!nameError} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="ms-auto">
              Tạo mới
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
