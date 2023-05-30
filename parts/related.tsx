import styled from '../pages/shows/show.module.scss';

const ContentRelated = (props: any) => {
    return (
        <article data-name='show__related'>
            <h2>You May also Like</h2>
            <section id='related_container' className="rel">
                <div onClick={props.scrollXrelated} className={`${styled['show__gallery-panel--right']} abs cursor`}></div>
                <div onClick={props.scrollInvertXrelated} className={`${styled['show__gallery-panel--left']} abs cursor`}></div>
                <div id="related_scroll" className={`${styled['show__title-img']} scroll-hidden`}>
                    {props.related}
                </div>
            </section>
        </article>
    );
}

export {ContentRelated};

