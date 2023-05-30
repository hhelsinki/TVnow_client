import AutoCompleteSearch from "@/common/search/AutoCompleteSearch";
import { useState } from "react";
import { autoCompleteData } from '@/common/search/data.js';

const Header = () => {
    const [isActiveSearch, setActiveSearch] = useState<boolean>(false);

    return (
        <header className="header rel">
            <div className="div-content div-center">
                <div className="dp-flex">
                    <section className="header-nav">
                        <span className="abs font-m font-bold col-grey-dark">TVnow</span>
                    </section>
                    <section className="header-nav">
                        <img onClick={() => setActiveSearch(!isActiveSearch)} src="../navi/search.png" className="abs cursor" />
                    </section>
                </div>
            </div>
            {isActiveSearch && (<div data-name='search' className='header-search fixed bg-prim'>
                <div className="dp-flex ">
                    <div className="header-search--left">
                        <img onClick={() => setActiveSearch(!isActiveSearch)} src="../left-arrow.png" className="abs" />
                    </div>
                    <div className="header-search--mid">
                        <AutoCompleteSearch data={autoCompleteData} />
                    </div>
                </div>
            </div>)}

        </header>
    );
}

export default Header;