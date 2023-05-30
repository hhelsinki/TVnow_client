import Link from 'next/link';
import styled from '../pages/shows/show.module.scss';

const ContentHeadlineShow = (props: any) => {
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
                    <Link href='show'><img src="../left-arrow.png" className={`abs ${styled['show__headline-btn--back']}`} /></Link>
                    <div className={`${styled['show__headline-txt']} abs`}>
                        <h1>{props.title}</h1>
                        <div className="mobile"><p>{props.storySubstringMb}{props.storyLength >= 100 && '...'}</p></div>
                        <div className="tablet"><p>{props.storySubstringTb}{props.storyLength >= 200 && '...'}</p></div>
                        <div className="pc"><p>{props.storyPc}</p></div>
                        <img onClick={props.onPlay} src="../play.png" className='cursor'/>
                        <img onClick={props.onWishlist} src={props.imgWishlist} className='cursor'/>
                    </div>
                </div>
                <div>
                
                </div>
            </section>
        </>

    );
}
const ContentEp = (props: any) => {
    return (
        <article data-name='show__episode'>
            <h3>All EPs</h3>
            <section id='ep_container' className="rel">
                <div onClick={props.scrollXep} className={`${styled['show__gallery-panel--right']} abs cursor`}></div>
                <div onClick={props.scrollInvertXep} className={`${styled['show__gallery-panel--left']} abs cursor`}></div>
                <div id="ep_scroll" className={`${styled['show__title-img']} scroll-hidden`}>
                    {props.allEPs}
                </div>
            </section>
        </article>
    );
}
const ContentSs = (props: any) => {
    return (
        <article data-name='show__season'>
            <h2>All Seasons</h2>
            <section id='ss_container' className="rel">
                <div onClick={props.scrollXss} className={`${styled['show__gallery-panel--right']} abs cursor`}></div>
                <div onClick={props.scrollInvertXss} className={`${styled['show__gallery-panel--left']} abs cursor`}></div>
                <div id="ss_scroll" className={`${styled['show__title-img']} scroll-hidden`}>
                    {props.allSSs}
                </div>
            </section>

        </article>
    );
}

export { ContentHeadlineShow, ContentEp, ContentSs };
