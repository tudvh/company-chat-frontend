import { CreateChannelPayload, TChannel, TChannelDetail } from '@/types'
import apiClient from './api-client'

const path = '/channels'

export class ChannelService {
  public static async getJointedChannels(): Promise<TChannel[]> {
    const { data } = await apiClient.get(`${path}/jointed`)
    return data
  }

  public static async createChannel(payload: CreateChannelPayload): Promise<TChannelDetail> {
    const { data } = await apiClient.post(path, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }

  public static async getJointedChannelDetail(channelId: string): Promise<TChannelDetail> {
    const { data } = await apiClient.get(`${path}/jointed/${channelId}`)
    return data
  }
}
