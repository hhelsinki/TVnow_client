import { API, KEY } from "@/functions/api";
import Footer from "@/parts/footer";
import Header from "@/parts/header";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from './shows/show.module.scss';
import Link from "next/link";
import Loading from "@/common/Loading";

interface Visibility {
    all: boolean, show: boolean, movie: boolean
}

const Saved = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [favourite, setFavourite] = useState<any>([]);
    const [isActive, setActive] = useState<Visibility>({
        all: true,
        show: false,
        movie: false
    })
    let router = useRouter();

    const handleFavouriteList = async () => {
        const config = {
            method: 'GET',
            url: `${API}/list-favourite-all`,
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
                }
        }

        axios(config)
            .then((res) => {
                setLoading(false);
                console.log(res.data);
                let newFavourite: any = [];

                res.data.data.forEach((item: any, index: number) => newFavourite.push(item));
                setFavourite(newFavourite);


            })
            .catch((err) => {
                setLoading(false); 
                console.log('err API: /favourite-list-all');
                /*if (err.response) {
                    if (err.response.status === 401 || err.response.status === 402) {
                        Cookies.set('TVnow_Login_Token', '', { sameSite: 'strict' });
                        router.push('/login');
                        return;
                    }
                    return;
                }*/ 
            })
    }


    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }

        handleFavouriteList();

        console.log(Cookies.get('TVnow oldPath'))
    }, []);

    return (
        <>
            <Header />
            <main className="main">
                <div className='div-content div-center padd-default'>
                    <h1>My Favourite List</h1>
                    <section className={`${styled["show__intro-txt"]} ml-8 col-grey`}>
                        <ul className="list-style-none">
                            <li onClick={() => setActive({ all: true, show: false, movie: false })} className={isActive.all ? 'dp-inline-block cursor col-white' : 'dp-inline-block cursor '}>All</li>
                            <li onClick={() => setActive({ all: false, show: true, movie: false })} className={isActive.show ? 'dp-inline-block cursor col-white' : 'dp-inline-block cursor '}>Shows</li>
                            <li onClick={() => setActive({ all: false, show: false, movie: true })} className={isActive.movie ? 'dp-inline-block cursor col-white' : 'dp-inline-block cursor '}>Movies</li>
                        </ul>
                    </section>
                    <section data-name='list' className="mt-8 ml-8">
                        {isActive.all && (<>
                            {favourite.map((el: any, i: number) => {
                                switch (el.title.includes('season')) {
                                    case true:
                                        return <div key={i}>
                                            <Link href={`/contents_show?n=${el.title}`}><p className="capitalize">{el.title.replaceAll('-', ' ')}</p></Link>
                                        </div>
                                    case false: default:
                                        return <div key={i}>
                                            <Link href={`/contents_movie?n=${el.title}`}><p className="capitalize">{el.title.replaceAll('-', ' ')}</p></Link>
                                        </div>
                                }

                            })}
                        </>)}

                        {isActive.show && (<>
                            {favourite.map((el: any, i: number) => {
                                switch (el.title.includes('season')) {
                                    case true:
                                        return <div key={i}>
                                            <Link href={`/contents_show?n=${el.title}`}><p className="capitalize">{el.title.replaceAll('-', ' ')}</p></Link>
                                        </div>
                                    case false: default:
                                        break;
                                }
                            })}
                        </>)}

                        {isActive.movie && (<>
                            {favourite.map((el: any, i: number) => {
                                switch (el.title.includes('season')) {
                                    case true:
                                        break;
                                    case false: default:
                                        return <div key={i}>
                                            <Link href={`/contents_movie?n=${el.title}`}><p className="capitalize">{el.title.replaceAll('-', ' ')}</p></Link>
                                        </div>
                                }
                            })}
                        </>)}
                    </section>


                </div>
                {/*modal Loading */}
                {isLoading && (<Loading/>)}
            </main>
            <Footer />
        </>
    );
}

export default Saved;