const scrollXep = () => {
    const scroll = document.getElementById('ep_scroll');
    var container = document.getElementById('ep_container');
    var px = (75 * (container.clientWidth)) / 100;
    scroll.scrollLeft += px;
}
const scrollInvertXep = () => {
    const scroll = document.getElementById('ep_scroll');
    var container = document.getElementById('ep_container');
    var px = (75 * (container.clientWidth)) / 100;
    scroll.scrollLeft -= px;
}
const scrollXss = () => {
    const scroll = document.getElementById('ss_scroll');
    var container = document.getElementById('ss_container');
    var px = (75 * (container.clientWidth)) / 100;
    scroll.scrollLeft += px;
}
const scrollInvertXss = () => {
    const scroll = document.getElementById('ss_scroll');
    var container = document.getElementById('ss_container');
    var px = (75 * (container.clientWidth)) / 100;
    scroll.scrollLeft -= px;
}
const scrollXrelated = () => {
    const scroll = document.getElementById('related_scroll');
    var container = document.getElementById('related_container');
    var px = (75 * (container.clientWidth)) / 100;
    scroll.scrollLeft += px;
}
const scrollInvertXrelated = () => {
    const scroll = document.getElementById('related_scroll');
    var container = document.getElementById('related_container');
    var px = (75 * (container.clientWidth)) / 100;
    scroll.scrollLeft -= px;
}

export {scrollXep, scrollInvertXep, scrollXss, scrollInvertXss, scrollXrelated, scrollInvertXrelated};