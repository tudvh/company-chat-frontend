import { CreateGroupPayload, TGroup } from '@/types'
import apiClient from './api-client'

const path = '/groups'

export class GroupService {
  public static async createGroup(payload: CreateGroupPayload): Promise<TGroup> {
    const { data } = await apiClient.post(path, payload)
    return data
  }
}
