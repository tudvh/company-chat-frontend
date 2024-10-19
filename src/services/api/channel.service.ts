import { CreateChannelPayload, TChannel, TChannelDetail } from '@/types'
import apiClient from './api-client'

const path = '/channels'

export class ChannelService {
  public static async getMyChannels(): Promise<TChannel[]> {
    const { data } = await apiClient.get(`${path}/my-channels`)
    return data
  }

  public static async createChannel(payload: CreateChannelPayload): Promise<TChannelDetail[]> {
    const { data } = await apiClient.post(path, payload)
    return data
  }
}
