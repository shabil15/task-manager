import { lazy } from "react";
import { RouteObject } from 'react-router-dom';


const Test  = lazy(()=>import("../pages/TestingPage"))


const publicRoutes:RouteObject[]=[
    {
        id:"root",
        path:"/",
        Component:Test
    }
]

export default publicRoutes;