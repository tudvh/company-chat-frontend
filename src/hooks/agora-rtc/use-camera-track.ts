import { CameraVideoTrackInitConfig, IAgoraRTCClient, useLocalCameraTrack } from 'agora-rtc-react'
import { useCallback, useEffect, useRef } from 'react'

import { displayError } from '@/helpers'

export const useCameraTrack = (
  ready: boolean,
  cameraVideoTrackConfig: CameraVideoTrackInitConfig,
  client: IAgoraRTCClient,
) => {
  const clientRef = useRef<IAgoraRTCClient>(client)
  const { localCameraTrack, isLoading, error } = useLocalCameraTrack(
    ready,
    cameraVideoTrackConfig,
    client,
  )

  const startTrack = useCallback(async () => {
    if (!localCameraTrack || !clientRef.current) return
    try {
      await localCameraTrack.setEnabled(true)
      const localTracks = clientRef.current.localTracks
      const isPublished = localTracks.some(track => track === localCameraTrack)
      if (!isPublished) {
        await clientRef.current.publish(localCameraTrack)
      }
    } catch (error) {
      displayError(error)
      console.error(`Error starting ${localCameraTrack}:`, error)
    }
  }, [localCameraTrack])

  const stopTrack = useCallback(async () => {
    if (!localCameraTrack || !clientRef.current) return
    try {
      await localCameraTrack.setEnabled(false)
      const localTracks = clientRef.current.localTracks
      const isPublished = localTracks.some(track => track === localCameraTrack)
      if (isPublished) {
        await clientRef.current.unpublish(localCameraTrack)
      }
    } catch (error) {
      displayError(error)
      console.error(`Error stopping ${localCameraTrack}:`, error)
    }
  }, [localCameraTrack])

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

  return { localCameraTrack, isLoading, error }
}
