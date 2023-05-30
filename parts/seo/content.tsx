import styled from '@/pages/shows/show.module.scss';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '@/redux/loginSeo/loginSeoSlice';

const ContentHeadlineSEO = (props:any) => {
    let dispatch = useDispatch();

    return (
        <>
            <section className={`${styled.show__headline} rel`}>
                <div className={`${styled['show__headline-theme']} abs`}></div>
                <div className={styled['show__headline-bg']}>
                    <div style={{ backgroundImage: `url(${props.poster_mb})` }} className={`${styled['show__headline-poster']} div-center mobile`}></div>
                    <div style={{ backgroundImage: `url(${props.poster_tb})` }} className={`${styled['show__headline-poster']} div-center tablet`}></div>
                    <div style={{ backgroundImage: `url(${props.poster_pc})` }} className={`${styled['show__headline-poster']} div-center pc`}>
                    </div>
                </div>

                <div className="padd-default">
                    <div className={`${styled['show__headline-txt']} abs`}>
                        <h1>{props.title}</h1>
                        <div className="mobile">{props.storySubstringMb}{props.storyLength >= 100 && '...'}</div>
                        <div className="tablet">{props.storySubstringTb}{props.storyLength >= 200 && '...'}</div>
                        <div className="pc">{props.storyPc}</div>
                        <img src="../play.png" className='cursor' onClick={()=> dispatch(toggleLogin())}/>
                        <span onClick={()=> dispatch(toggleLogin())} className='abs cursor' style={{marginTop:'2rem', marginLeft:'.5rem'}}>Play</span>
                    </div>
                </div>
            </section>
        </>

    );
}

const ContentSsSEO = (props: any) => {
    let dispatch = useDispatch();

    return (
        <article data-name='show__season'>
            <h2>All Seasons</h2>
            <section id='ss_container' onClick={()=> dispatch(toggleLogin())} className="rel cursor">
                <div onClick={props.scrollXss} className={`${styled['show__gallery-panel--right']} abs`}></div>
                <div onClick={props.scrollInvertXss} className={`${styled['show__gallery-panel--left']} abs`}></div>
                <div id="ss_scroll" className={`${styled['show__title-img']} scroll-hidden`}>
                    {props.allSSs}
                </div>
            </section>

        </article>
    );
}
const ContentRelatedSEO = (props: any) => {
    let dispatch = useDispatch();
    return (
        <article data-name='show__related'>
            <h2>You May also Like</h2>
            <section id='related_container' onClick={()=> dispatch(toggleLogin())} className="rel cursor">
                <div onClick={props.scrollXrelated} className={`${styled['show__gallery-panel--right']} abs`}></div>
                <div onClick={props.scrollInvertXrelated} className={`${styled['show__gallery-panel--left']} abs`}></div>
                <div id="related_scroll" className={`${styled['show__title-img']} scroll-hidden`}>
                    {props.related}
                </div>
            </section>
        </article>
    );
}

export { ContentHeadlineSEO, ContentSsSEO, ContentRelatedSEO };

