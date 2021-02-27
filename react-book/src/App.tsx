import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from 'styled-components';
import { ReactComponent as Check } from "./check.svg";
import { ReactComponent as CircledX } from "./circled-x.svg";

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

  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  React.useEffect(() => {
    /**
     * useCallback hook creates a memoized function every time its dependency array changes
     * as a result, useEffect hook runs again bc it depends on new function
     */
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  console.log("B:App");

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>
        My Hacker Stories
      </StyledHeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
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
    </StyledContainer>
  );
};

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

type Stories = Array<Story>;

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
};

interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
};

interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
};

interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
};

type StoriesAction = 
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};
const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span<{width: string }>`
padding: 0 5px;
white-span: nowrap;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;

a {
  color: inherit;
}

width: ${props => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;

const StyledButtonSmall = styled.button`
  padding: 5px;
`;

const StyledButtonLarge = styled.button`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;

  font-size: 20px;
`;

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

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  // console.log(state);
  // console.log(action.type);

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
  type="text",
  onInputChange,
  isFocused,
  children,
 }: InputWithLabelProps) => {
  // create ref with useRef hook; has persistent value stays intact over the lifetime of the component
  // ref comes with property current; in contrast to ref, current is changeable
  const inputRef = React.useRef<HTMLInputElement>(null!);

  // useEffect hook performing focuse on input field when component renders (or dependencies change)
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // current changes and executes focus programmatically as side-effect
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }: SearchFormProps) => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong> Search: </strong>
    </InputWithLabel>

    <StyledButtonLarge type="submit" disabled={!searchTerm}>
      Submit
    </StyledButtonLarge>
  </StyledSearchForm>
);

// const List = ({ list, onRemoveItem }) =>
//   /**
//    * spread operator: allows to spread all key/value pairs of an object to another object
//    *  - instead of passing each property one at a time via props from List to Item component,
//    *    we can use Javascripts spead operator to pass all the object's key/value pairs as
//    *    attribute/value pairs to a JSX element
//    *
//    *  rest parameters: allows a function to accept an infinite number of arguments as an array,
//    *                    providing a way to represent variadic functions in js
//    *   - happens always as the last part of an object destructing; on the right side of an assignment
//    *   - always used to seperate an object from some of its properties
//    */
//   console.log('B:List') ||
//   list.map((item) => (
//     <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
//   ));

const List = ({ list, onRemoveItem}: ListProps) => (
  <>
    {list.map(item => (
      <Item 
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </>
);

const Item = ({ item, onRemoveItem}: ItemProps) => (
    <StyledItem>
      <StyledColumn width="40%">
        <a href={item.url}> {item.title} </a>
      </StyledColumn>

      <StyledColumn width="30%">{item.author}</StyledColumn>
      <StyledColumn width="10%">{item.num_comments}</StyledColumn>
      <StyledColumn width="10%">{item.points}</StyledColumn>
      <StyledColumn width="10%">
        {/* inline handlers: allows to excute the function in JSX
            Bind Method: onClick={onRemoveItem.bind(null,item)}
            (do not use for complex functions) Wrapping Arrow Function: onClick={() => onRemoveItem(item)} 
        */}
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
          <Check height="18px" width="18px" />
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
);

const useSemiPersistentState = (
  key: string, 
  initialState: string) : [string, (newValue: string) => void ] => {
  /** useSemiPersistantState: custom hook
   *  - pass in a key in order to fix overwrite of the 'value' allocated in local storage
   *    when custom hook is used more than once
   *  - give custom hook initial state from outside
   *  - manages state yet synchronizes with the local storage
   *  - no fully consistent; clearing local storage browser deletes relevant data from application
   */

  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log("A");
      localStorage.setItem(key, value);
    }
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

export default App;
export {storiesReducer, SearchForm, InputWithLabel, List, Item};

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
