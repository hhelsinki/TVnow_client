import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import styled from '/styles/login.module.scss';
import { API, baseKeyApi } from "@/functions/api";
import { useRouter } from "next/navigation";
import Error from "@/common/Error";

interface State {
    username: string,
    password: string,
    show_password: boolean,
    attn: string
}
export default function Login() {
    const [values, setValues] = useState<State>({
        username: '',
        password: '',
        show_password: false,
        attn: ''
    });
    const [isErrLogin, setErrLogin] = useState<boolean>(false);
    let router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            username: values.username,
            password: values.password
        }
        const config = {
            url: `${API}/login`,
            method: 'POST',
            headers: {
                api_key: baseKeyApi
            },
            data: data
        }
        await axios(config)
            .then((res) => {
                console.log(res.data)
                switch (res.data.status) {
                    case true:
                        setValues({ ...values, attn: '' });
                        Cookies.set('TVnow_Login_Token', res.data.data, { sameSite: 'strict' });
                        router.push('/home');
                        break;
                    case false: default:
                        setValues({ ...values, attn: res.data.msg });
                        setErrLogin(true);
                        setTimeout(()=>{setErrLogin(false)}, 3000);
                        break;
                }
            }).catch((err) => {
                console.log(err); console.log('err: API login');
            })

    }

    useEffect(() => {
        let authToken = Cookies.get('TVnow_Login_Token');

        if (authToken) {
            router.push('/home');
        }
    }, []);

    return (
        <div className="bg-second">
            <header className={`${styled['login__header']} bg-second`}>
                <div className={`rel ${styled['login__content']} div-center`}>
                    <a href='/' className="font-s col-grey-dark">TVnow</a>
                </div>
            </header>

            <main className={`${styled['login__main']}`}>
                <div className={`${styled['login__content']} div-center`}>
                    <section className={`${styled['login__card']} margin-default`}>
                        <form onSubmit={handleSubmit} className={styled['login__form']}>
                            <br />
                            <label className={`${styled['login__label']} dp-block`}>Username or Email</label>
                            <br />

                            <input type="text" onChange={(e) => { setValues({ ...values, username: e.target.value }) }} className={`${styled['login__input']} dp-block`} required />
                            <br />
                            <div className="rel">
                                <  label className={`${styled['login__label']} dp-block`}>Password</label><br/>
                                <input type={values.show_password ? 'text' : 'password'} onChange={(e: any) => setValues({ ...values, password: e.target.value })} className={`${styled['login__input']} dp-block`} required/>
                                <img src={values.show_password ? '/eye_closed.webp' : '/eye_open.webp'} onClick={(e:any) => setValues({...values, show_password:!values.show_password})} className={`${styled['login__input-img']} abs`}/>
                            </div>
                            <br />

                            <button type='submit' className={`${styled['login__input-submit']} dp-block bd-zero col-white cursor`}>LOG IN</button>
                            <br/>
                        </form>
                        <div className={`${styled['login__trial']} txt-center`}>
                            <p>Don't have an account? <a href='/register-I' style={{ color: 'var(--plan-pro-focus)' }}>Start a free trial</a></p>
                            <p className="font-ss col-red"><a href="/password-forgot">Forget Password</a></p>
                        </div>
                    </section>
                    <div className="div-ghost"></div>
                </div>
                {isErrLogin && (<Error text={values.attn}/>)}

            </main>

            <footer className={`abs ${styled['login__footer']} bg-second`}>
                <ul className="txt-center col-grey-dark font-ss">
                    <li>Privacy Policy</li>
                    <li>Terms of Use</li>
                    <li>Do Not Sell My Personal Information</li>
                    <a href='/'><li>© 2022 TVnow</li></a>
                </ul>
            </footer>
        </div>
    );
}