import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import styled from '/styles/register.module.scss';
import Styled from 'styled-components'
import { baseKeyApi } from "@/functions/api";
import RegisButtonSubmit from "@/common/regis_button_submit";
import { API } from "@/functions/api";
import Loading from "@/common/Loading";

const Main = Styled.div`
    height: 77vh; overflow-y: hidden;

    @media only screen and (min-height:899px) {
        height: 82vh;
    }
`;

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
    //const [isDisableButt, setDisableButt] = useState<boolean>(true);
    const [isSubmitDisable, setSubmitDisable] = useState<boolean>(false);
    const [attn, setAttn] = useState<string>('');
    let router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitLoading(!isSubmitLoading);
        setSubmitDisable(true);

        const data = {
            email: email
        }
        const config = {
            method: 'POST',
            url: `${API}/user-password_forgot`,
            headers: {
                api_key: baseKeyApi
            },
            data: data
        }
        axios(config)
            .then((res) => {
                console.log(res.data)
                switch (res.data.status) {
                    case true:
                        setAttn(res.data.msg);
                        router.push('/login');
                        break;
                    default:
                        setAttn(res.data.msg);
                        setSubmitLoading(false);
                        setSubmitDisable(true);
                        setTimeout(()=> {setSubmitDisable(false);}, 5000);
                        break;
                }
            })
            .catch((err) => {
                console.log('err: API user-password');
                if (err.response.status === 401 || err.response.status === 402) {
                    router.push('/login');
                }
            })
    }

    return (
        <div className="bg-white col-black">
            <header className={`${styled['regis__header']} bg-grey`}>
                <div className="rel div-content div-center">
                    <a href='/' className={styled["regis__btn-logo"]}>TVnow</a>
                    <a href='login' className={`abs ${styled['regis__btn-login']}`}>Sign In</a>
                </div>
            </header>

            <Main>
                <section className={`rel ${styled['regis__motion']} div-center bg-white`}>
                    <h1 className="txt-center">Forgot Password</h1>

                    <form onSubmit={handleSubmit} className={styled['regis__form']}>
                        <label className={styled['regis__form-label']}>Enter Your Email</label><br />
                        <input type="email" onChange={(e) => setEmail(e.target.value)} className={styled['regis__form-input']} required /><br />

                        <RegisButtonSubmit isDisable={isSubmitDisable} />
                    </form>
                    <h3 className="txt-center col-red">{attn}</h3>
                </section>
                <section className="div-ghost"></section>
                {isSubmitLoading && (<Loading/>)}
            </Main>
            <footer className={`${styled['regis__footer']} font-ss bg-grey`}>
                <ul className="txt-center col-grey-dark" style={{ paddingTop: '.5rem' }}>
                    <li>Privacy Policy</li>
                    <li>Terms of Use</li>
                    <li>Do Not Sell My Personal Information</li>
                    <a href='/'><li>© 2022 TVnow</li></a>
                </ul>
            </footer>
        </div>
    );
}

export default ForgotPassword;
