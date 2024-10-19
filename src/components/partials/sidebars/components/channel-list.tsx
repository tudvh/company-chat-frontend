import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Camera, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { AppLogo } from '@/assets/images'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { displayError } from '@/helpers'
import { createChannelSchema } from '@/schema'
import { ChannelService } from '@/services/api'
import { CreateChannelPayload, TCreateChannelSchema } from '@/types'

const defaultChannelValues = {
  name: '',
}

export const ChannelList = () => {
  const { userProfile } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const [isCreateChannelModalOpen, setCreateChannelModalOpen] = useState(false)
  const [channelThumbnailUrlPreview, setChannelThumbnailUrlPreview] = useState<string | null>(null)
  const [channelThumbnailFile, setChannelThumbnailFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const { data: myChannels, error: myChannelsError } = useQuery({
    queryKey: ['my-channels', userProfile?.id],
    queryFn: ChannelService.getMyChannels,
  })

  const { mutate: createChannelMutate } = useMutation({
    mutationFn: ChannelService.createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['my-channels', userProfile?.id],
      })
    },
  })

  const createChannelForm = useForm<TCreateChannelSchema>({
    resolver: yupResolver(createChannelSchema),
    defaultValues: defaultChannelValues,
  })

  const { name: nameError } = createChannelForm.formState.errors

  const handleChooseThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setChannelThumbnailFile(file)
    }
  }

  const handleCreateChannel = async (fields: TCreateChannelSchema) => {
    try {
      showLoading()
      const payload: CreateChannelPayload = {
        ...fields,
        thumbnailFile: channelThumbnailFile,
      }
      createChannelMutate(payload)
    } catch (error) {
      displayError(error)
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    if (myChannelsError) {
      displayError(myChannelsError)
      console.error('Error fetching my channels:', myChannelsError)
    }
  }, [myChannelsError])

  useEffect(() => {
    if (channelThumbnailFile) {
      const reader = new FileReader()
      reader.onload = () => {
        setChannelThumbnailUrlPreview(reader.result as string)
      }
      reader.readAsDataURL(channelThumbnailFile)
    } else {
      setChannelThumbnailUrlPreview(null)
    }
  }, [channelThumbnailFile])

  useEffect(() => {
    if (!isCreateChannelModalOpen) {
      createChannelForm.reset(defaultChannelValues)
      setChannelThumbnailUrlPreview(null)
      setChannelThumbnailFile(null)
    }
  }, [isCreateChannelModalOpen])

  return (
    <div className="thread-scroll h-full overflow-y-auto bg-primary/10 px-2 py-3">
      <div className="flex flex-col gap-3">
        <Link
          to={ROUTES.HOME}
          className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-background p-2 transition duration-200 hover:rounded-xl active:translate-y-0.5"
        >
          <img src={AppLogo} className="aspect-square size-full object-cover" alt="" />
        </Link>
        <div className="h-1 w-full rounded-full bg-background" />
        {myChannels?.map(channel => (
          <Link
            key={channel.id}
            to="#"
            className="size-12 overflow-hidden rounded-full bg-background transition duration-200 hover:rounded-xl active:translate-y-0.5"
          >
            <img
              src={channel.thumbnailUrl}
              className="block aspect-square size-full object-cover"
              alt={`${channel.name} thumbnail`}
              loading="lazy"
            />
          </Link>
        ))}
        <button
          className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-background p-2 text-green-600 transition duration-200 hover:rounded-xl active:translate-y-0.5"
          onClick={() => setCreateChannelModalOpen(true)}
        >
          <Plus size={24} />
        </button>
        <Dialog open={isCreateChannelModalOpen} onOpenChange={setCreateChannelModalOpen} modal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Khởi tạo máy chủ mới</DialogTitle>
              <DialogDescription>
                Chọn một cái tên độc đáo và ấn tượng cho máy chủ mới của bạn – đừng lo, bạn luôn có
                thể thay đổi nó sau!
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full justify-center">
              <label
                className="relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-full border p-3 transition-transform duration-200 hover:scale-110"
                htmlFor="create-channel-image-input"
              >
                <Camera size={20} />
                <p className="text-sm">Upload</p>
                {channelThumbnailUrlPreview && (
                  <img
                    src={channelThumbnailUrlPreview}
                    className="absolute inset-0 h-20 w-20 rounded-full bg-background object-cover"
                    alt="Channel Thumbnail"
                  />
                )}
              </label>

              <input
                type="file"
                className="hidden"
                id="create-channel-image-input"
                onChange={handleChooseThumbnail}
              />
            </div>
            <Form {...createChannelForm}>
              <form
                onSubmit={createChannelForm.handleSubmit(handleCreateChannel)}
                className="space-y-4"
              >
                <FormField
                  control={createChannelForm.control}
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
