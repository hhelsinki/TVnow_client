import Loading from "@/common/Loading";
import { API, KEY } from "@/functions/api";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
    username: string,
    email: string,
    payment: string,
    date_expire: any
}
interface Submit {
    values: string,
    msg: string
}

function Settings() {
    const [values, setValues] = useState<UserProfile>({
        username: '',
        email: '',
        payment: '',
        date_expire: ''
    });
    const [isActiveProfile, setActiveProfile] = useState<boolean>(false);
    const [isActivePayment, setActivePayment] = useState<boolean>(false);
    const [isActiveChangePassword, setActiveChangePassword] = useState<boolean>(false);
    const [isActiveAdvance, setActiveAdvance] = useState<boolean>(false);
    const [isActiveTwoFactor, setActiveTwoFactor] = useState<boolean>(false);
    const [isActivePolicy, setActivePolicy] = useState<boolean>(false);
    const [isSuggest, setSuggest] = useState<boolean>(false);
    const [isLogout, setLogout] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [redeemCode, setRedeemCode] = useState<Submit>({
        values: '',
        msg: ''
    });
    const [password, setPassword] = useState<Submit>({
        values: '',
        msg: ''
    });
    const [isEnableTwoFactor, setEnableTwoFactor] = useState<boolean>(false);
    const [isTwoFactor, setTwoFactor] = useState<boolean>(false);
    let router = useRouter();

    const handleSubmitRedeemCode = async (e: any) => {
        e.preventDefault();
        const data = {
            code: redeemCode.values
        }
        const config = {
            url: `${API}/user-redeem`,
            method: 'POST',
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
            },
            data: data
        }
        await axios(config)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log('err: API user-redeem');
            })
    }
    const handleSubmitChangePassword = async (e: any) => {
        e.preventDefault();
        const data = {
            password: password.values
        }
        const config = {
            url: `${API}/user-password_change`,
            method: 'POST',
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
            },
            data: data
        }
        await axios(config)
            .then((res) => {
                console.log(res.data)
                switch (res.data.status) {
                    default:
                        setPassword({ ...password, msg: res.data.msg });
                        break;
                }
            })
            .catch((err) => {
                console.log(err);
                console.log('err: API user-change-password');
            })
    }
    const handleSubmitTwoFactor = async () => {
        setLoading(true);
        const data = {
            bool: !isTwoFactor,
            email: values.email
        }
        console.log(data)
        const config = {
            url: `${API}/user-twofactor_change`,
            method: 'POST',
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
            },
            data: data
        }
        //setTwoFactor(!isTwoFactor);

        await axios(config)
            .then((res) => {
                console.log(res.data)
                setLoading(false);
                switch (res.data.status) {
                    case true:
                        switch (isEnableTwoFactor) {
                            case true:
                                setEnableTwoFactor(!isEnableTwoFactor);
                                setTwoFactor(!isTwoFactor);
                                console.log(isTwoFactor);
                                break;
                            case false:
                                setEnableTwoFactor(!isEnableTwoFactor);
                                setTwoFactor(!isTwoFactor);
                                break;
                            default:
                                break;
                        }
                        break;
                    case false: default:
                        break;
                }
            })
            .catch((err) => { setLoading(false); console.log('err API: user-req-twofactor') })

    }
    const handleLogout = async () => {
        const config = {
            method: 'POST',
            url: `${API}/logout`,
            headers: {
                'api-key': KEY
            },
            data: {
                email: values.email
            }
        }

        axios(config)
            .then((res) => {
                switch (res.data.status) {
                    default:
                        Cookies.remove('TVnow_Login_Token');
                        router.push('/login')
                        break;
                }
            })
            .catch((err) => {
                console.log('err API: logout')
            })
    }
    const add_hyphen = (e: any) => {
        let keycode: any = e.code;
        switch (keycode) {
            case 'Backspace':
                console.log('you press backspace');
                console.log(e.target.value.length);
                if ((e.target.value.length === 16)) {
                    e.target.value.slice('-', -1);
                    console.log(e.target.value);
                }
                break;
            default:

                if ((e.target.value.length === 4) || (e.target.value.length === 9) || (e.target.value.length === 14) || (e.target.value === 19)) {
                    e.target.value += '-';
                }
                break;

        }
    }

    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }

        const config = {
            url: `${API}/user-profile`,
            method: 'GET',
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
            }
        }
        axios(config)
            .then((res) => {
                console.log(res.data);
                switch (res.data.status) {
                    case true:
                        let epoch_time = res.data.data.date_expire * 1000;
                        var d = new Date(epoch_time);
                        setValues({
                            username: res.data.data.username,
                            email: res.data.data.email,
                            payment: res.data.data.payment,
                            date_expire: d.toUTCString()
                        });
                        switch (res.data.data.is_twofactor) {
                            case 1:
                                setEnableTwoFactor(true);
                                setTwoFactor(true);
                                console.log('2 fac is enable')
                                break;
                            case 0: default:
                                setEnableTwoFactor(false);
                                setTwoFactor(false);
                                console.log('2 fac is disable')
                                break;
                        }

                        break;
                    case false: default:
                        console.log('something wrong');
                        Cookies.remove('TVnow_Login_Token');
                        break;
                }

            })
            .catch((err) => {
                console.log('err: API user-profile');
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 402) {
                        Cookies.set('TVnow_Login_Token', '', { sameSite: 'strict' });
                        router.push('/login');
                        return;
                    }
                    return;
                }
            })


        console.log(isTwoFactor)
        console.log(Cookies.get('TVnow oldPath'))
    }, []);

    return (
        <>
            <div className="footer-settings--sidenav">
                <div className="div-content div-center">
                    <article className="footer-settings--header closebtn">
                        <div className="div-content div-center">
                            <div className="dp-flex" >
                                <div className="left">
                                    <Link href='/home'><img src="./settings/left-arrow.png" className="div-center dp-block" /></Link>
                                </div>
                                <div className="right">
                                    <span>Settings</span>
                                </div>
                            </div>
                        </div>

                    </article>
                    <article className="footer-settings--main scroll-y">
                        <div className="footer-settings--margintop"></div>
                        <section data-name='profile' className="footer-settings">
                            <label className="footer-settings--marginlabel">Profile</label>
                            <div className="dp-flex" onClick={() => setActiveProfile(!isActiveProfile)}>
                                <div className="left">
                                    <img src="./navi/user-active.png" className="div-center dp-block" />
                                </div>
                                <div className="mid"><span>Profile info</span></div>
                                <div className="right">
                                    <img src="./settings/right-arrow.png" className="div-center dp-block" />
                                </div>
                            </div>
                        </section>
                        <section data-name='general' className="footer-settings">
                            <label className="footer-settings--marginlabel">General</label>
                            <div className="dp-flex" onClick={() => setActivePayment(!isActivePayment)}>
                                <div className="left">
                                    <img src="./settings/payment.png" className="footer-settings--img left div-center dp-block" />
                                </div>
                                <div className="mid"><span>Payments</span></div>
                                <div className="right">
                                    <img src="./settings/right-arrow.png" className="footer-settings--img right div-center dp-block" />
                                </div>
                            </div>
                            <div onClick={() => setActiveAdvance(!isActiveAdvance)} className="dp-flex footer-settings--shadow">
                                <div className="left">
                                    <img src="./settings/setting.png" className="footer-settings--img left div-center dp-block" />
                                </div>
                                <div className="mid"><span>Advanced Settings</span></div>
                                <div className="right">
                                    <img src="./settings/right-arrow.png" className="footer-settings--img right div-center dp-block" />
                                </div>
                            </div>
                        </section>
                        <section data-name='security' className="footer-settings">
                            <label className="footer-settings--marginlabel">Security</label>
                            <div className="dp-flex" onClick={() => setActiveChangePassword(!isActiveChangePassword)}>
                                <div className="left">
                                    <img src="./settings/password.png" className="footer-settings--img left div-center dp-block" />
                                </div>
                                <div className="mid"><span>Change Password</span></div>
                                <div className="right">
                                    <img src="./settings/right-arrow.png" className="footer-settings--img right div-center dp-block" />
                                </div>
                            </div>
                            <div className="dp-flex footer-settings--shadow" onClick={() => setActiveTwoFactor(!isActiveTwoFactor)}>
                                <div className="left">
                                    <img src="./settings/key.png" className="footer-settings--img left div-center dp-block" />
                                </div>
                                <div className="mid"><span>Enable 2 Factor Authentication</span></div>
                                <div className="right">
                                    <img src="./settings/right-arrow.png" className="footer-settings--img right div-center dp-block" />
                                </div>
                            </div>
                        </section>
                        <section data-name='about' className="footer-settings">
                            <label className="footer-settings--marginlabel">About</label>
                            <div className="dp-flex footer-settings--shadow" onClick={() => setActivePolicy(!isActivePolicy)}>
                                <div className="left">
                                    <img src="./settings/info.png" className="footer-settings--img left div-center dp-block" />
                                </div>
                                <div className="mid"><span>Privacy policy</span></div>
                                <div className="right">
                                    <img src="./settings/right-arrow.png" className="footer-settings--img right div-center dp-block" />
                                </div>
                            </div>
                        </section>

                        <div className="div-ghost"></div>
                    </article>
                    <article className="footer-settings--footer">
                        <div onClick={() => setLogout(!isLogout)} className="div-center txt-center cursor">LOGOUT</div>
                    </article>
                </div>
            </div>
            {/*modal profile */}
            <article className="footer-settings--sidenav profile" style={{ width: isActiveProfile ? '100%' : '0' }}>
                <section className="footer-settings--header closebtn" onClick={() => setActiveProfile(!isActiveProfile)}>
                    <div className="div-content div-center">
                        <div className="dp-flex" >
                            <div className="left">
                                <img src="./settings/left-arrow.png" className="div-center dp-block" />
                            </div>
                            <div className="right">
                                <span>Settings: Profile</span>
                            </div>
                        </div>
                    </div>

                </section>
                <section className="footer-settings--main scroll-y bg-second">
                    <div className="footer-settings--margintop"></div>
                    <img src="./navi/user-active.png" className="div-center dp-block" />
                    <p className="txt-center">Username: {values.username}</p>
                    <p className="txt-center">Email: {values.email}</p>
                    <div className="div-ghost"></div>
                </section>
                <section className="footer-settings--footer">
                    <div className="div-center txt-center cursor">LOGOUT</div>
                </section>
            </article>
            {/*modal payment */}
            <article className="footer-settings--sidenav payment" style={{ width: isActivePayment ? '100%' : '0' }}>
                <section className="footer-settings--header closebtn" onClick={() => setActivePayment(!isActivePayment)}>
                    <div className="div-content div-center">
                        <div className="dp-flex" >
                            <div className="left">
                                <img src="./settings/left-arrow.png" className="div-center dp-block" />
                            </div>
                            <div className="right">
                                <span>Settings: Payment</span>
                            </div>
                        </div>
                    </div>

                </section>
                <section className="footer-settings--main scroll-y bg-second">
                    <div className="div-content div-center txt-center">
                        <div className="footer-settings--margintop"></div>
                        <p className="capitalize">Your Payment: {values.payment}</p>
                        <p>Expired in: {values.date_expire}</p>
                        <form onSubmit={handleSubmitRedeemCode} className="footer-settings--margintop footer-settings--form">
                            <label>Redeem Code:</label><br />
                            <input type='text' onChange={(e) => setRedeemCode({ ...redeemCode, values: e.target.value })} onKeyDown={add_hyphen} placeholder=" AB1D-XXXX-XXXX-SY56" pattern="[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}" maxLength={19} required />
                            <button type="submit">Enter</button>
                        </form>
                        <p><i>You can redeem code on 7 days before the expire.</i></p>
                        <p>{redeemCode.msg}</p>
                    </div>
                    <div className="div-ghost"></div>
                </section>
                <section className="footer-settings--footer">
                    <div className="div-center txt-center cursor">LOGOUT</div>
                </section>
            </article>
            {/*modal advance setting */}
            <article className="footer-settings--sidenav twofactor" style={{ width: isActiveAdvance ? '100%' : '0' }}>
                <section className="footer-settings--header closebtn" onClick={() => setActiveAdvance(!isActiveAdvance)}>
                    <div className="div-content div-center">
                        <div className="dp-flex" >
                            <div className="left">
                                <img src="./settings/left-arrow.png" className="div-center dp-block" />
                            </div>
                            <div className="right">
                                <span>Settings: Advanced Setting</span>
                            </div>
                        </div>
                    </div>

                </section>
                <section className="footer-settings--main scroll-y bg-second">
                    <div className="footer-settings rel div-content div-center">
                        <div className="dp-flex" style={{ paddingBottom: '0' }}>
                            <div className="left">
                                <img src="./settings/device.png" className="div-center dp-block" />
                            </div>
                            <div className="mid"><span>Add Trusted Device</span></div>
                            <div className="right">
                                <img onClick={() => setSuggest(!isSuggest)} src="./settings/question.png" className="footer-settings--img suggest right div-center dp-block cursor" />
                            </div>
                        </div>
                        <div className="footer-settings--suggest div-center" style={{ opacity: isSuggest ? '1' : '0' }}>
                            <p>Allow list of devices which can login, other device will not be allow to access.</p>
                        </div>
                    </div>

                    <div className="div-ghost"></div>
                </section>
                <section className="footer-settings--footer">
                    <div className="div-center txt-center cursor">LOGOUT</div>
                </section>
            </article>
            {/*modal change password */}
            <article className="footer-settings--sidenav passchange" style={{ width: isActiveChangePassword ? '100%' : '0' }}>
                <section className="footer-settings--header closebtn" onClick={() => setActiveChangePassword(!isActiveChangePassword)}>
                    <div className="div-content div-center">
                        <div className="dp-flex" >
                            <div className="left">
                                <img src="./settings/left-arrow.png" className="div-center dp-block" />
                            </div>
                            <div className="right">
                                <span>Settings: Change Password</span>
                            </div>
                        </div>
                    </div>

                </section>
                <section className="footer-settings--main scroll-y bg-second">
                    <div className="div-content div-center txt-center">
                        <div className="footer-settings--margintop"></div>
                        <p>Please Enter your current password</p>
                        <form onSubmit={handleSubmitChangePassword} className="footer-settings--form">
                            <label>Current Password:</label><br />
                            <input type='password' onChange={(e) => setPassword({ ...password, values: e.target.value })} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required />
                            <button type="submit">Enter</button>
                            <p><i>*Must contain characters A-Z a-z, number 0-9 and special character. Total at least 8 characters</i></p>
                        </form>
                        <p>{password.msg}</p>
                    </div>

                    <div className="div-ghost"></div>
                </section>
                <section className="footer-settings--footer">
                    <div className="div-center txt-center cursor">LOGOUT</div>
                </section>
            </article>
            {/*modal 2 factor */}
            <article className="footer-settings--sidenav twofactor" style={{ width: isActiveTwoFactor ? '100%' : '0' }}>
                <section className="footer-settings--header closebtn" onClick={() => setActiveTwoFactor(!isActiveTwoFactor)}>
                    <div className="div-content div-center">
                        <div className="dp-flex" >
                            <div className="left">
                                <img src="./settings/left-arrow.png" className="div-center dp-block" />
                            </div>
                            <div className="right">
                                <span>Settings: 2 Factor Authentication</span>
                            </div>
                        </div>
                    </div>

                </section>
                <section className="footer-settings--main scroll-y bg-second">
                    <div className="footer-settings rel div-content div-center">
                        <div className="dp-flex" style={{ paddingBottom: '0' }}>
                            <div className="left">
                                <div className="rel footer-btn--toggle" style={{ marginLeft: '0' }}>
                                    <label className='cursor'>
                                        <input type='checkbox' onClick={handleSubmitTwoFactor} checked={isEnableTwoFactor} readOnly />
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <div className="mid"><span>Enable 2 Step Email Login</span></div>
                            <div className="right">
                                <img onClick={() => setSuggest(!isSuggest)} src="./settings/question.png" className="footer-settings--img suggest right div-center dp-block cursor" />
                            </div>
                        </div>
                        <div className="footer-settings--suggest div-center" style={{ opacity: isSuggest ? '1' : '0' }}>
                            <p>After login is success, the verify code will send to your email.</p>
                        </div>
                    </div>
                    <div className="div-ghost"></div>
                </section>
                <section className="footer-settings--footer">
                    <div className="div-center txt-center cursor">LOGOUT</div>
                </section>
            </article>
            {/*modal policy */}
            <article className="footer-settings--sidenav policy" style={{ width: isActivePolicy ? '100%' : '0' }}>
                <section className="footer-settings--header closebtn" onClick={() => setActivePolicy(!isActivePolicy)}>
                    <div className="div-content div-center">
                        <div className="dp-flex" >
                            <div className="left">
                                <img src="./settings/left-arrow.png" className="div-center dp-block" />
                            </div>
                            <div className="right">
                                <span>Settings: Policy</span>
                            </div>
                        </div>
                    </div>

                </section>
                <section className="footer-settings--main scroll-y bg-second">
                    <div className="footer-settings rel div-content div-center">
                        <p className="txt-center"><strong>Our Policy / Disclaimer</strong></p>
                        <ul>
                            <li>This project is sameple mockup and only provide official trailer of video from the youtube website.</li><br />
                            <li>No any collecting data from user.</li><br />
                            <li>Request for delete from the video owner, kindly contact me at bongkotsaelo.cmtc@gmail.com</li>
                        </ul>
                    </div>

                    <div className="div-ghost"></div>
                </section>
                <section className="footer-settings--footer">
                    <div className="div-center txt-center cursor">LOGOUT</div>
                </section>
            </article>
            {/*modal logout */}
            {isLogout && (<section data-name='logout' className="fixed overlay" style={{ paddingTop: '100px' }}>
                <div className="div-content div-center">
                    <div className="footer-logout">
                        <h1 className="txt-center">Logout</h1>
                        <p className="text-lg txt-center">Are you sure you want to logout?</p>
                        <div className="div-center">
                            <button type='button' onClick={() => setLogout(!isLogout)} className="bd-zero col-white cursor" style={{ marginRight: '1rem', background: '#01721d' }}>No</button>
                            <button type='button' onClick={handleLogout} className="bd-zero col-white cursor" style={{ background: '#8b0000' }}>Yes</button>
                        </div>

                    </div>
                </div>
            </section>)}
            {/*modal loading*/}
            {isLoading && (<Loading />)}
        </>

    );
}

export default Settings;