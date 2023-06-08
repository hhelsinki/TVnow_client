import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import styled from '/styles/register.module.scss';
import Styled from 'styled-components'
import RegisButtonSubmit from "@/common/regis_button_submit";
import { API, KEY } from "@/functions/api";
import Cookies from "js-cookie";

const Main = Styled.div`
    height: 77vh; overflow-y: hidden;

    @media only screen and (min-height:899px) {
        height: 82vh;
    }
`;

interface Password {
    new: string,
    confirm: string
}
interface Attn {
    icon: string,
    msg: string
}

const RegisterVerify = () => {
    const [password, setPassword] = useState<Password>({
        new: '',
        confirm: ''
    });
    const [isDisableButt, setDisableButt] = useState<boolean>(true);
    const [attn, setAttn] = useState<Attn>({
        icon: '',
        msg: ''
    });
    let router = useRouter();


    const validatePassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
        if (password.new === password.confirm) {
            switch (passwordRegex.test(password.confirm)) {
                case true:
                    setAttn({ icon: '✅️', msg: '' });
                    setDisableButt(!isDisableButt);
                    break;
                case false: default:
                    setAttn({ icon: '❌️', msg: 'Not contain minumum required.' });
                    break;
            }

        }
        if (password.new != password.confirm) {
            setAttn({ icon: '❌️', msg: 'Password do not match.' });
            setDisableButt(true);
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let user: string = (new URLSearchParams(location.search)).get('user');
        let token: string = (new URLSearchParams(location.search)).get('token');
        //console.log(user, token)

        //url client = http://localhost:3000/password-submit?user=${user_email}&token=${'user-token'}
        const data = {
            email: user,
            password_new: password.confirm
        }
        const config = {
            method: 'POST',
            url: `${API}/user-password`,
            headers: {
                'api-key': KEY,
                'user-token': token
                },
            data: data
        }
        axios(config)
            .then((res) => {
                console.log(res.data)
                switch (res.data.status) {
                    case true:
                        Cookies.remove('TVnow_Login_Token');
                        router.push('/login');
                        break;
                    case false: default:
                        setAttn({ ...attn, msg: 'Invalid Token, if you open this link from your email, your link might be a mistake. (This is a rare event)' });
                        break;
                }
            })
            .catch((err) => { 
                console.log('err: API user-password');
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 402) {
                        router.push('/login');
                        return;
                    }
                    return;
                }
            })
    }

    useEffect(() => {
        //Param is Required
        let user: string = (new URLSearchParams(location.search)).get('user');
        let token: string = (new URLSearchParams(location.search)).get('token');

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
                    <h1 className="txt-center">Password Change Form</h1>

                    <form onSubmit={handleSubmit} className={styled['regis__form']}>
                        <label className={styled['regis__form-label']}>Enter New Password</label><br />
                        <input type="password" onChange={(e) => setPassword({ ...password, new: e.target.value })} className={styled['regis__form-input']} maxLength={10} required /><span className='static'>{attn.icon}</span><br />
                        <label className={styled['regis__form-label']}>Confirm New Password</label><br />
                        <input type="password" onChange={(e) => setPassword({ ...password, confirm: e.target.value })} onBlur={validatePassword} className={styled['regis__form-input']} maxLength={10} required /><span className='static'>{attn.icon}</span><br />
                        <RegisButtonSubmit isDisable={isDisableButt} />
                    </form>
                    <h5 className="txt-center"><i>Password must contains a-z, A-Z, 0-9 and special characters. Minimum 8 and maximum 10 characters.</i></h5>
                    <h3 className="txt-center col-red">{attn.msg}</h3>
                </section>
                <section className="div-ghost"></section>
            </Main>
            <footer className={`${styled['regis__footer']} font-ss bg-grey`}>
                <ul className="txt-center col-grey-dark" style={{ paddingTop: '.5rem' }}>
                    <li>Privacy Policy</li>
                    <li>Terms of Use</li>
                    <li>Do Not Sell My Personal Information</li>
                    <a href='/'><li>© 2023 TVnow</li></a>
                </ul>
            </footer>
        </div>
    );
}

export default RegisterVerify;
