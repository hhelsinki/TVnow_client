import axios from "axios";
import { useEffect, useState } from "react";
import styled from './shows/show.module.scss';
import Cookies from "js-cookie";
import Header from "@/parts/header";
import Footer from "@/parts/footer";
import { query_path } from "@/functions/query";
import { API, KEY } from "@/functions/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "@/common/Loading";

const Shows = () => {
    let offset: any = 0;
    let pageEnd: any = 0;
    const [contents, setContents] = useState<any>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isEnding, setEnding] = useState<boolean>(false);
    let router = useRouter();

    const loadContents = async () => {
        const config = {
            method: 'GET',
            url: `${API}/shows?limit=12&page=${offset}`,
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
                }
        }

        if (offset <= pageEnd) {
            axios(config)
                .then((res) => {
                    const newContents: any = [];
                    console.log(res.data)

                    setLoading(!isLoading);
                    switch (res.data.status) {
                        case true:
                            pageEnd = res.data.page_end;
                            res.data.results.forEach((item: any, index: number) => newContents.push(item));
                            console.log(newContents)
                            setContents((current: any) => [...current, ...newContents]);
                            break;
                        case false:
                            setEnding(!isEnding);
                            break;
                        default:
                            console.log('something is wrong');
                            break;
                    }

                })
                .catch((err) => {
                    console.log('err: API ${title}?limit=12&page=${offset}');
                    if (err.response) {
                        if (err.response.status === 401 || err.response.status === 402) {
                            Cookies.set('TVnow_Login_Token', '', { sameSite: 'strict' });
                            router.push('/login');
                            return;
                        }
                        return;
                    }

                })
        }
        if (offset > pageEnd) {
            setEnding(!isEnding);
            setLoading(!isLoading);
            return;
        }

        offset += 1;
        console.log('offset: ' + offset);
        console.log('page end' + pageEnd);
    }

    const handleScrollY = (e: any) => {
        if (window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight) {
            loadContents();
        }
    }
    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }

        loadContents();
        window.addEventListener('scroll', handleScrollY);

        Cookies.set('TVnow oldPath', window.location.pathname, { sameSite: 'strict' });
    }, []);


    return (
        <>
            <Header />
            <main className="main">
                <div className={`${styled.content} div-center padd-default`}>
                    <section className={`${styled["show__intro-txt"]} col-grey`}>
                        <ul className="list-style-none text-base">
                            <Link href="home"><li className="dp-inline-block">All</li></Link>
                            <Link href="show"><li className="dp-inline-block col-white">TV Shows</li></Link>
                            <Link href="movie"><li className="dp-inline-block">Movies</li></Link>
                            <Link href="category/type?filter=cateAction"><li className="dp-inline-block">Action</li></Link>
                            <Link href="category"><li className="dp-inline-block">Category</li></Link>
                        </ul>
                    </section>

                    <section>
                        <h1>Shows</h1>
                    </section>

                    <section>
                        <div className={styled.show__browse}>
                            {contents.map((el: any, i: number) => {
                                return <div key={i} className={`${styled.show__box} rel`}>
                                    <Link href={'contents_show?n=' + (el.url).replace(query_path, '')}>
                                        <div className={`${styled['show__box-overlay']} abs`}>
                                            <div className={`${styled['show__box-txt']} abs`}>{el.title}</div>
                                        </div>
                                        <div className={styled['show__box-img']}>
                                            <img src={`${API}${el.img}`} alt='' />
                                            <span className='mobile'>{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span>
                                            <span className='tablet'>{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span>
                                            <span className='pc'>{el.title.substring(0, 17)}{el.title.length >= 17 && '...'}</span>
                                        </div>
                                    </Link>
                                </div>;
                            })}
                            <div>{isLoading && (<Loading />)}{isEnding && (<p>You reach the end.</p>)}<br /><br /></div>
                            <div className="div-ghost"></div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Shows;