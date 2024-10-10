import apiClient from './api-client'

export class RoomService {
  public static async createCallToken(): Promise<string> {
    const { data } = await apiClient.post('/test/call')
    return data
  }
}
