import { updateObject } from '../utility'
import * as actionTypes from '../actionTypes/household'
import { IHousehold, IHouseholdAction } from '../models/household'

export const initialState: IHousehold = {
    error: null,
    loading: false,
    success: null,
}

const householdStart = (state: IHousehold, action: IHouseholdAction) => {
    return updateObject(state, {
        loading: true,
    })
}
const householdSuccess = (state: IHousehold, action: IHouseholdAction) => {
    return updateObject(state, {
        loading: false,
        success: action.success
    })
}
const householdFail = (state: IHousehold, action: IHouseholdAction) => {
    return updateObject(state, {
        loading: false,
        error: action.error
    })
}

const reducer = (state: IHousehold, action: IHouseholdAction): IHousehold => {
    switch (action.type) {
        case actionTypes.HOUSEHOLD_START:
            return householdStart(state, action)
        case actionTypes.HOUSEHOLD_SUCCESS:
            return householdSuccess(state, action)
        case actionTypes.HOUSEHOLD_FAIL:
            return householdFail(state, action)
        case actionTypes.HOUSEHOLD_CLEAR:
            return initialState
        default:
            return state
    }
}

export default reducer