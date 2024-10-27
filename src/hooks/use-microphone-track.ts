import {
  IAgoraRTCClient,
  MicrophoneAudioTrackInitConfig,
  useLocalMicrophoneTrack,
} from 'agora-rtc-react'
import { useCallback, useEffect, useRef } from 'react'

export const useMicrophoneTrack = (
  ready: boolean,
  audioTrackConfig: MicrophoneAudioTrackInitConfig,
  client: IAgoraRTCClient,
) => {
  const clientRef = useRef<IAgoraRTCClient>(client)
  const { localMicrophoneTrack, isLoading, error } = useLocalMicrophoneTrack(
    ready,
    audioTrackConfig,
    client,
  )

  const startTrack = useCallback(async () => {
    if (!localMicrophoneTrack || !clientRef.current) return
    try {
      await localMicrophoneTrack.setEnabled(true)
      const localTracks = clientRef.current.localTracks
      const isPublished = localTracks.some(track => track === localMicrophoneTrack)
      if (!isPublished) {
        await clientRef.current.publish(localMicrophoneTrack)
      }
    } catch (error) {
      console.error(`Error starting ${localMicrophoneTrack}:`, error)
    }
  }, [localMicrophoneTrack])

  const stopTrack = useCallback(async () => {
    if (!localMicrophoneTrack || !clientRef.current) return
    try {
      await localMicrophoneTrack.setEnabled(false)
      const localTracks = clientRef.current.localTracks
      const isPublished = localTracks.some(track => track === localMicrophoneTrack)
      if (isPublished) {
        await clientRef.current.unpublish(localMicrophoneTrack)
      }
    } catch (error) {
      console.error(`Error stopping ${localMicrophoneTrack}:`, error)
    }
  }, [localMicrophoneTrack])

  useEffect(() => {
    if (ready) {
      startTrack()
    } else {
      stopTrack()
    }
  }, [ready, startTrack, stopTrack])

  useEffect(() => {
    return () => {
      stopTrack()
    }
  }, [stopTrack])

  return { localMicrophoneTrack, isLoading, error }
}
