import React, {useState, useEffect} from "react";
import "./styles.css";

/**
 * Define States, a React component of CS142 Project 4, Problem 2. The model
 * data for this view (the state names) is available at
 * window.cs142models.statesModel().
 */
function StatesFilter(){
  const [input, setInput] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);

  const stateModel = window.cs142models.statesModel();

  useEffect(() => {
    const matches = stateModel.filter(state =>
      state.toLowerCase().includes(input.toLowerCase())
    ).sort();
    setFilteredStates(matches);
  }, [input])

  return (
    <div className="states-filter">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a substring to filter states"/>
      <div>Filter: {input}</div>
      {filteredStates.length > 0 ? (
        <ul>
          {filteredStates.map((state, index) => (
          <li key={index}>{state}</li>))}
        </ul>
      ): (<div>No matching states found.</div>)}
    </div>
  );
}

export default StatesFilter;
