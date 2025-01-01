import { IAgoraRTCClient, ScreenVideoTrackInitConfig, useLocalScreenTrack } from 'agora-rtc-react'
import { Dispatch, useCallback, useEffect, useRef } from 'react'

import { displayError } from '@/helpers'

export const useScreenShareTrack = (
  ready: boolean,
  setReady: Dispatch<React.SetStateAction<boolean>>,
  screenVideoTrackInitConfig: ScreenVideoTrackInitConfig,
  client: IAgoraRTCClient,
) => {
  const clientRef = useRef<IAgoraRTCClient>(client)
  const { screenTrack, isLoading, error } = useLocalScreenTrack(
    ready,
    {
      encoderConfig: '1080p_2',
      ...screenVideoTrackInitConfig,
    },
    'disable',
    client,
  )

  const startTrack = useCallback(async () => {
    if (!screenTrack || !clientRef.current) return
    try {
      const localTracks = clientRef.current.localTracks
      const isPublished = localTracks.some(track => track === screenTrack)
      if (!isPublished) {
        await clientRef.current.publish(screenTrack)
      }
    } catch (error) {
      displayError(error)
      console.error(`Error starting ${screenTrack}:`, error)
    }
  }, [screenTrack])

  const stopTrack = useCallback(async () => {
    if (!screenTrack || !clientRef.current) return
    try {
      const localTracks = clientRef.current.localTracks
      const isPublished = localTracks.some(track => track === screenTrack)
      if (isPublished) {
        await clientRef.current.unpublish(screenTrack)
        screenTrack.close()
      }
    } catch (error) {
      displayError(error)
      console.error(`Error stopping ${screenTrack}:`, error)
    }
  }, [screenTrack])

  useEffect(() => {
    if (!screenTrack) return
    const mediaStreamTrack = screenTrack.getMediaStreamTrack()
    const handleEnded = () => {
      stopTrack()
      setReady(false)
    }
    mediaStreamTrack.addEventListener('ended', handleEnded)

    return () => {
      mediaStreamTrack.removeEventListener('ended', handleEnded)
    }
  }, [screenTrack, stopTrack])

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

  return { screenTrack, isLoading, error }
}
