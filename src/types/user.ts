export type TUserProfile = {
  id: string
  fullName: string
  dob: string | null
  gender: number | null
  phoneNumber: string | null
  avatarPublicId: string | null
  avatarUrl: string | null
  email: string
  googleId: string
  type: number
}

export type TMessageUser = {
  id: string
  fullName: string
  avatarUrl: string | null
}

export type TRoleUser = {
  id: string
  fullName: string
  avatarUrl: string | null
  isCreator?: boolean
}
