import { toggleLogin } from "@/redux/loginSeo/loginSeoSlice";
import { useDispatch } from "react-redux";

const FooterSEO = () => {
    let dispatch = useDispatch();

    return (
        <footer className="footer fixed bg-prim">
            <div className="dp-flex" id='footer-container'>
                <section className="footer-nav">
                    <img src="../navi/home.png" onClick={()=>dispatch(toggleLogin())} className="div-center dp-block cursor" />
                </section>
                <section className="footer-nav">
                   <img src="../navi/download.png" onClick={()=>dispatch(toggleLogin())} className="div-center dp-block cursor"/>
                </section>
                <section className="footer-nav">
                    <img src="../navi/user.png" onClick={()=>dispatch(toggleLogin())} className="div-center dp-block cursor" />
                </section>
            </div>
        </footer>
    );
}

export default FooterSEO;
