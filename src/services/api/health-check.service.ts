import axios from 'axios'

import { getEnv } from '@/helpers'

const path = '/health'

export class HealthCheckService {
  public static async checkHealth(): Promise<void> {
    await axios.get(`${getEnv('VITE_APP_API_URL')}${path}`)
  }
}
