import { useEffect, useState } from "react";
import styled from '/styles/register.module.scss';
import RegisStep from "@/common/regis_step";
import RegisButtonSubmit from "@/common/regis_button_submit";
import { useRouter } from "next/navigation";

function RegisterII() {
    const [plan, setPlan] = useState<string>('');
    let router = useRouter();

    const handlePlanBasic = (e: any) => {
        setPlan(e.currentTarget.value);
        sessionStorage.setItem('Plan', 'basic');
    }
    const handlePlanPro = (e: any) => {
        setPlan(e.currentTarget.value);
        sessionStorage.setItem('Plan', 'pro');
    }
    const handlePlanPremium = (e: any) => {
        setPlan(e.currentTarget.value);
        sessionStorage.setItem('Plan', 'premium');
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();

        let authPlan = sessionStorage.getItem('Plan');
        if (authPlan) {
            console.log('get all data');
            router.push('/register-III');
        } else { console.log('something is missing') }
    }


    useEffect(() => {
        let authUser = sessionStorage.getItem('User');
        let authEmail = sessionStorage.getItem('Email');
        let authPlan = sessionStorage.getItem('Plan');

        if (authUser && authEmail) {
            console.log('step 1 passed.')
            if (authPlan) {
                console.log('step 2 passed.');
                router.push('/register-III');
            }
            if (!authPlan) {
                console.log('please fufill step 2');
            }
        } else {
            router.push('/register-I');
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

            <main className={`${styled['regis__main']} scroll-y`}>
                <div className="div-content div-center">
                    <RegisStep step='Step 2 of 3' descrip='Choose Plans' />
                </div>
                <section className={`${styled['regis__plan-content']} div-center padd-default`}>
                    <div className='scroll-x'>
                        <section className={`${styled['regis__card-left']} dp-inline-block`}>
                            <h4 className={styled['regis__plan-basic']} style={{ borderRadius: '5px 0 0 0' }}>Basic</h4>
                            <p>1 User</p>
                            <p>iOS, Andriod, Windows</p>
                            <p>HD</p>
                            <p>Offline</p>
                            <p>Exclusive Content</p>
                            <p>Cancel Anytime</p>
                            <p>1st Month Free</p>
                            <p>5.99$</p>
                            <button type="button" value={'basic'} onClick={handlePlanBasic} className={styled['regis__plan-basic--butt']}>SELECT</button>
                        </section>

                        <section className={`${styled['regis__card-mid']} dp-inline-block`}>
                            <h4 className={styled['regis__plan-pro']} style={{ borderRadius: '5px 5px 0 0' }}>Pro</h4>
                            <p>2 Users</p>
                            <p>Any Device</p>
                            <p>Full HD</p>
                            <p>Offline</p>
                            <p>Exclusive Content</p>
                            <p>Cancel Anytime</p>
                            <p>1st Month Free</p>
                            <p>🔥️ 7.99$</p>
                            <button type="button" value={'pro'} onClick={handlePlanPro} className={styled['regis__plan-pro--butt']} style={{ height: '50px' }}>SELECT</button>
                        </section>

                        <section className={`${styled['regis__card-right']} dp-inline-block`}>
                            <h4 className={styled['regis__plan-premium']} style={{ borderRadius: '0 5px 0 0' }}>Premium</h4>
                            <p>5 Users</p>
                            <p>Any Device</p>
                            <p>Ultra 4k HD</p>
                            <p>Offline</p>
                            <p>Worldwide Content</p>
                            <p>Cancel Anytime</p>
                            <p>1st Month Free</p>
                            <p>19.99$</p>
                            <button type="button" value={'premium'} onClick={handlePlanPremium} className={styled['regis__plan-premium--butt']}>SELECT</button>
                        </section>
                    </div>
                </section>

                <section className={`${styled['regis__plan-content']} div-center`}>
                    <p className='padd-default'>My Choice: {plan}</p>
                    <form onSubmit={handleSubmit} className={styled['regis__form']}>
                        <p>Remember, you can change the plan after free trial.</p>
                        <div style={{ width: '100%', maxWidth: '380px' }} className="div-center">
                            <RegisButtonSubmit />
                        </div>
                    </form>
                </section>

                <section className='div-ghost'></section>

            </main>

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

export default RegisterII;