import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import styled from '/styles/register.module.scss';
import Styled from 'styled-components'
import { API, KEY } from "@/functions/api";
import Loading from "@/common/Loading";

const Main = Styled.div`
    height: 77vh; overflow-y: hidden;

    @media only screen and (min-height:899px) {
        height: 82vh;
    }
`;

interface Process {
    title: string,
    msg: string
}

const RegisterVerify = () => {
    const router = useRouter();
    const [process, setProcess] = useState<Process>({
        title: 'Please wait a minute...',
        msg: ''
    });
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let user: string = (new URLSearchParams(window.location.search)).get('user');
        let token: string = (new URLSearchParams(window.location.search)).get('token');

        if (!user && !token) {
            router.push('/login');
        }
        //url client = https://client/register-verify?user=user&token=token
        const handleToken = async () => {
            const config = {
                method: 'POST',
                url: `${API}/regis-activate?user=${user}&token=${token}`,
                headers: {
                    'api-key': KEY
                }
            }

            axios(config)
                .then((res) => {
                    //console.log(res.data);
                    setLoading(!isLoading);
                    switch (res.data.status) {
                        case true:
                            setProcess({ title: 'Congratulations ✅️', msg: 'Now you can login page.' });
                            sessionStorage.clear();
                            router.push('/login');
                            break;
                        case false: default:
                            setProcess({ title: 'Oops.. Something\'s wrong', msg: 'Invalid Token, if you open this link from your email, your link might be a mistake. (This is a rare event)' });
                            break;
                    }
                })
                .catch((err) => { setLoading(!isLoading); console.log('err: API regis-activate'); })

        }
        handleToken();
    }, [])

    return (
        <div className="bg-white col-black">
            <header className={`${styled['regis__header']} bg-grey`}>
                <div className="rel div-content div-center">
                    <a href='/' className={styled["regis__btn-logo"]}>TVnow</a>
                    <a href='login' className={`abs ${styled['regis__btn-login']}`}>Sign In</a>
                </div>
            </header>

            <Main>
                <section className='regis__plan-content div-center padd-default'>
                    <h1 className="txt-center" style={{ marginTop: '3rem' }}>{process.title}</h1>
                    <p className="txt-s txt-center">{process.msg}</p>
                </section>
                <section className="div-ghost"></section>
                {isLoading && (<Loading/>)}
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
