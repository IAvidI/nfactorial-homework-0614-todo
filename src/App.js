import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",
  },
];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(() => {
    // toDoItems

    const savedItems = localStorage.getItem("items");
    // if there are todos stored
    if (savedItems) {
      // return the parsed JSON object back to a javascript object
      return JSON.parse(savedItems);
      // otherwise
    } else {
      // return an empty array
      return toDoItems;
    }
  });

  const [filterType, setFilterType] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const [itemToSearch, setItemToSearch] = useState("");

  const handleSearchItem = (event) => {
    // console.log(event.target.value);
    setItemToSearch(event.target.value);
  };

  const handleDeleteItem = ({ key }) => {
    // console.log(key);

    const newItems = items.filter((item) => item.key !== key);

    setItems(newItems);
  };

  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);

    setItemToAdd("");
  };

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  useEffect(() => {
    // localstorage only support storing strings as keys and values
    // - therefore we cannot store arrays and objects without converting the object
    // into a string first. JSON.stringify will convert the object into a JSON string
    // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    localStorage.setItem("items", JSON.stringify(items));
    // add the todos as a dependancy because we want to update the
    // localstorage anytime the todos state changes
  }, [items]);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleSearchItem}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems
            .filter((item) => {
              if (itemToSearch === "") {
                return item;
              } else if (
                item.label.toLowerCase().includes(itemToSearch.toLowerCase())
              ) {
                return item;
              }
            })
            .map((item) => (
              <li key={item.key} className="list-group-item">
                <span className={`todo-list-item${item.done ? " done" : ""}`}>
                  <span
                    className="todo-list-item-label"
                    onClick={() => handleItemDone(item)}
                  >
                    {item.label}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm float-right"
                  >
                    <i className="fa fa-exclamation" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm float-right"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <i className="fa fa-trash-o" />
                  </button>
                </span>
              </li>
            ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
