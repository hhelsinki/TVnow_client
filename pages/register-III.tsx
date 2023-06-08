import { useEffect, useState } from "react";
import styled from '/styles/register.module.scss';
import axios from "axios";
import RegisStep from "@/common/regis_step";
import RegisButtonSubmit from "@/common/regis_button_submit";
import { useRouter } from "next/navigation";
import { API, KEY } from "@/functions/api";
import Loading from "@/common/Loading";

interface Actives {
    visa: boolean,
    paypal: boolean,
    giftcard: boolean
}
interface Values {
    payment: string,
    paycode: string
}

export default function RegisterIII() {
    const [actives, setActives] = useState<Actives>({
        visa: false,
        paypal: false,
        giftcard: false
    });
    const [values, setValues] = useState<Values>({
        payment: '',
        paycode: ''
    });
    const [isSubmitDisable, setSubmitDisable] = useState<boolean>(true);
    const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
    const [giftcardCheck, setGiftcardCheck] = useState<string>('');
    let router = useRouter();

    //display

    const InputEmail = {
        width: '60%',
        height: '40px',
        marginLeft: '60px'
    }
    const InputTel = {
        width: '60%',
        height: '40px',
        marginLeft: '40px'
    }

    const add_hyphen = (e: any) => {
        let keycode: any = e.code;
        switch (keycode) {
            case 'Backspace':
                //console.log('you press backspace');
                //console.log(e.target.value.length);
                if ((e.target.value.length === 16)) {
                    e.target.value.slice('-', -1);
                    //console.log(e.target.value);
                }
                break;
            default:

                if ((e.target.value.length === 4) || (e.target.value.length === 9) || (e.target.value.length === 14) || (e.target.value === 19)) {
                    e.target.value += '-';
                }
                break;

        }
    }

    const handleValidateGiftcard = async () => {
        setSubmitLoading(true);
        let code: string = values.paycode.replaceAll('-', '');
        const data = {
            giftcard_code: code
        }
        const config = {
            method: 'POST',
            url: `${API}/regis-giftcard_check`,
            headers: {
                'api-key': KEY
            },
            data: data
        }
        const codeCheck = /^([A-Z0-9]{4}[-])([A-Z0-9]{4}[-])([A-Z0-9]{4}[-])([A-Z0-9]{4})/;
        let ifCodeCorrect: boolean = codeCheck.test(values.paycode);
        switch (ifCodeCorrect) {
            case true:
                axios(config)
                    .then((res) => {
                        //console.log(res.data);
                        setSubmitLoading(false);
                        switch (res.data.status) {
                            case true:
                                setGiftcardCheck('✅️');
                                sessionStorage.setItem('Payment', 'Giftcard');
                                setSubmitDisable(false);
                                break;
                            case false: default:
                                setGiftcardCheck('❌️');
                                sessionStorage.removeItem('Payment');
                                break;
                        }
                    })
                    .catch((err) => { setSubmitLoading(false); console.log('err: API check-giftcard') })
                break;
            case false: default:
                setSubmitLoading(false);
                setGiftcardCheck('❌️');
                sessionStorage.removeItem('Payment');
                break;
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        let authPayment = sessionStorage.getItem('Payment');
        if (authPayment) {
            console.log('data 3 passed');
            //send data to api
            const data = {
                email_used: sessionStorage.getItem('Email'),
                giftcard_code: values.paycode.replaceAll('-', '')
            }
            const config = {
                method: 'POST',
                url: `${API}/regis-giftcard`,
                headers: {
                    'api-key': KEY
                },
                data: data
            }
            axios(config)
                .then((res) => {
                    //console.log(res.data)
                    switch (res.data.status) {
                        case true:
                            router.push('/register-IV')
                            break;
                        case false: default:
                            break;
                    }
                })
                .catch((err) => { console.log('err: API update-giftcard_email'); })
        } else { console.log('something is missing'); }
    }

    useEffect(() => {
        let authUser = sessionStorage.getItem('User');
        let authEmail = sessionStorage.getItem('Email');
        let authPlan = sessionStorage.getItem('Plan');
        let authPayment = sessionStorage.getItem('Payment');

        if ((authUser) && (authEmail) && (authPlan)) {
            console.log('step 1-2 passed.')

            if ((authPayment)) {
                console.log('step 3 passed.');
                router.push('/register-IV')
            }
            if ((!authPayment)) {
                console.log('please fullfill step 3.')
            }
        } 
        if (!authUser && !authEmail) {
            router.push('register-I');
        }
        if (authUser && authEmail && !authPlan) {
            router.push('register-II');
        }
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
                    <RegisStep step='Step 3 of 3' descrip='Payment Methods' />
                </div>

                <section className={`${styled['regis__payment-content']} div-center padd-default`}>
                    <div onClick={() => { setActives({ ...actives, visa: !actives.visa }); }} className={`${styled['regis__wallet']} ${styled['visa']} div-center`} style={{color:'var(--light-grey)'}}>Credit Card
                        <img src="/visa.png" alt='' />
                    </div>
                    <div className='dp-none'>
                        <label className={styled['regis__form-label']} style={{ marginLeft: '15px' }}>Number:</label>
                        <input type='tel' onChange={(e) => { setValues({ ...values, paycode: e.target.value }); }} className={styled['regis__form-input']} style={InputTel} placeholder=" 1234-12XX-12XX-12XX" pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}" maxLength={19} />
                    </div>

                    <div onClick={() => { setActives({ ...actives, paypal: !actives.paypal }); }} className={`${styled['regis__wallet']} ${styled['paypal']} div-center`} style={{color:'var(--light-grey)'}}>Paypal
                        <img src="/paypal.png" alt='' />
                    </div>
                    <div className='dp-none'>
                        <label className={styled['regis__form-label']} style={{ marginLeft: '15px' }}>Email:</label>
                        <input type='email' onChange={(e) => { setValues({ ...values, paycode: e.target.value }) }} className={styled['regis__form-input']} style={InputEmail} placeholder=" johnDoe@gmail.com" maxLength={40} />
                    </div>

                    <div onClick={() => { setActives({ ...actives, giftcard: !actives.giftcard }); }} className={`${styled['regis__wallet']} ${styled['giftcard']} div-center`}>Gift Card
                        <img src="/giftcard.png" alt='' />
                    </div>
                    <div className={actives.giftcard ? 'dp-none' : 'dp-block'}>
                        <div className={`${styled['regis__wallet-code']} div-center`}>
                            <label>Code:</label>
                            <input type='text' onChange={(e) => { setValues({ payment: 'giftcard', paycode: e.target.value }); }} onKeyDown={add_hyphen} onBlur={handleValidateGiftcard} className={styled['regis__form-input']} placeholder=" AB1D-XXXX-XXXX-SY56" pattern="[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}" maxLength={19} />
                            <span>{giftcardCheck}</span>
                        </div>

                    </div>

                    <section className={`${styled['regis__plan-content']} div-center`}>
                        <form onSubmit={handleSubmit} className={`${styled['regis__form']} div-center`}>
                            <p className="txt-center">By clicking “CONTINUE” you agree to the TVnow Terms of Use and Privacy Policy.</p>
                            <div style={{ width: '100%', maxWidth: '380px'}} className="div-center">
                                <RegisButtonSubmit isDisable={isSubmitDisable}/>
                            </div>
                        </form>
                    </section>


                    <div className='div-ghost'></div>
                    {isSubmitLoading && (<Loading/>)}

                </section>
            </main>

            <footer className={`${styled['regis__footer']} font-ss bg-grey`}>
                <ul className="txt-center col-grey-dark" style={{paddingTop:'.5rem'}}>
                    <li>Privacy Policy</li>
                    <li>Terms of Use</li>
                    <li>Do Not Sell My Personal Information</li>
                    <a href='/'><li>© 2023 TVnow</li></a>
                </ul>
            </footer>
        </div>
    );
}