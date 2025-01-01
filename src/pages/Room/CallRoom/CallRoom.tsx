import {
  LocalUser,
  LocalVideoTrack,
  RemoteUser,
  RemoteVideoTrack,
  useIsConnected,
  useJoin,
  useRemoteUsers,
  useRTCClient,
} from 'agora-rtc-react'
import { Mic, MicOff, MonitorOff, MonitorUp, Phone, Video, VideoOff } from 'lucide-react'
import { Channel, Members } from 'pusher-js'
import { useEffect, useState } from 'react'

import { UserAvatarDefault } from '@/assets/images'
import { AppTooltip, Button } from '@/components/ui'
import { useAuth, usePusher } from '@/contexts'
import { displayError, getEnv } from '@/helpers'
import { useCameraTrack, useMicrophoneTrack, useScreenShareTrack } from '@/hooks'
import { cn } from '@/lib/utils'
import { RoomService } from '@/services/api'
import { TCallInfo, TPusherEventMember, TRemoteUserInfos, TRoom } from '@/types'

interface CallRoomPageProps {
  room: TRoom
}

export const CallRoomPage = ({ room }: CallRoomPageProps) => {
  const client = useRTCClient()
  const [calling, setCalling] = useState(false)
  const [callInfo, setCallInfo] = useState<TCallInfo>()
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isScreenShareOn, setIsScreenShareOn] = useState(false)
  const [pusherChannel, setPusherChannel] = useState<Channel>()
  const [remoteUserInfos, setRemoteUserInfos] = useState<TRemoteUserInfos>({})
  const { userProfile } = useAuth()
  const { subscribeToChannel, unsubscribeFromChannel } = usePusher()
  const { error: microphoneTrackError } = useMicrophoneTrack(isMicOn, {}, client)
  const { localCameraTrack, error: cameraTrackError } = useCameraTrack(isCameraOn, {}, client)
  const {
    screenTrack: localScreenTrack,
    error: screenTrackError,
    isLoading: isLoadingScreenTrack,
  } = useScreenShareTrack(isScreenShareOn, setIsScreenShareOn, {}, client)
  const isConnected = useIsConnected()
  const remoteUsers = useRemoteUsers()

  const myProfile = useJoin(
    {
      appid: getEnv('VITE_AGORA_APP_ID'),
      channel: callInfo?.channel ?? '',
      token: callInfo?.rtcToken ?? '',
      uid: callInfo?.uid,
    },
    calling,
  )

  const createCallToken = async () => {
    try {
      const data = await RoomService.getCallInfo(room.id)
      setCallInfo(data)
      setCalling(true)
    } catch (error: any) {
      displayError(error)
    }
  }

  const toggleCamera = (isOpen: boolean) => {
    setIsCameraOn(isOpen)
    if (isOpen) {
      setIsScreenShareOn(false)
    }
  }

  const toggleMic = (isOpen: boolean) => {
    setIsMicOn(isOpen)
  }

  const toggleScreenShare = (isOpen: boolean) => {
    setIsScreenShareOn(isOpen)
    if (isOpen) {
      setIsCameraOn(false)
    }
  }

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
    if (!pusherChannel) return

    pusherChannel.bind('pusher:subscription_succeeded', (member: Members) => {
      console.log('pusher:subscription_succeeded', member)
      const remoteUserInfos = Object.keys(member.members)
        .filter(key => key !== member.me.id)
        .reduce((obj: any, key) => {
          obj[key] = member.members[key]
          return obj
        }, {})
      setRemoteUserInfos(remoteUserInfos)
    })
    pusherChannel.bind('pusher:member_added', (member: TPusherEventMember) => {
      console.log('pusher:member_added', member)
      const newRemoteUserInfos = { ...remoteUserInfos }
      newRemoteUserInfos[member.id] = member.info
      setRemoteUserInfos(newRemoteUserInfos)
    })
    pusherChannel.bind('pusher:member_removed', (member: TPusherEventMember) => {
      console.log('pusher:member_removed', member)
    })
  }, [pusherChannel])

  useEffect(() => {
    setPusherChannel(subscribeToChannel(`presence-${room.id}`))

    return () => {
      unsubscribeFromChannel(`presence-${room.id}`)
    }
  }, [calling])

  useEffect(() => {
    createCallToken()

    return () => {
      setCalling(false)
    }
  }, [room.id])

  return (
    <div className="flex size-full flex-col items-center justify-center gap-5 bg-background p-5 text-foreground">
      {isConnected ? (
        <>
          <div className="flex flex-1 items-center justify-center overflow-y-auto">
            <div className="flex flex-wrap items-center justify-center gap-5">
              {isScreenShareOn && !isLoadingScreenTrack ? (
                <div className="h-fit cursor-pointer space-y-4 text-center">
                  <div className="aspect-video w-[300px] overflow-hidden rounded-xl border border-primary shadow">
                    <LocalVideoTrack track={localScreenTrack} play />
                  </div>
                  <p>{userProfile?.fullName}</p>
                </div>
              ) : (
                <div className="h-fit cursor-pointer space-y-4 text-center">
                  <div className="aspect-video w-[300px] overflow-hidden rounded-xl border border-primary shadow">
                    <LocalUser
                      playAudio={false}
                      cameraOn={isCameraOn}
                      micOn={isMicOn}
                      cover={userProfile?.avatarUrl ?? UserAvatarDefault}
                      videoTrack={localCameraTrack}
                    />
                  </div>
                  <p>{userProfile?.fullName}</p>
                </div>
              )}
              {remoteUsers.map(user => (
                <div className="h-fit cursor-pointer space-y-4 text-center" key={user.uid}>
                  <div className="aspect-video w-[300px] overflow-hidden rounded-xl border border-primary shadow">
                    {user.videoTrack ? (
                      <RemoteVideoTrack track={user.videoTrack} play />
                    ) : (
                      <RemoteUser
                        cover={remoteUserInfos[user.uid]?.avatarUrl ?? UserAvatarDefault}
                        user={user}
                      />
                    )}
                  </div>
                  <p>{remoteUserInfos[user.uid]?.fullName ?? user.uid}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-5">
            <AppTooltip content={isCameraOn ? 'Tắt Máy ảnh' : 'Bật Máy Ảnh'} asChild>
              <Button
                className={cn('size-14 rounded-full border border-primary')}
                variant={isCameraOn ? 'secondary' : 'default'}
                onClick={() => toggleCamera(!isCameraOn)}
              >
                {isCameraOn ? <Video className="size-6" /> : <VideoOff className="size-6" />}
              </Button>
            </AppTooltip>
            <AppTooltip content={isScreenShareOn ? 'Ngừng Chia Sẻ' : 'Chia Sẻ Màn Hình'} asChild>
              <Button
                className={cn('size-14 rounded-full border border-primary')}
                variant={isScreenShareOn ? 'secondary' : 'default'}
                onClick={() => toggleScreenShare(!isScreenShareOn)}
              >
                {isScreenShareOn ? (
                  <MonitorUp className="size-6" />
                ) : (
                  <MonitorOff className="size-6" />
                )}
              </Button>
            </AppTooltip>
            <AppTooltip content={isMicOn ? 'Tắt Micro' : 'Bật Micro'} asChild>
              <Button
                className={cn('size-14 rounded-full border border-primary')}
                variant={isMicOn ? 'secondary' : 'default'}
                onClick={() => toggleMic(!isMicOn)}
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
