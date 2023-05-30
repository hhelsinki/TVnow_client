import { useEffect, useState } from "react";
import styled from '../shows/show.module.scss';
import Cookies from "js-cookie";
import Header from "@/parts/header";
import Footer from "@/parts/footer";
import { query_path } from "@/functions/query";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CateAction = () => {
    const [contents, setContents] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    let router = useRouter();

    useEffect(() => {
        //Login Logout
        let authToken = Cookies.get('TVnow_Login_Token');

        if (!authToken) {
            router.push('/login');
        }


        Cookies.set('TVnow oldPath', window.location.pathname, { sameSite: 'strict' });
    }, []);

    return (
        <>
            <Header />
            <main className="main">
                <div className={`${styled.content} div-center padd-default`}>
                    <section className={`${styled["show__intro-txt"]} col-grey`}>
                        <ul className="list-style-none text-base">
                            <Link href="./home"><li className="dp-inline-block">All</li></Link>
                            <Link href="./show"><li className="dp-inline-block">TV Shows</li></Link>
                            <Link href="./movie"><li className="dp-inline-block">Movies</li></Link>
                            <Link href="category/type?filter=cateAction"><li className="dp-inline-block">Action</li></Link>
                            <Link href="./category"><li className="dp-inline-block col-white">Category</li></Link>
                        </ul>
                    </section>

                    <section>
                        <h1>Category</h1>
                    </section>

                    <section>
                        <div className={`dp-grid ${styled['show__cate']} txt-center`}>
                            <Link href='./show'><div className={styled.shows}>Shows</div></Link>
                            <Link href='./movie'><div className={styled.movies}>Movies</div></Link>
                            <Link href='category/type?filter=cateAction'><div className={styled.action}>Action</div></Link>
                            <Link href='category/type?filter=cateRomance'><div className={styled.romance}>Romance</div></Link>
                            <Link href='category/type?filter=cateCrime'><div className={styled.crime}>Crime</div></Link>
                            <Link href='category/type?filter=cateComedy'><div className={styled.comedy}>Comedy</div></Link>
                            <Link href='category/type?filter=cateThriller'><div className={styled.thriller}>Thriller</div></Link>
                            <Link href='category/type?filter=cateFantasy'><div className={styled.fantasy}>Fantasy</div></Link>
                            <Link href='category/type?filter=cateLGBTQ'><div className={styled.lgbtq}>LGBTQ</div></Link>
                            <Link href='category/type?filter=cateCartoon'><div className={styled.cartoon}>Cartoon</div></Link>
                            <Link href='category/type?filter=cateDrama'><div className={styled.drama}>Drama</div></Link>
                            <Link href='category/type?filter=cateHorror'><div className={styled.horror}>Horror</div></Link>
                            <Link href='category/type?filter=cateSuspense'><div className={styled.suspense}>Suspense</div></Link>
                            <Link href='category/type?filter=cateScifi'><div className={styled.scifi}>Sci-fi</div></Link>
                        </div>

                        <div className="div-ghost"></div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default CateAction;