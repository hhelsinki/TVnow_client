import Link from 'next/link';
import styled from '../pages/shows/show.module.scss';

const ContentHeadlineMovie = (props: any) => {
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
                    <Link href='movie'><img src="../left-arrow.png" className={`abs ${styled['show__headline-btn--back']}`} /></Link>
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

export { ContentHeadlineMovie };