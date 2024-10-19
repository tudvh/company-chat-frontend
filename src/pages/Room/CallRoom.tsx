import {
  LocalUser,
  LocalVideoTrack,
  RemoteUser,
  RemoteVideoTrack,
  useIsConnected,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  usePublish,
  useRemoteUsers,
  useRemoteVideoTracks,
} from 'agora-rtc-react'
import { Mic, MicOff, MonitorOff, MonitorUp, Phone, PhoneOff, Video, VideoOff } from 'lucide-react'
import { useEffect, useState } from 'react'

import { UserAvatarDefault } from '@/assets/images'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts'
import { displayError, getEnv } from '@/helpers'
import { RoomService } from '@/services/api'

export const CallRoomPage = () => {
  const [calling, setCalling] = useState(false)
  const [token, setToken] = useState('')
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isScreenShareOn, setIsScreenShareOn] = useState(false)
  const { userProfile } = useAuth()
  const channel = 'main'
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicOn)
  const { localCameraTrack } = useLocalCameraTrack(isCameraOn)
  const {
    screenTrack: localScreenTrack,
    error: screenTrackError,
    isLoading: isLoadingScreenTrack,
  } = useLocalScreenTrack(
    isScreenShareOn,
    {
      encoderConfig: '1080p_2',
    },
    'disable',
  )
  const isConnected = useIsConnected()
  const remoteUsers = useRemoteUsers()
  const { videoTracks: remoteVideoTracks } = useRemoteVideoTracks(remoteUsers)
  const myProfile = useJoin(
    {
      appid: getEnv('VITE_AGORA_APP_ID'),
      channel,
      token: token || null,
      uid: userProfile?.id,
    },
    calling,
  )
  usePublish([localMicrophoneTrack, localCameraTrack, localScreenTrack])

  const createCallToken = async () => {
    try {
      const token = await RoomService.createCallToken()
      setToken(token)
      setCalling(true)
    } catch (error: any) {
      displayError(error)
    }
  }

  useEffect(() => {
    if (isMicOn) {
      localMicrophoneTrack?.setEnabled(true)
    } else {
      localMicrophoneTrack?.setEnabled(false)
    }
  }, [isMicOn])

  useEffect(() => {
    if (isCameraOn) {
      localCameraTrack?.setEnabled(true)
    } else {
      localCameraTrack?.setEnabled(false)
    }
  }, [isCameraOn])

  useEffect(() => {
    if (isScreenShareOn) {
      localScreenTrack?.setEnabled(true)
    } else {
      localScreenTrack?.setEnabled(false)
      localScreenTrack?.on('track-ended', () => {
        setIsScreenShareOn(false)
      })
    }
  }, [isScreenShareOn])

  useEffect(() => {
    createCallToken()

    return () => {
      setCalling(false)
    }
  }, [])

  useEffect(() => {
    if (screenTrackError) {
      setIsScreenShareOn(false)
    }
  }, [screenTrackError])

  return (
    <div className="relative flex size-full items-center justify-center bg-primary p-5 text-primary-foreground">
      {isConnected ? (
        <>
          <div className="flex flex-wrap justify-center gap-5">
            {isScreenShareOn && !isLoadingScreenTrack && (
              <div className="h-fit space-y-4 text-center">
                <div className="aspect-video w-[300px] overflow-hidden rounded-xl border shadow">
                  <LocalVideoTrack play track={localScreenTrack} />
                </div>
                <p>{userProfile?.fullName}</p>
              </div>
            )}
            {remoteVideoTracks.map(videoTrack => (
              <div className="h-fit space-y-4 text-center" key={videoTrack.getUserId()}>
                <div className="aspect-video w-[300px] overflow-hidden rounded-xl border shadow">
                  <RemoteVideoTrack play track={videoTrack} />
                </div>
                <p>{videoTrack.getUserId()}</p>
              </div>
            ))}
            <div className="h-fit space-y-4 text-center">
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
              <div className="h-fit space-y-4 text-center" key={user.uid}>
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
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-5">
            <Button
              className="size-14 rounded-full"
              variant="secondary"
              onClick={() => setIsCameraOn(prev => !prev)}
            >
              {isCameraOn ? <Video className="size-6" /> : <VideoOff className="size-6" />}
            </Button>
            <Button
              className="size-14 rounded-full"
              variant="secondary"
              onClick={() => setIsScreenShareOn(prev => !prev)}
            >
              {isScreenShareOn ? (
                <MonitorOff className="size-6" />
              ) : (
                <MonitorUp className="size-6" />
              )}
            </Button>
            <Button
              className="size-14 rounded-full"
              variant="secondary"
              onClick={() => setIsMicOn(prev => !prev)}
            >
              {isMicOn ? <Mic className="size-6" /> : <MicOff className="size-6" />}
            </Button>
            <Button
              className="size-14 rounded-full"
              variant="secondary"
              onClick={() => setCalling(prev => !prev)}
            >
              {calling ? <Phone /> : <PhoneOff />}
            </Button>
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
