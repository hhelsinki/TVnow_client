import Footer from "@/parts/footer";
import Header from "@/parts/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Shows = () => {
    let router = useRouter();

    useEffect(() => {
        router.push('/show');
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