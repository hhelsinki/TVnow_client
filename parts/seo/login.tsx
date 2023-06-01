import { useEffect, useState } from 'react';
import styled from '/styles/login.module.scss';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API, baseKeyApi } from '@/functions/api';
import { useRouter } from 'next/router';
import { query_path } from '@/functions/query';

interface State {
    username: string,
    password: string,
    show_password: boolean,
    attn: string
}

const LoginSEO = () => {
    const [values, setValues] = useState<State>({
        username: '',
        password: '',
        show_password: false,
        attn: ''
    });
    const [contentType, setContentType] = useState<string>('');
    //const [contentPath, setContentPath] = useState<string>('');
    let router = useRouter();
    let query = router.pathname.replace(query_path, '');
    //console.log(router.pathname.includes('shows'))


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            username: values.username,
            password: values.password
        }
        const config = {
            method: 'POST',
            url: `${API}/login`,
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
                        let contentPath:string = '';

                        if (router.pathname.includes('shows')) {
                            contentPath = 'contents_show';
                        }
                        else {
                            contentPath = 'contents_movie';
                        }
                        
                        Cookies.set('TVnow_Login_Token', res.data.data, { sameSite: 'strict' });
                        router.push(`../${contentPath}?n=${query}${contentType}`);
                        //console.log(`../${contentPath}?n=${query}${contentType}`);
                        break;
                    case false: default:
                        setValues({ ...values, attn: res.data.msg });
                        break;

                }
            }).catch((err) => {
                console.log(err); console.log('err: API login');
            })

    }

    useEffect(() => {
        if (router.pathname.includes('shows')) {
            setContentType('-season-1');
        }

        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');
        let contentPath:string = '';

        if (authToken) {
            if (router.pathname.includes('shows')) {
                contentPath = 'contents_show';
            }
            else {
                contentPath = 'contents_movie';
            }
            //console.log(`../${contentPath}?n=${query}${contentType}`);
            router.push(`../${contentPath}?n=${query}${contentType}`);
        }

    }, []);

    return (
        <section className="fixed overlay">
            <div className={`${styled['login__content']} div-center`}>
                <div className={`${styled['login__card']} ${styled['login__guest']} margin-default`}>
                    <form onSubmit={handleSubmit} className={styled['login__form']}>
                        <br />
                        <label className={`${styled['login__label']} dp-block`}>Username or Email</label>
                        <br />

                        <input type="text" onChange={(e) => { setValues({ ...values, username: e.target.value }) }} className={`${styled['login__input']} dp-block`} required />
                        <br />
                        <div className="rel">
                            <input type={values.show_password ? 'text' : 'password'} onChange={(e: any) => setValues({ ...values, password: e.target.value })} className={`${styled['login__input']} dp-block`} required />
                            <img src={values.show_password ? '/eye_closed.webp' : '/eye_open.webp'} onClick={() => setValues({ ...values, show_password: !values.show_password })} className={`${styled['login__input-img']} abs`} />
                        </div>
                        <br />

                        <button type='submit' className={`${styled['login__input-submit']} dp-block bd-zero col-white cursor`}>LOG IN</button>
                        <p>{values.attn}</p>
                    </form>
                    <div className={`${styled['login__trial']} txt-center`}>
                        <p>Don't have an account? <a href='/register-I' style={{ color: 'navy' }}>Start a free trial</a></p>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default LoginSEO;