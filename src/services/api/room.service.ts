import { TRoom } from '@/types'
import apiClient from './api-client'

const path = '/rooms'

export class RoomService {
  public static async getRoomDetail(roomId: string): Promise<TRoom> {
    const { data } = await apiClient.get(`${path}/${roomId}`)
    return data
  }

  public static async createCallToken(): Promise<string> {
    const { data } = await apiClient.post('/test/call')
    return data
  }
}
