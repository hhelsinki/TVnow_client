import { useEffect, useState } from "react";
import styled from '/styles/register.module.scss';
import axios from "axios";
import RegisStep from "@/common/regis_step";
import RegisButtonSubmit from "@/common/regis_button_submit";
import { useRouter } from "next/navigation";
import { API, KEY } from "@/functions/api";
import Loading from "@/common/Loading";

interface State {
    username: string,
    email: string
}

const RegisterI = () => {
    const [values, setValues] = useState<State>({
        username: '',
        email: ''
    });
    const [userCheck, setUserCheck] = useState<string>('');
    const [emailCheck, setEmailCheck] = useState<string>('');
    const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
    let router = useRouter();

    const handleValidateUser = async () => {
        const data = {
            username: values.username
        }
        const config = {
            method: 'POST',
            url: `${API}/regis-username_check`,
            headers: {
                'api-key': KEY
            },
            data: data
        }
        switch (values.username) {
            case null: case undefined: case '':
                setUserCheck('❌️');
                sessionStorage.removeItem('User');
                break;
            default:
                axios(config)
                    .then((res) => {
                        
                        console.log(res.data)
                        switch (res.data.status) {
                            case true:
                                setUserCheck('✅️');
                                sessionStorage.setItem('User', values.username);
                                console.log('save username cookie');
                                break;
                            case false: default:
                                setUserCheck('❌️');
                                sessionStorage.removeItem('User');
                                console.log('not save username');
                                break;
                        }
                    })
                    .catch((err) => { setSubmitLoading(!isSubmitLoading); console.log('err: API check-user'); })
                break;
        }


    }
    const handleValidateEmail = async () => {
        setSubmitLoading(true);
        const data = {
            email: values.email
        }
        const config = {
            method: 'POST',
            url: `${API}/regis-email_validate`,
            headers: {
                'api-key': KEY
            },
            data: data
        }

        const emailCheck = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

        let ifEmailCorrect: boolean = emailCheck.test(values.email);
        switch (ifEmailCorrect) {
            case true:
                axios(config)
                    .then((res) => {
                        console.log(res.data);
                        setSubmitLoading(false);
                        switch (res.data.status) {
                            case true:
                                setEmailCheck('✅️');
                                sessionStorage.setItem('Email', values.email);
                                console.log('save email to cookies');
                                break;
                            case false: default:
                                setEmailCheck('❌️');
                                sessionStorage.removeItem('Email');
                                console.log('not save email');
                                break;
                        }
                    })
                    .catch((err) => { setSubmitLoading(false); console.log('err: API email-validate') })
                break;
            case false: default:
                setEmailCheck('❌️');
                sessionStorage.removeItem('Email');
                break;
        }

    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        let authUser = sessionStorage.getItem('User');
        let authEmail = sessionStorage.getItem('Email');

        if (authUser && authEmail) {
            console.log('get all data');
            router.push('/register-II');

        } else { 
            console.log('some data is missing'); 
        }
    }

    useEffect(() => {
        let authUser = sessionStorage.getItem('User');
        let authEmail = sessionStorage.getItem('Email');

        if (authUser && authEmail) {
            console.log('step 1 passed.');
            router.push('/register-II'); 
        } else {
            console.log('please fufill step 1')
        }
    }, []);

    return (
        <div className="bg-white col-black">
            <header className={`${styled['regis__header']}`}>
                <div className="rel div-content div-center">
                    <a href='/' className={styled["regis__btn-logo"]}>TVnow</a>
                    <a href='login' className={`abs ${styled['regis__btn-login']}`}>Sign In</a>
                </div>
            </header>

            <main className={`${styled['regis__main']} scroll-y`}>
                <div className="div-content div-center">
                    <RegisStep step='Step 1 of 3' descrip='Get to Know You' />

                    <section className={`rel ${styled['regis__motion']} div-center bg-white`}>
                        <form onSubmit={handleSubmit} className={styled['regis__form']}>
                            <label className={styled['regis__form-label']}>Username</label><br />
                            <input type="text" onChange={(e) => { setValues({ ...values, username: e.target.value }); }} onBlur={handleValidateUser} className={styled['regis__form-input']} maxLength={10} required /><span className='static'>{userCheck}</span><br />
                            <label className={styled['regis__form-label']}>Email</label><br />
                            <input type="email" onChange={(e) => { setValues({ ...values, email: e.target.value }) }} onBlur={handleValidateEmail} className={styled['regis__form-input']} required /><span className='static'>{emailCheck}</span><br />
                            <p>By clicking “CONTINUE” you agree to the TVnow Terms of Use and Privacy Policy.</p>
                            <RegisButtonSubmit/>
                        </form>
                    </section>
                    <section className="div-ghost"></section>
                    {isSubmitLoading &&(<Loading/>)}
                </div>

            </main>

            <footer className={`abs ${styled['regis__footer']} font-ss bg-grey`}>
                <ul className="txt-center col-grey-dark">
                    <li>Privacy Policy</li>
                    <li>Terms of Use</li>
                    <li>Do Not Sell My Personal Information</li>
                    <a href='/'><li>© 2022 TVnow</li></a>
                </ul>
            </footer>
        </div>
    );
}

export default RegisterI;