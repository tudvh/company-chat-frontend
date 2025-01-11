import { PermissionEnum } from '@/enums'
import {
  CreateChannelRolePayload,
  GetChannelRolesRequest,
  TChannelRole,
  TChannelRoleDetail,
  UpdateChannelRolePermissionsPayload,
} from '@/types'
import apiClient from './api-client'

const path = '/channel-roles'

export class ChannelRoleService {
  public static async getByChannel(params: GetChannelRolesRequest): Promise<TChannelRole[]> {
    const { data } = await apiClient.get(path, { params })
    return data
  }

  public static async getById(id: string): Promise<TChannelRoleDetail> {
    const { data } = await apiClient.get(`${path}/${id}`)
    return data
  }

  public static async create(payload: CreateChannelRolePayload): Promise<TChannelRole> {
    const { data } = await apiClient.post(path, payload)
    return data
  }

  public static async update(id: string, payload: CreateChannelRolePayload): Promise<void> {
    await apiClient.put(`${path}/${id}`, payload)
  }

  public static async getPermissions(id: string): Promise<PermissionEnum[]> {
    const { data } = await apiClient.get(`${path}/${id}/permissions`)
    return data
  }

  public static async updatePermissions(
    id: string,
    payload: UpdateChannelRolePermissionsPayload,
  ): Promise<void> {
    await apiClient.put(`${path}/${id}/permissions`, payload)
  }

  public static async getUsers(id: string): Promise<string[]> {
    const { data } = await apiClient.get(`${path}/${id}/users`)
    return data
  }

  public static async addUsers(id: string, userId: string): Promise<void> {
    await apiClient.post(`${path}/${id}/users/${userId}`)
  }

  public static async removeUsers(id: string, userId: string): Promise<void> {
    await apiClient.delete(`${path}/${id}/users/${userId}`)
  }
}
