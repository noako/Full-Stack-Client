import * as React from "react";
import { listPostsFromServer } from "../helpers/Posts";
import { useEffect, useState } from "react";

const Selection = ({ stateChanger }) => {
  const [selectionValue, setSelectionValue] = useState("all");

  const updateList = async () => {
    const data = await listPostsFromServer(selectionValue);
    stateChanger(data);
    return data;
  };

  const handleChange = async (event) => {
    setSelectionValue(event.target.value);
  };

  useEffect(() => {
    updateList();
  }, [selectionValue]);

  return (
    <div>
      <label>
        What do you want to see?
        <select value={selectionValue} onChange={handleChange}>
          <option value="all">All Posts</option>

          <option value="friends">My friend's posts</option>

          <option value="mine">My Posts</option>
        </select>
      </label>

      <p>You are seeing {selectionValue}!</p>
    </div>
  );
};

export default Selection;
