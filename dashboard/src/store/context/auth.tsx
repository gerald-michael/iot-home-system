import { useReducer, createContext } from 'react'
import reducer, { initialState } from '../reducers/auth'
import axios from 'axios'
import * as actionTypes from '../actionTypes/auth'
import { IAuth, IAuthAction, UserProfile } from '../models/auth'
import { REGISTER_URL, LOGIN_URL, HOST_URL } from '../../config/settings'

export const AuthContext = createContext<IAuth | any>(initialState);

const AuthContextProvider = (props: any): JSX.Element => {

    const [auth, authDispatch] = useReducer(reducer, initialState)

    const authStart = (): IAuthAction => {
        return {
            type: actionTypes.AUTH_START,
            error: null,
            token: null,
            email: null,
            username: null,
            success: null,
            user_profile: null,
            password_change_required: false
        }
    }

    const authSuccess = (email: string, username: string, token: string, success: string, user_profile: UserProfile, password_change_required: boolean): IAuthAction => {
        return {
            type: actionTypes.AUTH_SUCCESS,
            token,
            email,
            username,
            error: null,
            success,
            user_profile,
            password_change_required
        }
    }
    const authUpdateStart = (): IAuthAction => {
        return {
            type: actionTypes.AUTH_UPDATE_START,
            token: null,
            email: null,
            username: null,
            error: null,
            success: null,
            user_profile: null,
            password_change_required: false
        }
    }
    const authUpdateSuccess = (success: string, user_profile: UserProfile): IAuthAction => {
        return {
            type: actionTypes.AUTH_UPDATE_SUCCESS,
            token: null,
            email: null,
            username: null,
            error: null,
            success,
            user_profile,
            password_change_required: false
        }
    }
    const authRegisterSuccess = (success: string): IAuthAction => {
        return {
            type: actionTypes.AUTH_REGISTER_SUCCESS,
            token: null,
            email: null,
            username: null,
            error: null,
            success,
            user_profile: null,
            password_change_required: false
        }
    }
    const authFail = (error: string): IAuthAction => {
        return {
            type: actionTypes.AUTH_FAIL,
            error,
            username: null,
            email: null,
            token: null,
            success: null,
            user_profile: null,
            password_change_required: false
        }
    }
    const authClear = (): IAuthAction => {
        return {
            type: actionTypes.AUTH_CLEAR,
            error: null,
            username: null,
            email: null,
            token: null,
            success: null,
            user_profile: null,
            password_change_required: false
        }
    }
    const authLogoutSuccess = (success: string): IAuthAction => {
        return {
            type: actionTypes.AUTH_LOGOUT,
            email: null,
            error: null,
            token: null,
            username: null,
            success,
            user_profile: null,
            password_change_required: false
        }
    }
    const authLoggedOut = (): IAuthAction => {
        return {
            type: actionTypes.AUTH_LOGGED_OUT,
            email: null,
            error: null,
            token: null,
            username: null,
            success: null,
            user_profile: null,
            password_change_required: false
        }
    }
    const login = (email: string, password: string) => {
        authDispatch(authStart())
        axios.post(`${LOGIN_URL}`, {
            email: email,
            password: password
        }).then(res => {
            localStorage.setItem("token", res.data.key)
            localStorage.setItem('email', email)
            localStorage.setItem('username', res.data.user.username)
            localStorage.setItem('user_profile', JSON.stringify(res.data.user.user_profile))
            localStorage.setItem('password_change_required', res.data.password_change_required)
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('expirationDate', expirationDate.toISOString());
            authDispatch(
                authSuccess(
                    email,
                    res.data.user.username,
                    res.data.key,
                    "Logged In Successfully",
                    res.data.user.user_profile,
                    res.data.password_change_required
                )
            )
            checkAuthTimeout(3600)
        }).catch(err => {
            if (err.response.data['detail']) {
                authDispatch(authFail(err.response.data['detail']))
            } else {
                const errors: any = Object.values(err.response.data)[0]
                authDispatch(authFail(errors[0]))
            }
        })
    }
    const register = (email: string, username: string, password1: string, password2: string) => {
        authDispatch(authStart())
        const token = localStorage.getItem('token')?.toString()
        if (token) {
            const config = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Token ' + token
                }
            }
            axios.post(`${REGISTER_URL}`, {
                email,
                password1,
                password2,
                username
            }, config).then(res => {
                authDispatch(authRegisterSuccess("User Registered Successfully"))

            }).catch(err => {
                const errors: any = Object.values(err.response.data)[0]
                authDispatch(authFail(errors[0]))
            })
        } else {
            authDispatch(authFail("You have to be logged in"))
        }
    }
    const changePassword = (old_password: string, password1: string, password2: string) => {
        authDispatch(authUpdateStart())
        const token = localStorage.getItem('token')?.toString()
        if (token) {
            const config = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Token ' + token
                }
            }
            axios.post(`${HOST_URL}accounts/auth/password/change/`, {
                old_password,
                password1,
                password2
            }, config).then(res => {
                authDispatch(authRegisterSuccess("Password Changed Successfully"))
                logout()

            }).catch(err => {
                const errors: any = Object.values(err.response.data)[0]
                authDispatch(authFail(errors[0]))
            })
        } else {
            authDispatch(authFail("You have to be logged in"))
        }
    }
    const updateProfile = (firstname: string, lastname: string, phone_number: string, images: any) => {
        authDispatch(authUpdateStart())
        const token = localStorage.getItem('token')?.toString()
        if (token) {
            const config = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Token ' + token
                }
            }
            const form = new FormData()
            form.append("firstname", firstname)
            form.append("lastname", lastname)
            form.append("phone_number", phone_number)
            if (images.length > 0) {
                form.append("image", images[0].file)
            }
            axios.post(`${HOST_URL}accounts/profile/`, form, config).then(res => {
                const user_profile: UserProfile = {
                    firstname,
                    lastname,
                    phone_number,
                    image: res.data.image
                }
                localStorage.setItem('user_profile', JSON.stringify(user_profile))
                authDispatch(authUpdateSuccess("Profile Updated Successfully", user_profile))

            }).catch(err => {
                const errors: any = Object.values(err.response.data)[0]
                authDispatch(authFail(errors[0]))
            })
        } else {
            authDispatch(authFail("You have to be logged in"))
        }
    }
    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('username')
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('user_profile')
        axios.post(`${HOST_URL}accounts/auth/logout/`).then(res => {
            authDispatch(authLogoutSuccess("Logged Out Successfully"))
        }).catch(err => {
            authDispatch(authFail("Failed to logout"))
        })
    }
    const checkAuthTimeout = (expirationTime: number) => {
        return (authDispatch: any) => {
            setTimeout(() => {
                authDispatch(logout())
            }, expirationTime * 1000)
        }
    }
    const authCheckState = () => {
        authDispatch(authStart())
        const token: string = localStorage.getItem("token")?.toString()!
        const email: string = localStorage.getItem('email')?.toString()!
        const username: string = localStorage.getItem('username')?.toString()!
        const user_profile: UserProfile = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('user_profile'))))
        const password_change_required: boolean = (localStorage.getItem('password_change_required')!) === 'true'
        if (token === undefined) {
            authDispatch(authLoggedOut())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate')!);
            if (expirationDate <= new Date()) {
                logout()
            } else {
                authDispatch(
                    authSuccess(
                        email,
                        username,
                        token,
                        "Welcome Back",
                        user_profile,
                        password_change_required
                    )
                )
                checkAuthTimeout(3600)
            }
        }
    }
    const clear = () => {
        authDispatch(authClear())
    }

    return (
        <AuthContext.Provider value={{ auth, clear, login, register, changePassword, logout, authCheckState, updateProfile }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider