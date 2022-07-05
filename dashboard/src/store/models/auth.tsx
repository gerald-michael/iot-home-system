export interface UserProfile {
    firstname: string | null,
    lastname: string | null,
    phone_number: string | null,
    image: string | null
}
export interface User {
    token: string | null,
    email: string | null,
    username: string | null,
    user_profile: UserProfile | null,
    password_change_required: boolean
}
export interface IAuth extends User {
    error: string | null,
    loading: boolean,
    success: string | null,
}

export interface IAuthAction extends User {
    type: string,
    error: string | null,
    success: string | null,
}