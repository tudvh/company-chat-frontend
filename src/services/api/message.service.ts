import { GetAllMessagesByRoomParams, TMessage } from '@/types'
import apiClient from './api-client'

const path = '/messages'

export class MessageService {
  public static async getAllMessagesByRoom(
    params: GetAllMessagesByRoomParams,
  ): Promise<TMessage[]> {
    const { data } = await apiClient.get(`${path}/get-by-room`, { params })
    return data
  }

  public static async sendMessage(payload: FormData): Promise<void> {
    await apiClient.post(path, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}
