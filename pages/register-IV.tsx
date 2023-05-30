import { useEffect, useState } from "react";
import styled from '/styles/register.module.scss';
import axios from "axios";
import RegisStep from "@/common/regis_step";
import RegisButtonSubmit from "@/common/regis_button_submit";
import { API, baseKeyApi } from "@/functions/api";
import { useRouter } from "next/navigation";

interface Values {
    payment: string,
    paycode: string
}
interface User {
    email: string,
    plan: string,
    username: string
}

export default function RegisterIV() {
    const [attn, setAttn] = useState<string>('');
    const [values, setValues] = useState<Values>({
        payment: '',
        paycode: ''
    });
    const [user, setUser] = useState<User>({
        email: '', plan: '', username: ''
    })
    const [isDisable, setDisable] = useState<boolean>(true);
    let router = useRouter();

    const handlePaycode = async () => {
        const data = {
            email_used: sessionStorage.getItem('Email')
        }
        const config = {
            url: `${API}/regis-credential`,
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
                        setValues({ payment: res.data.data.payment, paycode: res.data.data.code });
                        break;
                    case false: default:
                        console.log('err: please return to complete payment');
                        break;
                }
            })
            .catch((err) => { console.log(err); console.log('err: API get-email_giftcard'); })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        //insert all data to db

        let userPlan:number = 0;
        switch(sessionStorage.getItem('Plan')) {
            case 'basic':
                userPlan = 1;
                break;
            case 'pro':
                userPlan = 2
                break;
            case 'premium':
                userPlan = 3
                break;
        }
        const data = {
            email: sessionStorage.getItem('Email'),
            plan: userPlan,
            username: sessionStorage.getItem('User')
        }
        const config = {
            url: `${API}/regis-submit`,
            method: 'POST',
            headers: {
                api_key: baseKeyApi
            },
            data: data
        }
        await axios(config)
            .then((res) => {
                console.log(res.data);
                setDisable(false);
                setAttn(res.data.msg);
                sessionStorage.clear();
            })
            .catch((err) => { 
                console.log('err: API regis-submit')  
            })
    }

    useEffect(() => {
        handlePaycode();

        setUser({
            email: sessionStorage.getItem('Email'), plan: sessionStorage.getItem('Plan'), username: sessionStorage.getItem('User')
        });

    }, [])

    return (
        <div className="bg-white col-black">
            <header className={`${styled['regis__header']} bg-grey`}>
                <div className="rel div-content div-center">
                    <a href='/' className={styled["regis__btn-logo"]}>TVnow</a>
                    <a href='login' className={`abs ${styled['regis__btn-login']}`}>Sign In</a>
                </div>
            </header>

            <main className={`${styled['regis__main']} scroll-y`}>
                <div className="div-content div-center">
                    <RegisStep step='Last Step' descrip='Complete Payment' />
                </div>

                <section className={`rel ${styled['regis__motion']} div-center`}>
                    <div>
                        <p>Email: {user.email}</p>
                        <p style={{ textTransform: 'capitalize' }}>Plan: {user.plan}</p>
                        <p>Payment: {values.payment}</p>
                        <p>Code: {values.paycode} <a href='/register-III' style={{ color: '#8b0000' }}><small>Not my code?</small></a></p>
                    </div>
                    <div>
                        <br />
                        <p>{attn.toLocaleUpperCase('en-US')}</p>
                        <br />
                    </div>
                    <form onSubmit={handleSubmit} className={styled['regis__form']}>
                        <p>By clicking “CONTINUE” you agree to the TVnow Terms of Use and Privacy Policy.</p>
                        <RegisButtonSubmit disabled={isDisable} />
                    </form>
                    <div className="div-ghost"></div>
                </section>
            </main>

            <footer className={`${styled['regis__footer']} font-ss bg-grey`}>
                <ul className="txt-center col-grey-dark" style={{paddingTop:'.5rem'}}>
                    <li>Privacy Policy</li>
                    <li>Terms of Use</li>
                    <li>Do Not Sell My Personal Information</li>
                    <a href='/'><li>© 2022 TVnow</li></a>
                </ul>
            </footer>
        </div>
    );
}
