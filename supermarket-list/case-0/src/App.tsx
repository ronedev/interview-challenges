import type { Item } from "./types";

import React, { useEffect, useRef, useState } from "react";

import "./App.scss";
import api from "./api";

function App() {
  const [items, setItems] = useState<Array<Item>>([]);
  const [inputChanges, setInputChanges] = useState<string>('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInputChanges(value)
  }

  const addToBuy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      id: items ? items.length + 1 : 0,
      text: inputChanges,
      completed: false
    }
    setItems(items => ([...items, data]))
    setInputChanges('')
  }

  const deleteItem = (id: number) => {
    setItems((items) => items.filter(item => item.id !== id))
  }

  const doneItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item))
  }

  useEffect(() => {
    api.list().then(setItems);
    inputRef.current?.focus()
  }, []);

  return (
    <main>
      <h1>Supermarket list</h1>
      <form onSubmit={(e) => addToBuy(e)}>
        <input name="text" type="text" onChange={(e) => handleInputChange(e)} value={inputChanges} ref={inputRef} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.length ? items.map((item) => (
          <>
            <li className={item.completed ? 'completed' : ''} onClick={() => doneItem(item.id)}>
              {item.text}
            </li>
            <button
              onClick={() => deleteItem(item.id)}
            >[X]</button>
          </>
        )) : null}
      </ul>
    </main>
  );
}

export default App;
