import { updateObject } from '../utility'
import * as actionTypes from '../actionTypes/auth'
import { IAuth, IAuthAction } from '../models/auth'

export const initialState: IAuth = {
    token: null,
    email: null,
    username: null,
    error: null,
    loading: false,
    success: null,
    user_profile: null,
    password_change_required: false
}
const authUpdateStart = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        loading: true,
    })
}

const authStart = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        loading: true,
    })
}

const authSuccess = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        error: null,
        token: action.token,
        email: action.email,
        loading: false,
        success: action.success,
        username: action.username,
        user_profile: action.user_profile,
        password_change_required: action.password_change_required
    })
}

const authFail = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    })
}

const authLogout = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        token: null,
        email: null,
        error: null,
        loading: false,
        success: action.success
    })
}
const authLoggedOut = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        token: null,
        email: null,
        error: null,
        loading: false,
        success: null
    })
}
const authUpdateSuccess = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        error: null,
        loading: false,
        success: action.success,
        user_profile: action.user_profile
    })
}
const authClear = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        error: null,
        success: null
    })
}
const authRegisterSuccess = (state: IAuth, action: IAuthAction) => {
    return updateObject(state, {
        success: action.success,
        loading: false
    })
}
const reducer = (state: IAuth, action: IAuthAction): IAuth => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state, action)
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action)
        case actionTypes.AUTH_FAIL:
            return authFail(state, action)
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action)
        case actionTypes.AUTH_LOGGED_OUT:
            return authLoggedOut(state, action)
        case actionTypes.AUTH_UPDATE_SUCCESS:
            return authUpdateSuccess(state, action)
        case actionTypes.AUTH_UPDATE_START:
            return authUpdateStart(state, action)
        case actionTypes.AUTH_REGISTER_SUCCESS:
            return authRegisterSuccess(state, action)
        case actionTypes.AUTH_CLEAR:
            return authClear(state, action)
        default:
            return state
    }
}

export default reducer