import Footer from "@/parts/footer";
import Header from "@/parts/header";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from './shows/show.module.scss';
import Cookies from "js-cookie";
import { ContentEp, ContentSs } from "@/parts/show";
import { ContentRelated } from "@/parts/related";
import { scrollInvertXep, scrollInvertXrelated, scrollInvertXss, scrollXep, scrollXrelated, scrollXss } from "@/functions/scrollX";
import { query_path } from "@/functions/query";
import { ContentHeadlineShow } from "@/parts/show";
import YouTube, { YouTubeProps } from 'react-youtube';
import { useDispatch } from "react-redux";
import { toggleWishlist } from "@/redux/wishlist/wishlistSlice";
import { API, KEY } from "@/functions/api";
import { useRouter } from "next/navigation";
import Loading from "@/common/Loading";


interface State {
    title: string,
    season: number,
    poster_mb: string,
    poster_tb: string,
    poster_pc: string,
    story: string,
    genre: string,
    year: number,
    starring: string,
    country: string,
    video: string
}

const Contents = () => {
    //const wishlist = useSelector((state: any) => state.wishlist);
    const dispatch = useDispatch<any>();
    const [values, setValues] = useState<State>({
        title: '',
        season: 1,
        poster_mb: '',
        poster_tb: '',
        poster_pc: '',
        story: '',
        genre: '',
        year: 2020,
        starring: '',
        country: '',
        video: ''
    });
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isHeartFilled, setHeartFilled] = useState<boolean>(false);
    const [heartCount, setHeartCount] = useState<number>(0);
    //const [contentBool, setContentBool] = useState<boolean>(false);
    const [allEPs, setAllEPs] = useState<any>([]);
    const [allSSs, setAllSSs] = useState<any>([]);
    const [related, setRelated] = useState<any>([]);
    const [name, setName] = useState<string>('');
    const [isPlay, setPlay] = useState<boolean>(false);
    let router = useRouter();


    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    const opts: YouTubeProps['opts'] = {
        height: '480',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };
    const loadContents = async () => {
        let name: string = (new URLSearchParams(location.search)).get('n');
        const config = {
            method: 'GET',
            url: `${API}/shows/${name}`,
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
            }
        }
        axios(config)
            .then((res) => {
                setLoading(!isLoading);
                console.log(res.data);
                const newAllEPs: any = [];
                const newAllSSs: any = [];
                const newRelated: any = [];

                setValues({
                    ...values,
                    title: res.data.info.title,
                    season: res.data.info.season,
                    poster_mb: API + res.data.info.poster_mb,
                    poster_tb: API + res.data.info.poster_pc,
                    poster_pc: API + res.data.info.poster_pc,
                    story: res.data.info.story,
                    genre: res.data.info.genre,
                    year: res.data.info.year,
                    starring: res.data.info.starring,
                    country: res.data.info.country,
                    video: res.data.info.yt
                });

                res.data.allEPs.forEach((item: any, index: number) => newAllEPs.push(item));
                setAllEPs(newAllEPs);
                res.data.allSeasons.forEach((item: any, index: number) => newAllSSs.push(item));
                setAllSSs(newAllSSs);
                res.data.related.forEach((item: any, index: number) => newRelated.push(item));
                setRelated(newRelated);

            })
            .catch((err) => { setLoading(!isLoading); console.log('err API: /shows/params'); router.push('./show'); })
    }
    const loadWishList = async () => {
        let name: string = (new URLSearchParams(location.search)).get('n');
        const config = {
            method: 'GET',
            url: `${API}/list-favourite?title=${name}`,
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
            }
        }
        await axios(config)
            //await axios.get('https://api.npoint.io/7ff77ebc636c71d43d6e')

            .then((res) => {
                //console.log(res.data.data)
                let isFilled: boolean = res.data.data;
                //setContentBool(!isFilled);
                //console.log(contentBool);
                switch (isFilled) {
                    case true:
                        setHeartFilled(!isHeartFilled);
                        break;
                    case false:
                        setHeartCount((heartCount) => heartCount += 1);
                        break;
                    case null: case undefined: default:
                        setHeartCount((heartCount) => heartCount += 1);
                        break;
                }
            })
            .catch((err) => {
                console.log('err API: list-favourite');
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
    const addWishList = async () => {
        const data = {
            title: name,
            bool: !isHeartFilled
        }
        const config = {
            method: 'POST',
            url: `${API}/list-favourite`,
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
            .catch((err) => console.log('err API: add-favourite'))
    }

    const handleToggleWishlist = () => {
        switch (isHeartFilled) {
            case true:
                if (heartCount === 0) {
                    setHeartCount((heartCount) => heartCount += 1);
                    setHeartFilled(!isHeartFilled);
                }

                // if heartCount = 0, disable dispatch
                if (heartCount === 1) {
                    setHeartFilled(!isHeartFilled);
                    dispatch(toggleWishlist());

                }
                //send data 'false' or delete title to API mongo
                addWishList();
                break;
            case false:
                if (heartCount === 1) {
                    setHeartFilled(!isHeartFilled);
                    dispatch(toggleWishlist());
                }
                addWishList();
                break;
        }
    }

    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }
        setName((new URLSearchParams(window.location.search)).get('n'));

        loadContents();
        loadWishList();

        Cookies.set('TVnow oldPath', window.location.href, { sameSite: 'strict' });
    }, []);

    return (
        <>
            <Header />
            <main className="main scroll-y">
                <article data-name='show__headline'>
                    <ContentHeadlineShow
                        poster_mb={values.poster_mb}
                        poster_tb={values.poster_tb}
                        poster_pc={values.poster_pc}
                        title={values.title.toLocaleUpperCase()}
                        storySubstringMb={values.story.substring(0, 100)}
                        storyLength={values.story.length}
                        storySubstringTb={values.story.substring(0, 200)}
                        storyPc={values.story}
                        onPlay={() => setPlay(!isPlay)}
                        onWishlist={handleToggleWishlist}
                        //imgWishlist={wishlist.filled ? '../heart-filled.png': '../heart.png'}
                        imgWishlist={isHeartFilled ? '../heart-filled.png' : '../heart.png'}
                    />
                    <div onClick={() => { setPlay(!isPlay); }} className={isPlay ? `${styled["show__overlay"]} dp-block` : `${styled["show__overlay"]} dp-none`}>
                        <div className={`abs ${styled['show__yt']}`}>
                            <YouTube videoId={values.video} opts={opts} onReady={onPlayerReady} />
                        </div>

                    </div>
                </article>
                <div className="div-content-long div-center padd-default">
                    <ContentEp
                        scrollXep={scrollXep}
                        scrollInvertXep={scrollInvertXep}
                        allEPs={allEPs.map((el: any, i: number) => {
                            return <div key={i} className="rel dp-inline-block">
                                <a href={'contents_show?n=' + (el.url).replace(query_path, '')}><div className={styled['show__hr-overlay']}>
                                    <div className={styled['show__hr-txt']}>{el.ep}</div>
                                </div>
                                    <img src={API + el.img} />
                                    <span className="abs">{el.ep}</span></a>
                            </div>
                        })}
                    />
                    <ContentSs
                        scrollXss={scrollXss}
                        scrollInvertXss={scrollInvertXss}
                        allSSs={allSSs.map((el: any, i: number) => {
                            return <div key={i} className="rel dp-inline-block">
                                <a href={'contents_show?n=' + (el.url).replace(query_path, '')}><div className={styled['show__hr-overlay']}>
                                    <div className={styled['show__hr-txt']}>{el.season}</div>
                                </div>
                                    <img src={API + el.img} />
                                    <span className="abs">{el.season}</span></a>
                            </div>
                        })}
                    />
                    <ContentRelated
                        scrollXrelated={scrollXrelated}
                        scrollInvertXrelated={scrollInvertXrelated}
                        related={related.map((el: any, i: number) => {
                            return <div key={i} className="rel dp-inline-block">
                                <a href={'contents_show?n=' + (el.url).replace(query_path, '')}><div className={styled['show__hr-overlay']}>
                                    <div className={styled['show__hr-txt']}>{el.title}</div>
                                </div>
                                    <img src={API + el.img} />
                                    <span className="abs mobile">{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span>
                                    <span className="abs tablet">{el.title.substring(0, 20)}{el.title.length >= 20 && '...'}</span>
                                    <span className="abs pc">{el.title.substring(0, 22)}{el.title.length >= 22 && '...'}</span></a>
                            </div>
                        })}
                    />
                </div>
                <div className="div-ghost"></div>
                {/*modal Loading */}
                {isLoading && (<Loading />)}
            </main >
            <Footer />
        </>
    );
}

export default Contents;
