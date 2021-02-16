import React from "react";
import axios from "axios";
// import "./App.css";
import styles from "./App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    /**
     * axios performs asynchronous request to remote API's
     * takes the url as an argument and returns a promise
     */
    try {
      const result = await axios.get(url);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  React.useEffect(() => {
    /**
     * useCallback hook creates a memoized function every time its dependency array changes
     * as a result, useEffect hook runs again bc it depends on new function
     */
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // localStorage.setItem("search", event.target.value);
  };

  // const searchedStories = stories.data.filter((story) => {
  //   return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  return (
    <div className="container">
      <h1 className="headline-primary"> My Hacker Stories</h1>

      <SearchForm
        onSearchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p> Something went wrong ... </p>}

      {/* conditional rendering in JSX */}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const storiesReducer = (state, action) => {
  console.log(state);
  console.log(action.type);

  // refactor to switch statement
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  // create ref with useRef hook; has persistent value stays intact over the lifetime of the component
  // ref comes with property current; in contrast to ref, current is changeable
  const inputRef = React.useRef();

  // useEffect hook performing focuse on input field when component renders (or dependencies change)
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // current changes and executes focus programmatically as side-effect
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className="label"> {children} </label>
      &nbsp;
      {/* ref={inputRed}: assigned to changable current property */}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLabel
      id="search"
      label="Search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong> Search : </strong>
    </InputWithLabel>

    <button
      type="button"
      disabled={!searchTerm}
      className="button button_large"
      // onClick={handleSearchSubmit}
    >
      {" "}
      Submit{" "}
    </button>
  </form>
);

const List = ({ list, onRemoveItem }) =>
  /**
   * spread operator: allows to spread all key/value pairs of an object to another object
   *  - instead of passing each property one at a time via props from List to Item component,
   *    we can use Javascripts spead operator to pass all the object's key/value pairs as
   *    attribute/value pairs to a JSX element
   *
   *  rest parameters: allows a function to accept an infinite number of arguments as an array,
   *                    providing a way to represent variadic functions in js
   *   - happens always as the last part of an object destructing; on the right side of an assignment
   *   - always used to seperate an object from some of its properties
   */
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => {
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };
  return (
    <div className="item">
      <span style={{ width: '40%'}}>
        <a href={item.url}> {item.title} </a>
      </span>

      <span style={{ width: '30%'}}>{item.author}</span>
      <span style={{ width: '10%'}}>{item.num_comments}</span>
      <span style={{ width: '10%'}}>{item.points}</span>
      <span style={{ width: '10%'}}>
        {/* inline handlers: allows to excute the function in JSX
            Bind Method: onClick={onRemoveItem.bind(null,item)}
            (do not use for complex functions) Wrapping Arrow Function: onClick={() => onRemoveItem(item)} 
        */}
        <button type="button" onClick={onRemoveItem.bind(null, item)} className="button button_small">
          Dismiss
        </button>
      </span>
    </div>
  );
};

const useSemiPersistentState = (key, initialState) => {
  /** useSemiPersistantState: custom hook
   *  - pass in a key in order to fix overwrite of the 'value' allocated in local storage
   *    when custom hook is used more than once
   *  - give custom hook initial state from outside
   *  - manages state yet synchronizes with the local storage
   *  - no fully consistent; clearing local storage browser deletes relevant data from application
   */
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

const getAsyncStories = () =>
  /**
   *  creating delay for network request API delays
   *  delay when resolving the promise
   */
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  );

const Search = ({ search, onSearch }) => {
  /**
   * searchTerm: represents the current state
   * setSearchTerm: a function to update this state (state updater function)
   * useState: used to make the application interactive
   * useEffect: used to opt into the lifecycle of your components
   */

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") || "React"
  );

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      {/* React Fragment: wraps other elements into a single top-level element without adding to rendered output */}
      {/* Synthetic Event: using browsers developer tools see loggin occur after you type into the input field */}
      {/* do not onChange={ handleChange() } */}

      <label key="1" htmlFor="search">
        {" "}
        Search:{" "}
      </label>
      <input id="search" type="text" value={search} onChange={onSearch} />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </>
  );
};

export default App;

/**  NOTES
 *  Memoixed Handler
 *    1. Move all data fetching logic into a standalone function outside the side-effect
 *    2. Wrap into a useCallback hook
 *    3. Invoke it in useEffect hook
 *
 *  Template Literal
 *    const greeting = 'Hello';
 *    const anotherWelcome = `${greeting} React`;
 *    console.log(anotherWelcome);
 *
 *  React State
 *   - react props: used to pass information down the component tree
 *   - react state: used to make applications interactive
 *
 *   - useState: utility function for managing state; a hook
 *
 *   Basic array definition
 *     const list = ['a', 'b'];
 *
 *   No Array Destructing
 *     const itemOne = list[0];
 *     const itemTwo = list[1];
 *
 *   Array Destructing: shorthand version of accessing each item one by one; concise syntax
 *                      and ability to name destructed variables
 *     const [firstItem, secondItem] = list;
 */

/** Refactoring of Components
 * function declaration
 *  function () {...}
 *
 * arrow function declaration
 *  const () => {...}
 *
 * ALLOWED
 *  const item => {...}
 *  const (item) => {...}
 *  const (item, index) => {...}
 *
 * NOT ALLOWED
 *  const item, index => {...}
 *
 * Notes:
 *  - defining React function components with arrow functions make them more concise
 *  - this refactoring concept holds true for other functions
 *    ex: const App = () => {...}
 *    ex: const List = () => {...}
 *    ex: return list.map(item => {
 *          return(<div>...</div);
 *        });
 *
 *  - in a consice body, an implicit return statement is attached, so the return statement is not necessary
 *    ex: concise body
 *        count =>
 *          count + 1
 *
 *    ex: with block body
 *        count => {
 *          // perform any task here
 *          return count + 1;
 *        }
 *
 */
