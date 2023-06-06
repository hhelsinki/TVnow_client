import { ContentHeadlineSEO, ContentRelatedSEO } from "@/parts/seo/content";
import HeaderSEO from "@/parts/seo/header";
import Head from "next/head";
import styled from '../shows/show.module.scss';
import LoginSEO from "@/parts/seo/login";
import FooterSEO from "@/parts/seo/footer";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { API, KEY } from "@/functions/api";
import Cookies from "js-cookie";
import axios from "axios";
import { scrollInvertXrelated, scrollXrelated } from "@/functions/scrollX";

interface State {
    title: string,
    poster_mb: string,
    poster_tb: string,
    poster_pc: string,
    story: string,
    genre: string,
    year: number,
    starring: string,
    country: string
}

const Interstellar = () => {
    const router = useRouter();
    const loginSeo = useSelector((state:any) => state.loginSeo);
    //const query = router.pathname.replace(query_path, '');
    const [values, setValues] = useState<State>({
        title: '',
        poster_mb: '',
        poster_tb: '',
        poster_pc: '',
        story: '',
        genre: '',
        year: 2020,
        starring: '',
        country: ''
    });
    const [related, setRelated] = useState<any>([]);

    const loadContents = async () => {
        const config = {
            method: 'GET',
            url: `${API}${router.pathname}`,
            headers: {
                'api-key': KEY,
                'user-token': Cookies.get('TVnow_Login_Token')
                }
        }
        await axios(config)
            .then((res) => {
                console.log(res.data)
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
                });

                res.data.related.forEach((item: any, index: number) => newRelated.push(item));
                setRelated(newRelated);
            })
            .catch((err) => { console.log(err); console.log('err API: movies/query') })
    }

    useEffect(() => {
        loadContents();


        Cookies.set('TVnow oldPath', window.location.pathname, { sameSite: 'strict' });
    }, []);
    
    return (
        <>
            <Head>
                <title>TVnow: Interstellar</title>
                <meta name="description" content="Watch Interstellar Movie" />
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

export default Interstellar;