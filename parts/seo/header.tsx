import { toggleLogin } from "@/redux/loginSeo/loginSeoSlice";
import { useDispatch } from "react-redux";

const HeaderSEO = () => {
    let dispatch = useDispatch<any>();

    return (
        <header className="header rel">
            <div className="div-content div-center">
                <div className="dp-flex">
                    <section className="header-nav">
                        <span className="abs font-m font-bold col-grey-dark">TVnow</span>
                    </section>
                    <section className="header-nav">
                        <img onClick={() => dispatch(toggleLogin())} src="../navi/search.png" className="abs cursor" />
                    </section>
                </div>
            </div>
        </header>
    );
}

export default HeaderSEO;