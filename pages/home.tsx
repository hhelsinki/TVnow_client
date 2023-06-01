import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import styled from '../styles/home.module.scss';
import Header from "@/parts/header";
import Footer from "@/parts/footer";
import { Slide, SlideshowRef } from "@/common/slideshow";
import 'react-slideshow-image/dist/styles.css';
import { API, baseKeyApi } from "@/functions/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/common/Loading";

interface Showcase {
    one: any, two: any, three: any, four: any,
    one_url: string, two_url: string, three_url: string, four_url: string
}

export default function Home() {
    const slideRef = useRef<SlideshowRef>(null);
    const [pageTrendingSt, setPageTrendingSt] = useState<number>(0);
    const [pageTrendingEnd, setPageTrendingEnd] = useState<number>(0);
    const [pageMostwatchSt, setPageMostwatchSt] = useState<number>(0);
    const [pageMostwatchEnd, setPageMostwatchEnd] = useState<number>(0);
    const [pageRecentaddSt, setPageRecentaddSt] = useState<number>(0);
    const [pageRecentaddEnd, setPageRecentaddEnd] = useState<number>(0);
    const [pageExclusiveSt, setPageExclusiveSt] = useState<number>(0);
    const [pageExclusiveEnd, setPageExclusiveEnd] = useState<number>(0);
    const [showcase, setShowcase] = useState<Showcase>({
        one: '', two: '', three: '', four: '',
        one_url: '', two_url: '', three_url: '', four_url: ''
    });
    const [trending, setTrending] = useState<any>([]);
    const [mostwatch, setMostwatch] = useState<any>([]);
    const [recentadd, setRecentadd] = useState<any>([]);
    const [exclusive, setExclusive] = useState<any>([]);

    const [isLoading, setLoading] = useState<boolean>(true);

    const [isLoadTrending, setLoadTrending] = useState<boolean>(true);
    const [isLoadMostwatch, setLoadMostwatch] = useState<boolean>(true);
    const [isLoadRecentadd, setLoadRecentadd] = useState<boolean>(true);
    const [isLoadExclusive, setLoadExclusive] = useState<boolean>(true);
    let router = useRouter();

    //Load API
    const headers = {
        api_key: baseKeyApi,
        user_token: Cookies.get('TVnow_Login_Token')
    }
    const loadShowcase = async () => {
        const config = {
            method: 'GET',
            url: `${API}/showcase`,
            headers: headers
        }
        //let newShowcase: any = [];
        await axios(config)
            .then((res) => {
                console.log(res.data);
                setShowcase({
                    one: res.data[0].img,
                    one_url: res.data[0].url,
                    two: res.data[1].img,
                    two_url: res.data[1].url,
                    three: res.data[2].img,
                    three_url: res.data[2].url,
                    four: res.data[3].img,
                    four_url: res.data[3].url
                });

                /*
                res.data.forEach((el: any, i: number) => newShowcase.push(el));
                setShowcase({ ...showcase, 
                    one: Object.values(newShowcase[0]),
                    two: Object.values(newShowcase[1]),
                    three: Object.values(newShowcase[2]),
                    four: Object.values(newShowcase[3]),
                });
                */

                //console.log(showcase[0])
            })
            .catch((err) => { console.log('err API: /showcase'); })
    }
    const loadTrending = async () => {
        const config = {
            url: `${API}/trending?limit=8&page=${pageTrendingSt}`,
            method: 'GET',
            headers: headers
        }
        let newTrending: any = [];
        setLoadTrending(true);

        if (pageTrendingSt <= pageTrendingEnd) {
            await axios(config)
                .then((res) => {
                    console.log(res.data)
                    setLoadTrending(false);
                    setPageTrendingEnd(res.data.page_end);
                    res.data.results.forEach((item: any, index: number) => newTrending.push(item));
                    setTrending((current: any) => [...current, ...newTrending]);
                })
                .catch((err) => {
                    console.log('err: API trending?limit=8&page=${pageTrending}');
                    if (err.response.status === 401 || err.response.status === 402) {
                        Cookies.set('TVnow_Login_Token', '', { sameSite: 'strict' });
                        router.push('/login');
                        return;
                    }
                })
        }
        if (pageTrendingSt > pageTrendingEnd) {
            setLoadTrending(false);
            console.log('you reach the end, stop calling API');
            return;
        }


        console.log('page: ' + pageTrendingSt);
        console.log('page end: ' + pageTrendingEnd);
        setPageTrendingSt((state) => state + 1);
    }
    const loadMostwatch = async () => {
        const config = {
            url: `${API}/mostWatch?limit=8&page=${pageMostwatchSt}`,
            method: 'GET',
            headers: headers
        }
        let newMostwatch: any = [];
        setLoadMostwatch(true);

        if (pageMostwatchSt <= pageMostwatchEnd) {
            await axios(config)
                .then((res) => {
                    setLoadMostwatch(false);
                    setPageMostwatchEnd(res.data.page_end);
                    res.data.results.forEach((item: any, index: number) => newMostwatch.push(item));
                    setMostwatch((current: any) => [...current, ...newMostwatch]);
                })
                .catch((err) => { console.log('err: API trending?limit=8&page=${pageMostwatch}'); })
        }
        if (pageMostwatchSt > pageMostwatchEnd) {
            setLoadMostwatch(false);
            console.log('you reach the end, stop calling API');
            return;
        }


        console.log('page: ' + pageMostwatchSt);
        console.log('page end: ' + pageMostwatchEnd);
        setPageMostwatchSt((state) => state + 1);
    }
    const loadRecentadd = async () => {
        const config = {
            url: `${API}/recentAdd?limit=8&page=${pageRecentaddSt}`,
            method: 'GET',
            headers: headers
        }
        let newRecentadd: any = [];
        setLoadRecentadd(true);

        if (pageRecentaddSt <= pageRecentaddEnd) {
            await axios(config)
                .then((res) => {
                    setLoadRecentadd(false);
                    setPageRecentaddEnd(res.data.page_end);
                    res.data.results.forEach((item: any, index: number) => newRecentadd.push(item));
                    setRecentadd((current: any) => [...current, ...newRecentadd]);
                })
                .catch((err) => { console.log('err: API trending?limit=8&page=${pageRecentadd}'); })
        }
        if (pageRecentaddSt > pageRecentaddEnd) {
            setLoadRecentadd(false);
            console.log('you reach the end, stop calling API');
            return;
        }


        console.log('page: ' + pageRecentaddSt);
        console.log('page end: ' + pageRecentaddEnd);
        setPageRecentaddSt((state) => state + 1);
    }
    const loadExclusive = async () => {
        const config = {
            url: `${API}/exclusive?limit=8&page=${pageExclusiveSt}`,
            method: 'GET',
            headers: headers
        }
        let newExclusive: any = [];
        setLoadExclusive(true);

        if (pageExclusiveSt <= pageExclusiveEnd) {
            await axios(config)
                .then((res) => {
                    setLoading(!isLoading);
                    setLoadExclusive(false);
                    setPageExclusiveEnd(res.data.page_end);
                    res.data.results.forEach((item: any, index: number) => newExclusive.push(item));
                    setExclusive((current: any) => [...current, ...newExclusive]);
                })
                .catch((err) => { setLoading(!isLoading); console.log('err: API trending?limit=8&page=${pageExclusive}'); })
        }
        if (pageExclusiveSt > pageExclusiveEnd) {
            setLoadExclusive(false);
            console.log('you reach the end, stop calling API');
            return;
        }


        console.log('page: ' + pageExclusiveSt);
        console.log('page end: ' + pageExclusiveEnd);
        setPageExclusiveSt((state) => state + 1);
    }

    //Handle Scroll
    const handleScrollXtrending = () => {
        const scroll = document.getElementById('trending_scroll');
        var container = document.getElementById('trending_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft += px;
        loadTrending();
    }
    const handleScrollInvertXtrending = () => {
        const scroll = document.getElementById('trending_scroll');
        var container = document.getElementById('trending_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft -= px;
    }
    const handleScrollXmostwatch = () => {
        const scroll = document.getElementById('mostwatch_scroll');
        var container = document.getElementById('mostwatch_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft += px;
        loadMostwatch();
    }
    const handleScrollInvertXmostwatch = () => {
        const scroll = document.getElementById('mostwatch_scroll');
        var container = document.getElementById('mostwatch_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft -= px;
    }
    const handleScrollXrecentadd = () => {
        const scroll = document.getElementById('recentadd_scroll');
        var container = document.getElementById('recentadd_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft += px;
        loadRecentadd();
    }
    const handleScrollInvertXrecentadd = () => {
        const scroll = document.getElementById('recentadd_scroll');
        var container = document.getElementById('recentadd_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft -= px;
    }
    const handleScrollXexclusive = () => {
        const scroll = document.getElementById('exclusive_scroll');
        var container = document.getElementById('exclusive_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft += px;
        loadExclusive();
    }
    const handleScrollInvertXexclusive = () => {
        const scroll = document.getElementById('exclusive_scroll');
        var container = document.getElementById('exclusive_container');
        var px = (75 * (container.clientWidth)) / 100;
        scroll.scrollLeft -= px;
    }
    const handleScrollXcateg = () => {
        const scroll = document.getElementById('categ_scroll');
        var container = document.getElementById('categ_container');
        var px = (100 * (container.clientWidth)) / 100;
        scroll.scrollLeft += px;
    }
    const handleScrollInvertXcateg = () => {
        const scroll = document.getElementById('categ_scroll');
        var container = document.getElementById('categ_container');
        var px = (100 * (container.clientWidth)) / 100;
        scroll.scrollLeft -= px;
    }

    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }

        //Invoke Load API
        loadShowcase();
        loadTrending();
        loadMostwatch();
        loadRecentadd();
        loadExclusive();

        Cookies.set('TVnow oldPath', window.location.href, { sameSite: 'strict' });
    }, [])

    return (
        <div className="rel bg-second">
            <Header />

            <main className='main scroll-y'>
                <div className="div-content div-center padd-default">
                    <section className={styled["home__intro-txt"]}>
                        <ul className="list-style-none text-base">
                            <li className="dp-inline-block col-white">All</li>
                            <Link href="/show"><li className="dp-inline-block col-grey">TV Shows</li></Link>
                            <Link href="/movie"><li className="dp-inline-block col-grey">Movies</li></Link>
                            <Link href="/category/type?filter=cateAction"><li className="dp-inline-block col-grey">Action</li></Link>
                            <Link href="/category"><li className="dp-inline-block col-grey">Category</li></Link>
                        </ul>
                    </section>
                    <section className={styled["home__intro-img"]}>
                        <Slide indicators={true} ref={slideRef}>
                            <div style={{ textAlign: 'center', fontSize: '30px' }}>
                                <Link href={showcase.one_url}><img src={`${API}/${showcase.one}`} className="img" /></Link>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '30px' }}>
                                <Link href={showcase.two_url}><img src={`${API}/${showcase.two}`} className="img" /></Link>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '30px' }}>
                                <Link href={showcase.three_url}><img src={`${API}/${showcase.three}`} className="img" /></Link>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '30px' }}>
                                <Link href={showcase.four_url}><img src={`${API}/${showcase.four}`} className="img" /></Link>
                            </div>
                        </Slide>
                    </section>
                    <article data-name='trending' className={`${styled['home__adjust-margin']}`}>
                        <h3>Trending</h3>
                        <section id='trending_container' className="rel">
                            <div onClick={handleScrollXtrending} className={`${styled['home__gallery-panel--right']} abs cursor`}></div>
                            <div onClick={handleScrollInvertXtrending} className={`${styled['home__gallery-panel--left']} abs cursor`}></div>
                            <div id="trending_scroll" className={`${styled['home__headline-img']} scroll-hidden scroll-smooth`}>
                                {trending.map((el: any, i: number) => {
                                    return <div key={i} className="rel dp-inline-block">
                                        <Link href={el.url}><div className={styled['home__box-overlay']}>
                                            <div className={styled['home__box-txt']}>{el.title}</div>
                                        </div>
                                            <img src={API + el.img} />
                                            {isLoadTrending && (<span>...</span>)}
                                            <span className="abs">{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span></Link>
                                    </div>
                                })}
                            </div>
                        </section>

                    </article>
                    <article data-name='most watch' className={`${styled['home__adjust-margin']}`}>
                        <h3>Most Watch</h3>
                        <section id='mostwatch_container' className="rel">
                            <div onClick={handleScrollXmostwatch} className={`${styled['home__gallery-panel--right']} abs cursor`}></div>
                            <div onClick={handleScrollInvertXmostwatch} className={`${styled['home__gallery-panel--left']} abs cursor`}></div>
                            <div id="mostwatch_scroll" className={`${styled['home__headline-img']} scroll-hidden scroll-smooth`}>
                                {mostwatch.map((el: any, i: number) => {
                                    return <div key={i} className="rel dp-inline-block">
                                        <Link href={el.url}><div className={styled['home__box-overlay']}>
                                            <div className={styled['home__box-txt']}>{el.title}</div>
                                        </div>
                                            <img src={API + el.img} />
                                            {isLoadMostwatch && (<span>...</span>)}
                                            <span className="abs">{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span></Link>
                                    </div>
                                })}
                            </div>
                        </section>

                    </article>
                    <article data-name='recently add' className={`${styled['home__adjust-margin']}`}>
                        <h3>Recently Add</h3>
                        <section id='recentadd_container' className="rel">
                            <div onClick={handleScrollXrecentadd} className={`${styled['home__gallery-panel--right']} abs cursor`}></div>
                            <div onClick={handleScrollInvertXrecentadd} className={`${styled['home__gallery-panel--left']} abs cursor`}></div>
                            <div id="recentadd_scroll" className={`${styled['home__headline-img']} scroll-hidden scroll-smooth`}>
                                {recentadd.map((el: any, i: number) => {
                                    return <div key={i} className="rel dp-inline-block">
                                        <Link href={el.url}><div className={styled['home__box-overlay']}>
                                            <div className={styled['home__box-txt']}>{el.title}</div>
                                        </div>
                                            <img src={API + el.img} />
                                            {isLoadRecentadd && (<span>...</span>)}
                                            <span className="abs">{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span></Link>
                                    </div>
                                })}
                            </div>
                        </section>

                    </article>
                    <article data-name='exclusive' className={`${styled['home__adjust-margin']}`}>
                        <h3>Exclusive</h3>
                        <section id='exclusive_container' className="rel">
                            <div onClick={handleScrollXexclusive} className={`${styled['home__gallery-panel--right']} abs cursor`}></div>
                            <div onClick={handleScrollInvertXexclusive} className={`${styled['home__gallery-panel--left']} abs cursor`}></div>
                            <div id="exclusive_scroll" className={`${styled['home__headline-img']} scroll-hidden scroll-smooth`}>
                                {exclusive.map((el: any, i: number) => {
                                    return <div key={i} className="rel dp-inline-block">
                                        <Link href={el.url}><div className={styled['home__box-overlay']}>
                                            <div className={styled['home__box-txt']}>{el.title}</div>
                                        </div>
                                            <img src={API + el.img} />
                                            {isLoadExclusive && (<span>...</span>)}
                                            <span className="abs">{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span></Link>
                                    </div>
                                })}
                            </div>
                        </section>

                    </article>
                    <article data-name='category' className={`${styled["home__categ"]} mt-8`}>
                        <h3>Category</h3>
                        <section id='categ_container' className="rel">
                            <div onClick={handleScrollXcateg} className={`${styled['home__gallery-panel--right']} abs cursor`} style={{ top: '30%' }}></div>
                            <div onClick={handleScrollInvertXcateg} className={`${styled['home__gallery-panel--left']} abs cursor`} style={{ top: '30%' }}></div>
                            <div id='categ_scroll' className={`${styled['home__categ']} scroll-hidden scroll-smooth txt-center text-base col-white`}>
                                <Link href='show'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['home__categ-div']} ${styled['shows']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Shows</p>
                                </div></Link>
                                <Link href='movie'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['movies']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Movies</p>
                                </div></Link>
                                <Link href='category/type?filter=cateAction'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['action']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Action</p>
                                </div></Link>
                                <Link href='category/type?filter=cateRomance'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['romance']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Romance</p>
                                </div></Link>
                                <Link href='category/type?filter=cateCrime'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['crime']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Crime</p>
                                </div></Link>
                                <Link href='category/type?filter=cateComedy'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['comedy']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Comedy</p>
                                </div></Link>
                                <Link href='category/type?filter=cateThriller'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['thriller']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Thriller</p>
                                </div></Link>
                                <Link href='category/type?filter=cateFantasy'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['fantasy']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>Fantasy</p>
                                </div></Link>
                                <Link href='category/type?filter=cateLGBTQ'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['lgbtq']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>LGBTQ</p>
                                </div></Link>
                                <Link href='category'><div className={`rel dp-inline-block ${styled['home__categ-div']} ${styled['more']}`}>
                                    <div className={styled['home__box-overlay--cate']}></div>
                                    <p>More...</p>
                                </div></Link>
                            </div>
                        </section>

                    </article>

                </div>
                <div className="div-ghost"></div>
                {/*modal Loading */}
                {isLoading && (<Loading />)}
            </main>




            <Footer />

        </div>
    );
}