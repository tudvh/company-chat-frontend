import {
  LocalUser,
  LocalVideoTrack,
  RemoteUser,
  RemoteVideoTrack,
  useIsConnected,
  useJoin,
  useRemoteUsers,
  useRemoteVideoTracks,
  useRTCClient,
} from 'agora-rtc-react'
import { Mic, MicOff, MonitorOff, MonitorUp, Phone, Video, VideoOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { UserAvatarDefault } from '@/assets/images'
import { AppTooltip, Button } from '@/components/ui'
import { useAuth } from '@/contexts'
import { displayError, getEnv } from '@/helpers'
import { useCameraTrack, useMicrophoneTrack, useRoomDetail, useScreenTrack } from '@/hooks'
import { cn } from '@/lib/utils'
import { RoomService } from '@/services/api'
import { TCallInfo } from '@/types'

export const CallRoomPage = () => {
  const client = useRTCClient()
  const [calling, setCalling] = useState(false)
  const [callInfo, setCallInfo] = useState<TCallInfo>()
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isScreenShareOn, setIsScreenShareOn] = useState(false)
  const { roomId } = useParams()
  const { userProfile } = useAuth()
  const { room } = useRoomDetail(roomId)
  const { error: microphoneTrackError } = useMicrophoneTrack(isMicOn, {}, client)
  const { error: cameraTrackError } = useCameraTrack(isCameraOn, {}, client)
  const {
    screenTrack: localScreenTrack,
    error: screenTrackError,
    isLoading: isLoadingScreenTrack,
  } = useScreenTrack(isScreenShareOn, setIsScreenShareOn, {}, client)
  const isConnected = useIsConnected()
  const remoteUsers = useRemoteUsers()
  const { videoTracks: remoteVideoTracks } = useRemoteVideoTracks(remoteUsers)
  const myProfile = useJoin(
    {
      appid: getEnv('VITE_AGORA_APP_ID'),
      channel: callInfo?.channel || '',
      token: callInfo?.rtcToken || null,
      uid: userProfile?.id,
    },
    calling,
  )

  const createCallToken = async () => {
    try {
      if (!room) return
      const data = await RoomService.getCallInfo(room.id)
      setCallInfo(data)
      setCalling(true)
    } catch (error: any) {
      displayError(error)
    }
  }

  useEffect(() => {
    if (!room) return
    createCallToken()
  }, [room])

  useEffect(() => {
    if (cameraTrackError) {
      setIsMicOn(false)
      displayError(microphoneTrackError)
    }
  }, [microphoneTrackError])

  useEffect(() => {
    if (cameraTrackError) {
      setIsCameraOn(false)
      displayError(cameraTrackError)
    }
  }, [cameraTrackError])

  useEffect(() => {
    if (screenTrackError) {
      setIsScreenShareOn(false)
      displayError(screenTrackError)
    }
  }, [screenTrackError])

  useEffect(() => {
    if (myProfile.error) {
      setCalling(false)
      displayError(myProfile.error, {
        title: 'Lỗi khi tham gia cuộc gọi',
      })
    }
  }, [myProfile.error])

  useEffect(() => {
    return () => {
      setCalling(false)
    }
  }, [])

  return (
    <div className="flex size-full flex-col items-center justify-center gap-5 bg-foreground p-5 text-primary-foreground">
      {isConnected ? (
        <>
          <div className="flex flex-1 items-center justify-center overflow-y-auto">
            <div className="flex flex-wrap items-center justify-center gap-5">
              {isScreenShareOn && !isLoadingScreenTrack && (
                <div className="h-fit cursor-pointer space-y-4 text-center">
                  <div className="aspect-video w-[300px] overflow-hidden rounded-xl border shadow">
                    <LocalVideoTrack track={localScreenTrack} play />
                  </div>
                  <p>{userProfile?.fullName}</p>
                </div>
              )}
              {remoteVideoTracks.map(videoTrack => (
                <div
                  className="h-fit cursor-pointer space-y-4 text-center"
                  key={videoTrack.getUserId()}
                >
                  <div className="aspect-video w-[300px] overflow-hidden rounded-xl border shadow">
                    <RemoteVideoTrack track={videoTrack} play />
                  </div>
                  <p>{videoTrack.getUserId()}</p>
                </div>
              ))}
              <div className="h-fit cursor-pointer space-y-4 text-center">
                <div className="aspect-video w-[300px] overflow-hidden rounded-xl border shadow">
                  <LocalUser
                    playAudio={false}
                    cameraOn={isCameraOn}
                    micOn={isMicOn}
                    cover={userProfile?.avatarUrl ?? UserAvatarDefault}
                  />
                </div>
                <p>{userProfile?.fullName}</p>
              </div>
              {remoteUsers.map(user => (
                <div className="h-fit cursor-pointer space-y-4 text-center" key={user.uid}>
                  <div className="aspect-video w-[300px] overflow-hidden rounded-xl border shadow">
                    <RemoteUser
                      cover="https://bing.biturl.top?resolution=1366&format=image&index=random"
                      user={user}
                    />
                  </div>
                  <p>{user.uid}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-5">
            <AppTooltip content={isCameraOn ? 'Tắt Máy ảnh' : 'Bật Máy Ảnh'} asChild>
              <Button
                className={cn('size-14 rounded-full', !isCameraOn && 'border')}
                variant={isCameraOn ? 'secondary' : 'default'}
                onClick={() => setIsCameraOn(prev => !prev)}
              >
                {isCameraOn ? <Video className="size-6" /> : <VideoOff className="size-6" />}
              </Button>
            </AppTooltip>
            <AppTooltip content={isScreenShareOn ? 'Ngừng Chia Sẻ' : 'Chia Sẻ Màn Hình'} asChild>
              <Button
                className={cn('size-14 rounded-full', !isScreenShareOn && 'border')}
                variant={isScreenShareOn ? 'secondary' : 'default'}
                onClick={() => setIsScreenShareOn(prev => !prev)}
              >
                {isScreenShareOn ? (
                  <MonitorOff className="size-6" />
                ) : (
                  <MonitorUp className="size-6" />
                )}
              </Button>
            </AppTooltip>
            <AppTooltip content={isMicOn ? 'Tắt Micro' : 'Bật Micro'} asChild>
              <Button
                className={cn('size-14 rounded-full', !isMicOn && 'border')}
                variant={isMicOn ? 'secondary' : 'default'}
                onClick={() => setIsMicOn(prev => !prev)}
              >
                {isMicOn ? <Mic className="size-6" /> : <MicOff className="size-6" />}
              </Button>
            </AppTooltip>
            {calling && (
              <AppTooltip content="Ngắt kết nối" asChild>
                <Button
                  className="size-14 rounded-full"
                  variant="destructive"
                  onClick={() => setCalling(prev => !prev)}
                >
                  <Phone />
                </Button>
              </AppTooltip>
            )}
          </div>
        </>
      ) : myProfile.isLoading ? (
        'Đang kết nối...'
      ) : (
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Chung</h1>
          <p className="text-sm">Hiện đang không có ai ở trong kênh thoại</p>
          <Button className="!mt-5 bg-green-600 hover:bg-green-700" onClick={createCallToken}>
            Tham gia thoại
          </Button>
        </div>
      )}
    </div>
  )
}
