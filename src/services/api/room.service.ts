import { CreateRoomPayload, TCallInfo, TRoom } from '@/types'
import apiClient from './api-client'

const path = '/rooms'

export class RoomService {
  public static async getRoomDetail(roomId: string): Promise<TRoom> {
    const { data } = await apiClient.get(`${path}/${roomId}`)
    return data
  }

  public static async getCallInfo(roomId: string): Promise<TCallInfo> {
    const { data } = await apiClient.post(`${path}/${roomId}/call-info`)
    return data
  }

  public static async createRoom(payload: CreateRoomPayload): Promise<TRoom> {
    const { data } = await apiClient.post(path, payload)
    return data
  }
}
