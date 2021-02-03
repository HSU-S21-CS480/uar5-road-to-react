import React, { Children } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import DataList from "../src/components/DataList";

// refactor: component-definition
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, setStories] = React.useState(initialStories);

  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    localStorage.setItem("search", event.target.value);
  };

  const searchedStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="App">
      <h1> My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong> Search : </strong>
      </InputWithLabel>

      {/* <Search onSearch={handleSearch} /> */}
      <hr />
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />

      {/* <DataList list={list}></DataList> */}
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

const getAsyncStories = () => 
  Promise.resolve({ data: { stories: initialStories }});

const InputWithLabel = ({
  id,
  label,
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
      <label htmlFor={id}> {children} </label>
      &nbsp;
      {/* ref={inputRed}: assigned to changable current property */}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};

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
  list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

  
const Item = ({ item, onRemoveItem }) => {
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };
  return (
    <div>
      <span>
        <a href={item.url}> {item.title} </a>
      </span>

      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        {/* inline handlers: allows to excute the function in JSX
            Bind Method: onClick={onRemoveItem.bind(null,item)}
            (do not use for complex functions) Wrapping Arrow Function: onClick={() => onRemoveItem(item)} 
        */}
        <button type="button" onClick={onRemoveItem.bind(null,item)}>
          Dismiss
        </button>
      </span>
    </div>
  );
};


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

class Developer {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getName() {
    return this.firstName + " " + this.lastName;
  }
}

const robin = new Developer("Robin", "Wieruch");
const dennis = new Developer("Dennis", "Wieruch");

console.log(robin.getName());
console.log(dennis.getName());

export default App;

/**  NOTES
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
