import Footer from "@/parts/footer";
import Header from "@/parts/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Movies = () => {
    let router = useRouter();

    useEffect(() => {
        router.push('/movie');
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

export default Movies;