import {
  LocalUser,
  LocalVideoTrack,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  usePublish,
  useRemoteUsers,
  useRemoteVideoTracks,
  useRTCScreenShareClient,
} from 'agora-rtc-react'
import { Mic, MicOff, MonitorUp, Phone, PhoneOff, Video, VideoOff } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui'
import { useLoading } from '@/contexts'
import { displayError, getEnv } from '@/helpers'
import { RoomService } from '@/services/api'

export const CallRoomPage = () => {
  const { showLoading, hideLoading } = useLoading()
  const [calling, setCalling] = useState(false)
  const [token, setToken] = useState('')
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicOn)
  const { screenTrack, error } = useLocalScreenTrack(true,{
    encoderConfig:"1080p_2",
  },"disable")
  const { localCameraTrack } = useLocalCameraTrack(isCameraOn)
  const channel = 'main'
  const isConnected = useIsConnected()
  const remoteUsers = useRemoteUsers()


  const myProfile = useJoin(
    { appid: getEnv('VITE_AGORA_APP_ID'), channel, token: token || null },
    calling,
  )
  usePublish([localMicrophoneTrack, localCameraTrack, screenTrack])

  const createCallToken = async () => {
    try {
      showLoading()
      const token = await RoomService.createCallToken()
      setToken(token)
      setCalling(true)
    } catch (error: any) {
      displayError(error)
    } finally {
      hideLoading()
    }
  }
  useEffect(()=>{
    console.log({error})
  },[error])
 
  useEffect(()=>{
    console.log({error})
    console.log({myProfile})
    console.log({remoteUsers})
  },[remoteUsers])

  useEffect(() => {
    createCallToken()

    return () => {
      setCalling(false)
    }
  }, [])

  return (
    <div className="relative flex size-full items-center justify-center bg-primary p-5 text-primary-foreground">
      {isConnected ? (
        <>
          <div className="flex flex-wrap justify-center gap-5">
            <div className="h-fit space-y-5 text-center">
              <div className="aspect-video w-[300px] overflow-hidden rounded-xl shadow">
                <LocalUser
                  playAudio={false}
                  cameraOn={isCameraOn}
                  micOn={isMicOn}
                  // videoTrack={screenTrack} 
                  // playVideo
                  
                  cover="https://images2.thanhnien.vn/528068263637045248/2023/4/23/edit-truc-anh-16822518118551137084698.png"
                />
                <h1>ss</h1>
              </div>
                <LocalVideoTrack play style={{ width: "300px", height: "300px" }} track={screenTrack} />
              <p>{myProfile.data}</p>
            </div>
            {remoteUsers.map(user => (
              <div className="h-fit space-y-5 text-center" key={user.uid}>
                <div className="aspect-video w-[300px] overflow-hidden rounded-xl shadow">
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
            <Button className="size-14 rounded-full" variant="secondary">
              <MonitorUp className="size-6" />
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
