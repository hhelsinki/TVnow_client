import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from './show.module.scss';
import Cookies from "js-cookie";
import { ContentHeadlineSEO, ContentRelatedSEO, ContentSsSEO } from "@/parts/seo/content";
import { scrollInvertXrelated, scrollInvertXss, scrollXrelated, scrollXss } from "@/functions/scrollX";
import LoginSEO from "@/parts/seo/login";
import HeaderSEO from "@/parts/seo/header";
import FooterSEO from "@/parts/seo/footer";
import { useSelector } from "react-redux";
import { API, KEY } from "@/functions/api";
//import { query_path } from "@/functions/query";

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
    country: string
}

const TheCrown = () => {
    const router = useRouter();
    const loginSeo = useSelector((state:any) => state.loginSeo);
    //const query = router.pathname.replace(query_path, '');
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
        country: ''
    });
    const [allSSs, setAllSSs] = useState<any>([]);
    const [related, setRelated] = useState<any>([]);

    const loadContents = async () => {
        const config = {
            method: 'GET',
            url: `${API}${router.pathname}-season-1`,
            headers: {
'api-key': KEY,
'user-token': Cookies.get('TVnow_Login_Token')
}
        }
        await axios(config)
            .then((res) => {
                console.log(res.data)
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
                });

                res.data.allSeasons.forEach((item: any, index: number) => newAllSSs.push(item));
                setAllSSs(newAllSSs);
                res.data.related.forEach((item: any, index: number) => newRelated.push(item));
                setRelated(newRelated);
            })
            .catch((err) => { console.log(err); console.log('err API: shows/query-season-1') })
    }

    useEffect(() => {
        loadContents();

        /*let loginToken: any = Cookies.get('TVnow_Login_Token');
        switch (loginToken) {
            case null:
            case undefined:
            case false:
                window.location.href = '/';
                break;
            default:
                break;
        }*/


        Cookies.set('TVnow oldPath', window.location.pathname, { sameSite: 'strict' });
    }, []);


    return (
        <>
            <Head>
                <title>TVnow: The Crown</title>
                <meta name="description" content="Watch The Crown Season 1" />
            </Head>
            <HeaderSEO />
            <main className="main scroll-y">
                <article data-name='show__headline'>
                    <ContentHeadlineSEO
                        poster_mb={values.poster_mb}
                        poster_tb={values.poster_tb}
                        poster_pc={values.poster_pc}
                        title={values.title.toLocaleUpperCase()}
                        storySubstringMb={values.story.substring(0, 100)}
                        storyLength={values.story.length}
                        storySubstringTb={values.story.substring(0, 200)}
                        storyPc={values.story}
                    />
                </article>
                <div className="div-content-long div-center padd-default">
                    <ContentSsSEO
                        scrollXss={scrollXss}
                        scrollInvertXss={scrollInvertXss}
                        allSSs={allSSs.map((el: any, i: number) => {
                            return <div key={i} className="rel dp-inline-block">
                                <div className={`${styled['show__hr-overlay']} cursor`}>
                                    <div className={styled['show__hr-txt']}>{el.season}</div>
                                </div>
                                    <img src={API + el.img} />
                                    <span className="abs">{el.season}</span>
                            </div>
                        })}
                    />
                    <ContentRelatedSEO
                        scrollXrelated={scrollXrelated}
                        scrollInvertXrelated={scrollInvertXrelated}
                        related={related.map((el: any, i: number) => {
                            return <div key={i} className="rel dp-inline-block">
                               <div className={`${styled['show__hr-overlay']} cursor`}>
                                    <div className={styled['show__hr-txt']}>{el.title}</div>
                                </div>
                                    <img src={API + el.img} />
                                    <span className="abs mobile">{el.title.substring(0, 10)}{el.title.length >= 10 && '...'}</span>
                                    <span className="abs tablet">{el.title.substring(0, 20)}{el.title.length >= 20 && '...'}</span>
                                    <span className="abs pc">{el.title.substring(0, 25)}{el.title.length >= 25 && '...'}</span>
                            </div>
                        })}
                    />
                    {/*<a href={`../contents?n=${query}`}><button>Go to watch</button></a>*/}
                </div>
                <div className="div-ghost"></div>
                {loginSeo.enable && <LoginSEO />}
            </main >
            <FooterSEO />
        </>
    );
}

export default TheCrown;