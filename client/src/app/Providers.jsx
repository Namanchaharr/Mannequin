import { RouterProvider } from "react-router-dom";
import router from "./router";


// this can have multiple Providers
export default function Providers() {
    return <RouterProvider router={router} />;
}