import Header from "./Header";
import { Outlet } from "react-router";
import Footer from "./Footer";
const AppLayout = () => {
    console.log('AppLayout');
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}
export default AppLayout;