export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  HOME: '/',
  CHANNEL: '/channels/:channelId',
  CHANNEL_JOIN: '/channels/join/:code',
  CHANNEL_SETTING: {
    INDEX: '/channels/:channelId/settings/index',
    ROLE: {
      INDEX: '/channels/:channelId/settings/roles',
      CREATE: '/channels/:channelId/settings/roles/create',
      UPDATE: '/channels/:channelId/settings/roles/:channelRoleId',
    },
    USER: '/channels/:channelId/settings/users',
  },
  ROOM: '/channels/:channelId/:roomId',
}
