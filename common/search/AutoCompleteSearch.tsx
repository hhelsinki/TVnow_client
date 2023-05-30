import { API, baseKeyApi } from "@/functions/api";
import axios from "axios";
import { useState } from "react";
import Loading from "../Loading";
import Cookies from "js-cookie";

function AutoCompleteSearch({ data }: any) {
  const [suggestions, setSuggestions] = useState<any>([]);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const handleChange = (e: any) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    if (query.length > 1) {
      const filterSuggestions = data.filter(
        (suggestion: any) =>
          suggestion.toLowerCase().indexOf(query) > -1
      );
      setSuggestions(filterSuggestions);
      setSuggestionsActive(true);
    } else {
      setSuggestionsActive(false);
    }
  };

  const handleClick = (e: any) => {
    setSuggestions([]);
    setValue(e.target.innerText.toLowerCase());
    setSuggestionsActive(false);
  };

  const handleKeyDown = (e: any) => {
    // UP ARROW
    if (e.keyCode === 38) {
      if (suggestionIndex === 0) {
        return;
      }
      setSuggestionIndex(suggestionIndex - 1);
    }
    // DOWN ARROW
    else if (e.keyCode === 40) {
      if (suggestionIndex - 1 === suggestions.length) {
        return;
      }
      setSuggestionIndex(suggestionIndex + 1);
    }
    // ENTER
    else if (e.keyCode === 13) {
      setValue(suggestions[suggestionIndex]);
      setSuggestionIndex(0);
      setSuggestionsActive(false);
    }
  };

  const Suggestions = () => {
    return (
      <ul className="header-search--autofill capitalize text-lg col-grey">
        {suggestions.map((suggestion, index) => {
          return (
            <li
              className={index === suggestionIndex ? "list-none col-white" : "list-none"}
              key={index}
              onClick={handleClick}
            >
              {suggestion}
            </li>
          );
        })}
      </ul>
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true)

    const config = {
      method: 'GET',
      url: `${API}/search?name=${value}`,
      headers: {
        api_key: baseKeyApi,
        user_token: Cookies.get('TVnow_Login_Token')
      }
    }
    await axios(config)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        switch (res.data.title) {
          case null: case undefined:
            console.log('cannot find content')
            break;
          default:
            //router.push(res.data.url);
            window.location.href = res.data.url;
            break;
        }
      })
      .catch((err) => { setLoading(false); console.log(data); console.log('err api: search?name=value') })
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" className="abs bd-zero text-lg" placeholder="Search..." autoFocus
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className='bd-zero' style={{ background: 'var(--bg-prim)'}}><img src="/navi/search-active.png" className="abs cursor" /></button>
      </form>
      {suggestionsActive && <Suggestions />}
      {isLoading && <Loading />}
    </>

  );

};

export default AutoCompleteSearch;