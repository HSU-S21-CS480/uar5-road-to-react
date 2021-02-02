import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Container, Row, Col } from "react-bootstrap";
// import DataList from '../src/components/DataList'

const welcome = {
  greeting: "Good Morning!",
};

function getTitle(title) {
  return "My " + title;
}

// refactor: component-definition
const App = () => {
  /**
   * before the return is standard javascript
   * inside the return is HTML
   * never use var
   * let can before maluable
   */
  const stories = [
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

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  };

  const searchedStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="App">
      <h1> {getTitle("Hacker Stories")}</h1>
      <p> {welcome.greeting} </p>

      <Search onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />

      {/* <DataList list={list}></DataList> */}
    </div>
  );
};

const List = ({ list }) =>
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
  list.map(({ objectID, ...item}) => <Item key={ objectID} {...item} />);

const Item = ({ title, url, author, num_comments, points }) => (
  <div>
    <span>
      <a href={url}> {title} </a>
    </span>

    <span>{ author }</span>
    <span>{ num_comments }</span>
    <span>{ points }</span>
  </div>
);
const Search = ({ search, onSearch }) => {
  // searchTerm: represents the current state
  // setSearchTerm: a function to update this state (state updater function)
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React');
  
  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      {/* Synthetic Event: using browsers developer tools see loggin occur after you type into the input field */}
      {/* do not onChange={ handleChange() } */}

      <label htmlFor="search"> Search: </label>
      <input id="search" type="text" value={search} onChange={onSearch} />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );
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