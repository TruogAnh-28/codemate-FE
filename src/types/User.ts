export interface GetAllUsersResponse {
  id: string
  name: string
  email: string
  ms: any
  date_of_birth: any
  status: boolean
  fullname: any
  role: string
}


export interface CreateUserRequest {
  name: string
  fullname: string
  email: string
  date_of_birth: string
  ms: string
  role: string
}

export interface CreateUserResponse {
  name: string
  fullname: string
  email: string
  date_of_birth: string
  mssv?: string
  id: string
  created_at: string
  updated_at: string
  is_email_verified: boolean
  is_active: boolean
  mscb?: string

}

export interface GetProfileResponse {
  id: string
  name: string
  fullname: any
  avatar: any
  email: string
  ms: any
  date_of_birth: any
  role: string
}