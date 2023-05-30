import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Custom404 = () => {
    let router:any = useRouter();

    useEffect(()=>{
        router.push('/login');
    }, []);

    return(
        <></>
    );
}

export default Custom404;