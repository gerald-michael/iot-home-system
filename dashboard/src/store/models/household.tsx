export interface IHousehold {
    error: string | null,
    loading: boolean,
    success: string | null,
}

export interface IHouseholdAction {
    type: string,
    error: string | null,
    success: string | null,
}