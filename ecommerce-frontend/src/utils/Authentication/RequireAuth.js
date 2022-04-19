import React from "react";
import { Navigate } from "react-router";
import { getLocalToken } from './token-auth';


export const RequireAuth = ({children}) => {

    return (
        getLocalToken() === null ?
        <Navigate to="/" /> :
        children
    );
};