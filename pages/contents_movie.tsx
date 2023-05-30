import Footer from "@/parts/footer";
import Header from "@/parts/header";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from './shows/show.module.scss';
import Cookies from "js-cookie";
import { ContentRelated } from "@/parts/related";
import { scrollInvertXrelated, scrollXrelated } from "@/functions/scrollX";
import { query_path } from "@/functions/query";
import { ContentHeadlineMovie } from "@/parts/movie";
import YouTube, { YouTubeProps } from 'react-youtube';
import { API, baseKeyApi } from "@/functions/api";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { toggleWishlist } from "@/redux/wishlist/wishlistSlice";
import Loading from "@/common/Loading";

interface State {
    title: string,
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
    const [values, setValues] = useState<State>({
        title: '',
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
    const [related, setRelated] = useState<any>([]);
    const [name, setName] = useState<string>('');
    const [isPlay, setPlay] = useState<boolean>(false);
    let router = useRouter();
    let dispatch = useDispatch<any>();

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
    const loadContents = () => {
        let name:string = (new URLSearchParams(location.search)).get('n');
        const config = {
            method: 'GET',
            url: `${API}/movies/${name}`,
            headers: {
                api_key: baseKeyApi,
                user_token: Cookies.get('TVnow_Login_Token')
            }
        }
        
        axios(config)
            .then((res) => {
                setLoading(!isLoading);
                console.log(res.data);
                const newRelated: any = [];

                setValues({
                    ...values,
                    title: res.data.info.title,
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

                res.data.related.forEach((item: any, index: number) => newRelated.push(item));
                setRelated(newRelated);

            })
            .catch((err) => {
                setLoading(!isLoading); 
                console.log('err API: /movies/params'); 
                router.push('./movie'); 
            })
    }
    const loadWishList = async () => {
        let name:string = (new URLSearchParams(location.search)).get('n');
        const config = {
            method: 'GET',
            url: `${API}/list-favourite?title=${name}`,
            headers: {
                api_key: baseKeyApi,
                user_token: Cookies.get('TVnow_Login_Token')
            }
        }
        await axios(config)
            //await axios.get('https://api.npoint.io/7ff77ebc636c71d43d6e')

            .then((res) => {
                //console.log(res.data.data)
                let isFilled: boolean = res.data.data;
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
                if (err.response.status === 401 || err.response.status === 402) {
                    Cookies.set('TVnow_Login_Token', '', { sameSite: 'strict' });
                    router.push('/login');
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
                api_key: baseKeyApi,
                user_token: Cookies.get('TVnow_Login_Token')
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
                    <ContentHeadlineMovie
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
                        imgWishlist={isHeartFilled ? '../heart-filled.png' : '../heart.png'}
                    />
                    <div onClick={() => { setPlay(!isPlay); }} className={isPlay ? `${styled["show__overlay"]} dp-block` : `${styled["show__overlay"]} dp-none`}>
                        <div className={`abs ${styled['show__yt']}`}>
                            <YouTube videoId={values.video} opts={opts} onReady={onPlayerReady} />
                        </div>
                    </div>
                </article>
                <div className="div-content-long div-center padd-default">
                    <ContentRelated
                        scrollXrelated={scrollXrelated}
                        scrollInvertXrelated={scrollInvertXrelated}
                        related={related.map((el: any, i: number) => {
                            return <div key={i} className="rel dp-inline-block">
                                <a href={'contents_movie?n=' + (el.url).replace(query_path, '')}><div className={styled['show__hr-overlay']}>
                                    <div className={styled['show__hr-txt']}>{el.title}</div>
                                </div>
                                    <img src={"http://localhost:3001" + el.img} />
                                    <span className="abs mobile">{el.title.substring(0,10)}{el.title.length >= 10 && '...'}</span>
                                    <span className="abs tablet">{el.title.substring(0,20)}{el.title.length >= 20 && '...'}</span>
                                    <span className="abs pc">{el.title.substring(0,22)}{el.title.length >= 22 && '...'}</span></a>
                            </div>
                        })}
                    />
                </div>
                <div className="div-ghost"></div>
                {/*modal Loading */}
                {isLoading && (<Loading/>)}
            </main >
            <Footer />
        </>
    );
}

export default Contents;