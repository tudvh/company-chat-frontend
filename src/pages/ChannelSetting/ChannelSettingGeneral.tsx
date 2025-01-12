import { Camera } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { displayError } from '@/helpers'
import { useChannelDetail } from '@/hooks'
import { ChannelService } from '@/services/api'
import { ToastUtil } from '@/utils'

export const ChannelSettingGeneralPage = () => {
  const { channelId } = useParams()
  const { channelDetail, invalidateChannelDetail } = useChannelDetail(channelId)
  const [nameChannel, setNameChannel] = useState<string>('')
  const [logo, setLogo] = useState<File>()
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    if (channelDetail?.name) {
      setNameChannel(channelDetail.name)
    }
  }, [channelDetail])

  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo)
      setPreviewUrl(url)

      return () => URL.revokeObjectURL(url)
    }
  }, [logo])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setLogo(files[0])
    }
  }

  const update = async () => {
    const formData = new FormData()
    if (logo) {
      formData.append('logo', logo)
    }
    formData.append('name', nameChannel)
    try {
      if (channelId) {
        await ChannelService.updateInfo(channelId, formData)
        ToastUtil.success('Cập nhật thông tin máy chủ thành công')
        invalidateChannelDetail()
      }
    } catch (err) {
      displayError(err)
    }
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-bold">Tổng quan về máy chủ</h1>
      <div className="flex items-start gap-6">
        <div className="relative">
          <label
            htmlFor="file-upload"
            className="group relative block h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-100"
          >
            {previewUrl || channelDetail?.thumbnailUrl ? (
              <img
                src={previewUrl || channelDetail?.thumbnailUrl || ''}
                className="absolute z-[40] h-full w-full object-cover"
              />
            ) : (
              <div className="absolute z-[40] flex size-full items-center justify-center bg-muted text-2xl">
                <p>{channelDetail?.name.charAt(0).toUpperCase()}</p>
              </div>
            )}
            <div className="absolute z-[41] flex h-full w-full items-center justify-center bg-black/30 p-4 text-center opacity-0 transition-opacity delay-75 ease-in group-hover:opacity-100">
              <Camera className="size-10 text-white" />
            </div>
          </label>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">TÊN MÁY CHỦ</label>
            <input
              type="text"
              value={nameChannel}
              onChange={e => setNameChannel(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="text-sm text-gray-600">
            Chúng tôi khuyến bạn nên sử dụng hình ảnh có kích thước tối thiểu 512x512 cho máy chủ.
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept="image/*"
          />

          <button
            className="mt-4 inline-block cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            onClick={() => update()}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  )
}
