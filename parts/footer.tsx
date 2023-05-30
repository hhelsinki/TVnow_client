import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Footer = () => {
    const wishlist = useSelector((state:any) => state.wishlist);
    const [isHomeActive, setHomeActive] = useState<boolean>(false);
    const [isSavedActive, setSavedActive] = useState<boolean>(false);

    useEffect(()=>{
        switch(window.location.pathname) {
            case '/home':
                setHomeActive(!isHomeActive);
                break;
            case '/saved':
                setSavedActive(!isSavedActive);
                break;
            default:
                break;
        }
    }, []);

    return (
        <footer className="footer fixed bg-prim">
            <div className="dp-flex" id='footer-container'>
                <section className="footer-nav">
                    <Link href="/home"><img src={isHomeActive? "../navi/home-active.png": "../navi/home.png"} className="div-center dp-block" /></Link>
                </section>
                <section className="footer-nav">
                    <Link href="/saved"><img src={isSavedActive? "../navi/download-active.png": "../navi/download.png"} className="div-center dp-block" id={wishlist.filled ? 'navi-active': ''}/></Link>
                </section>
                <section className="footer-nav">
                    <Link href="/settings"><img src="../navi/user.png" className="div-center dp-block" /></Link>
                </section>
            </div>
        </footer>
    );
}

export default Footer;
