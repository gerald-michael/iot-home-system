import { useReducer, createContext } from 'react'
import reducer, { initialState } from '../reducers/household'
import axios from 'axios'
import * as actionTypes from '../actionTypes/household'
import { IHousehold, IHouseholdAction } from '../models/household'
import { HOST_URL } from '../../config/settings'
import { sentenceCase } from 'change-case'

export const HouseholdContext = createContext<IHousehold | any>(initialState)
interface Props {
    children: JSX.Element | JSX.Element[]
}
const HouseholdContextProvider = (props: Props): JSX.Element => {
    const [household, householdDispatch] = useReducer(reducer, initialState)
    const householdStart = (): IHouseholdAction => {
        return {
            error: null,
            type: actionTypes.HOUSEHOLD_START,
            success: null,
        }
    }
    const householdFail = (error: string): IHouseholdAction => {
        return {
            error,
            type: actionTypes.HOUSEHOLD_FAIL,
            success: null,
        }
    }
    const householdSuccess = (success: string): IHouseholdAction => {
        return {
            error: null,
            type: actionTypes.HOUSEHOLD_SUCCESS,
            success,
        }
    }
    const householdClear = (): IHouseholdAction => {
        return {
            error: null,
            type: actionTypes.HOUSEHOLD_CLEAR,
            success: null,
        }
    }
    const createHousehold = (name: string, email: string, phone_number: string, address: string, lat: number, long: number, description: string, is_active: boolean) => {
        householdDispatch(householdStart())
        const token = localStorage.getItem('token')?.toString()
        if (token) {
            const config = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Authorization': 'Token ' + token
                }
            }
            axios.post(`${HOST_URL}household/`, { name, email, lat, long, address, phone_number, description, is_active, }, config).then((_) => {
                householdDispatch(householdSuccess("Created Successfully"))
            }).catch((err) => {
                console.log(err.response)
                const errors: any = Object.values(err.response.data)
                householdDispatch(householdFail(sentenceCase(errors[0])))
            })
        } else {
            householdDispatch(householdFail("You have to be logged in"))
        }
    }
    const clear = () => {
        householdDispatch(householdClear())
    }
    return (
        <HouseholdContext.Provider value={{ household, createHousehold, clear }}>
            {props.children}
        </HouseholdContext.Provider>
    );
}

export default HouseholdContextProvider