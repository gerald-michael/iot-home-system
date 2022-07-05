import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { createContext, useContext } from 'react'
import useSWR from 'swr';
import { HOST_URL } from '../../config/settings';

type Permission = string;
type PermissionContextValue = {
    permissions: Permission[],
};
export const PermissionContext = createContext<PermissionContextValue | null>(null);
export const usePermissions = () => {
    const permissionContext = useContext(PermissionContext)
    if (permissionContext === null) {
        throw new Error('usePermissions must be inside of PermissionsProvider');
    }
    return permissionContext;
}
const token = localStorage.getItem('token')?.toString()
const fetcher = (url: string) => fetch(url, {
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Authorization': 'Token ' + token
    }
}).then(res => res.json())
interface PermissionProviderProps {
    children: ReactNode
}
export const PermissionProvider = ({ children }: PermissionProviderProps) => {
    const [permissions, setPermissions] = useState([])
    const { data } = useSWR(`${HOST_URL}accounts/permissions/`, fetcher)
    useEffect(() => {
        if (data) {
            setPermissions(data)
        }
    }, [data])
    const value = useMemo(() => {
        return { permissions }
    }, [permissions]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    )
}

interface CanProps {
    permissions?: Permission | Permission[],
    children: ReactNode
}

const checkMatch = (userPermissions: Permission[], canProps: CanProps) => {
    let match = false;
    const { permissions = [] } = canProps
    const permissionsArr = Array.isArray(permissions) ? permissions : [permissions]
    if (permissionsArr.length === 0) {
        match = true;
    } else {
        match = permissionsArr.some(p => userPermissions.includes(p));
    }
    return match;
}

// checks whether the user has the permission/s
export const Can = (props: CanProps) => {
    const { children } = props
    const { permissions: userPermissions } = usePermissions();
    const match = checkMatch(userPermissions, props);

    if (match) {
        return <>{children}</>;
    } else {
        return null;
    }
};

// show a different component basing on the users permissions
interface SwitchProps {
    children: ReactNode
}
export const Switch = (props: SwitchProps) => {
    const { children } = props
    const { permissions: userPermissions } = usePermissions();

    let element: React.ReactNode = null;
    let match = false;
    React.Children.forEach(children, child => {
        if (!match && React.isValidElement(child) && child.type === Can) {
            element = child;
            match = checkMatch(userPermissions, (child.props as CanProps));
        }
    });

    return match ? element : null;
}
