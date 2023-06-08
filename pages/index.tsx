import Head from 'next/head'
import Image from 'next/image'
//import styles from '@/styles/Home.module.css'
import styled from '@/styles/welcome.module.scss';
import Link from 'next/link'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
//import { useSelector } from 'react-redux'


export default function Home() {
  //const message = useSelector((state:any) => state.txt.msg);
  let router = useRouter();

  useEffect(() => {
    document.body.style.backgroundImage = 'url("/bg.jpg")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'none';

    let authToken = Cookies.get('TVnow_Login_Token');

    if (authToken) {
      router.push('/home');
    }


  }, []);

  return (
    <>
      <Head>
        <title>TVnow</title>
        <meta name="description" content="Watch your favourite Movies and TV Shows" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section style={{ content: '""', background: 'linear-gradient(rgba(0, 0, 0,.9) , rgba(0,0,0,.8), black)', position: 'absolute', width: '100%', height: '100%', opacity: '.8' }}></section>

      <section className="rel">
        <header className={styled['wel__header']}>
          <div className={`rel ${styled['wel__content']} div-center`}>
            <a href='/' className="font-m">TVnow</a>
            <a href="/login" className={`abs ${styled['wel__btn-login']} font-m`}>Sign In</a>
          </div>
        </header>

        <main className={`${styled['wel__main']} scroll-y`}>
          <div className={`${styled['wel__content']} div-center`}>
            <article className={`${styled['wel__trial']} txt-center`}>
              <h4>TRY UP TO 1 MONTH FREE</h4>
              <h1>TVnow</h1>
              <h2>Watch thousands of shows and movies, starting only at 5.99$</h2>
              <br />
              <a href="/register-I"><button className={styled['wel__trial-url']}>START YOUR FREE TRIAL</button></a>
            </article>
          </div>
        </main>

        <footer className={`abs ${styled['wel__footer']}`}>
          <ul className='txt-center col-grey'>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Do Not Sell My Personal Information</li>
            <li>© 2023 TVnow</li>
          </ul>
        </footer>

      </section>
    </>
  )
}
