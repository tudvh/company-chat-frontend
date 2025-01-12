import { PermissionEnum } from '@/enums'
import {
  CreateChannelPayload,
  JoinChannelPayload,
  TChannel,
  TChannelDetail,
  TChannelInvite,
  TRoleUser,
} from '@/types'
import apiClient from './api-client'

const path = '/channels'

export class ChannelService {
  public static async getChannels(): Promise<TChannel[]> {
    const { data } = await apiClient.get(`${path}`)
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

  public static async getChannelDetail(channelId: string): Promise<TChannelDetail> {
    const { data } = await apiClient.get(`${path}/${channelId}`)
    return data
  }

  public static async joinChannel(payload: JoinChannelPayload): Promise<TChannelDetail> {
    const { data } = await apiClient.post(`${path}/join`, payload)
    return data
  }

  public static async getInviteCode(channelId: string): Promise<TChannelInvite> {
    const { data } = await apiClient.get(`${path}/${channelId}/invite`)
    return data
  }

  public static async leaveChannel(channelId: string): Promise<void> {
    await apiClient.post(`${path}/${channelId}/leave`)
  }

  public static async updateInfo(channelId: string, payload: any): Promise<void> {
    const { data } = await apiClient.post(`${path}/${channelId}/update`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }

  public static async getChannelUsers(channelId: string): Promise<TRoleUser[]> {
    const { data } = await apiClient.get(`${path}/${channelId}/users`)
    return data
  }

  public static async getChannelUserPermissions(channelId: string): Promise<PermissionEnum[]> {
    const { data } = await apiClient.get(`${path}/${channelId}/user-permissions`)
    return data
  }

  public static async removeUser(channelId: string, userId: string): Promise<void> {
    await apiClient.delete(`${path}/${channelId}/users/${userId}`)
  }
}
