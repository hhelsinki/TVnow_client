import Footer from "@/parts/footer";
import Header from "@/parts/header";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Shows = () => {
    let router = useRouter();

    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }

        Cookies.set('TVnow oldPath', window.location.pathname, { sameSite: 'strict' });
    }, []);


    return (
        <>
            <Header />
            <main className="main">
            </main>
            <Footer />
        </>
    );
}

export default Shows;