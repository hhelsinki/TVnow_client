import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '/styles/register.module.scss';
import Styled from 'styled-components'
import { API, KEY } from "@/functions/api";
import Cookies from "js-cookie";
import VerificationInput from "react-verification-input";

const Main = Styled.div`
    height: 77vh; overflow-y: hidden;

    @media only screen and (min-height:899px) {
        height: 82vh;
    }
`;

const RegisterVerify = () => {
    const [digit, setDigit] = useState<any>(0);
    const [attn, setAttn] = useState<string>('');
    let user: string = '';
    let token: string = '';
    let router = useRouter();
    let searchParams = useSearchParams();

    const handleSubmit = async () => {
        let user: string = searchParams.get('user');
        let token: string = searchParams.get('token');
        //url client = http://localhost:3000/login-twofac_email?user=${user_email}&token=${user_token}

        const data = {
            email: user,
            id_token: digit,
            timekey_token: token
        }
        const config = {
            method: 'POST',
            url: `${API}/user-twofactor`,
            headers: {
                'api-key': KEY
            },
            data: data
        }
        await axios(config)
            .then((res) => {
                console.log(res.data)
                switch (res.data.status) {
                    case true:
                        Cookies.set('TVnow_Login_Token', res.data.data, { sameSite: 'strict' });
                        router.push('/home');
                        break;
                    case false: default:
                        setAttn(res.data.msg);
                        break;
                }
            })
            .catch((err) => {
                console.log('err: API user-twofactor');
                if (err.response) {
                    if (err.response.status === 405 || err.response.status === 402) {
                        router.push('/login');
                        return;
                    }
                    return;
                }
            })

        return;
    }

    useEffect(() => {
        //Param is Required
        user = (new URLSearchParams(location.search)).get('user');
        token = (new URLSearchParams(location.search)).get('token');


        console.log(user, token)

        if (!user && !token) {
            router.push('/login');
        }

    }, []);

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
                    <h1 className="txt-center">2 Factor Login</h1>

                    <form onSubmit={(e) => e.preventDefault()} className={`${styled['regis__twofac']} padd-default div-center`}>
                        <label className={styled['regis__form-label']}>Enter 6 Digit Code</label><br /><br />
                        <VerificationInput
                            length={6}
                            validChars="0-9"
                            onChange={setDigit}
                            onComplete={handleSubmit}
                            classNames={{
                                character: "twofactor-input"
                            }}
                        />
                    </form>
                    <h5 className="txt-center"><i>Only 3 mistake is allowed.</i></h5>
                    <h3 className="txt-center col-red">{attn}</h3>
                </section>
                <section className="div-ghost"></section>
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

export default RegisterVerify;
