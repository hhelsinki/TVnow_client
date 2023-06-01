import axios from "axios";
import { useEffect, useState } from "react";
import styled from '../shows/show.module.scss';
import Cookies from "js-cookie";
import Header from "@/parts/header";
import Footer from "@/parts/footer";
import { query_path } from "@/functions/query";
import { API, baseKeyApi } from "@/functions/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Types = () => {
    const [contents, setContents] = useState<any>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isTypeAction, setTypeAction] = useState<boolean>(false);
    const [headline, setHeadline] = useState<string>('');
    let router = useRouter();

    const loadContents = async () => {
        //client http://localhost:3000/category/type&filter=cateAction
        let filter: string = (new URLSearchParams(location.search)).get('filter');
        console.log(filter)

        switch (filter) {
            case null: case undefined:
                router.push('../category');
                break;
            default:
                if (filter === 'cateAction') {
                    setTypeAction(!isTypeAction);
                }
                setHeadline(filter.replace('cate', ''));

                const config = {
                    method: 'GET',
                    url: `${API}/${filter}`,
                    headers: {
                        api_key: baseKeyApi,
                        user_token: Cookies.get('TVnow_Login_Token')
                    }
                }
                axios(config)
                    .then((res) => {
                        setLoading(!isLoading);

                        const newContents: any = [];
                        console.log(res.data)
                        res.data.forEach((item: any, index: number) => newContents.push(item));
                        setContents(newContents);
                        console.log(contents);

                    })
                    .catch((err) => {
                        setLoading(!isLoading);
                        console.log('err: API /${type}');
                        if (err.response.status === 401 || err.response.status === 402) {
                            Cookies.set('TVnow_Login_Token', '', { sameSite: 'strict' });
                            router.push('/login');
                            return;
                        }
                    })
                break;
        }
    }

    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }

        loadContents();

        Cookies.set('TVnow oldPath', window.location.pathname, { sameSite: 'strict' });
    }, []);

    return (
        <>
            <Header />
            <main className="main">
                <div className={`${styled.content} div-center padd-default`}>
                    <section className={`${styled["show__intro-txt"]} col-grey`}>
                        <ul className="list-style-none text-base">
                            <Link href="../home"><li className="dp-inline-block">All</li></Link>
                            <Link href="../show"><li className="dp-inline-block">TV Shows</li></Link>
                            <Link href="../movie"><li className="dp-inline-block">Movies</li></Link>
                            <a href="./type?filter=cateAction"><li className={isTypeAction? 'dp-inline-block col-white' : 'dp-inline-block'}>Action</li></a>
                            <Link href="./"><li className="dp-inline-block col-white">Category</li></Link>
                        </ul>
                    </section>

                    <section>
                        <h1>{headline}</h1>
                    </section>

                    <section>
                        <div className={styled.show__browse}>
                            {contents.map((el: any, i: number) => {
                                switch(el.url.includes('shows')) {
                                    case true:
                                        return <div key={i} className={`${styled.show__box} rel`}>
                                            <Link href={'../contents_show?n=' + (el.url).replace(query_path, '')}>
                                                <div className={`${styled['show__box-overlay']} abs`}>
                                                    <div className={`${styled['show__box-txt']} abs`}>{el.title}</div>
                                                </div>
                                                <div className={styled['show__box-img']}>
                                                    <img src={`${API}${el.img}`} alt='' />
                                                    <span className='mobile'>{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span>
                                                    <span className='tablet'>{el.title.substring(0, 13)}{el.title.length >= 13 && '...'}</span>
                                                    <span className='pc'>{el.title.substring(0, 17)}{el.title.length >= 17 && '...'}</span>
                                                </div>
                                            </Link>
                                        </div>;
                                    case false: default:
                                        return <div key={i} className={`${styled.show__box} rel`}>
                                            <Link href={'../contents_movie?n=' + (el.url).replace(query_path, '')}>
                                                <div className={`${styled['show__box-overlay']} abs`}>
                                                    <div className={`${styled['show__box-txt']} abs`}>{el.title}</div>
                                                </div>
                                                <div className={styled['show__box-img']}>
                                                    <img src={`${API}${el.img}`} alt='' />
                                                    <span className='mobile'>{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span>
                                                    <span className='tablet'>{el.title.substring(0, 13)}{el.title.length >= 13 && '...'}</span>
                                                    <span className='pc'>{el.title.substring(0, 17)}{el.title.length >= 17 && '...'}</span>
                                                </div>
                                            </Link>
                                        </div>;
                                        break;
                                }

                            })}
                            <div>{isLoading && (<p>Loading..</p>)}{!isLoading && (<p>You reach the end.</p>)}<br /><br /></div>
                            <div className="div-ghost"></div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Types;