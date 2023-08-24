import React, { useState, useEffect } from "react";
import "./App.css";
import { TbAlertCircleFilled } from "react-icons/tb";

const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

const STATUS_OPTIONS = ["Todo", "Backlog", "In Progress", "Done", "Cancelled"];
const PRIORITY_LABELS = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "No priority",
};
const USERNAMES_MAP = {
  "usr-1": "Anoop sharma",
  "usr-2": "Yogesh",
  "usr-3": "Shankar Kumar",
  "usr-4": "Ramesh",
  "usr-5": "Suresh",
};

function App() {
  const [groupingOption, setGroupingOption] = useState("By Status");
  const [sortingOption, setSortingOption] = useState("Priority");
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getGroupCardCount = (group) => {
    return sortedTickets[group].length;
  };
  const groupedTickets = {};

  if (groupingOption === "By Status") {
    STATUS_OPTIONS.forEach((status) => {
      groupedTickets[status] = tickets.filter(
        (ticket) => ticket.status === status
      );
    });
  } else if (groupingOption === "By Priority") {
    Object.keys(PRIORITY_LABELS).forEach((priority) => {
      groupedTickets[PRIORITY_LABELS[priority]] = tickets.filter(
        (ticket) => ticket.priority === parseInt(priority)
      );
    });
  } else if (groupingOption === "By User") {
    Object.keys(USERNAMES_MAP).forEach((user) => {
      groupedTickets[USERNAMES_MAP[user]] = tickets.filter(
        (ticket) => ticket.userId === user
      );
    });
  }

  const sortedTickets = Object.keys(groupedTickets).reduce((sorted, group) => {
    sorted[group] = groupedTickets[group].sort((a, b) => {
      if (sortingOption === "Priority") {
        return b.priority - a.priority;
      } else if (sortingOption === "Title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    return sorted;
  }, {});

  const handleGroupingChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="dropdown-div">
          <div className="dropdown">
            <label>Grouping</label>
            <select onChange={handleGroupingChange} value={groupingOption}>
              <option>Status</option>
              <option>User</option>
              <option>Priority</option>
            </select>
          </div>
          <div className="dropdown">
            <label>Sorting</label>
            <select onChange={handleSortingChange} value={sortingOption}>
              <option>Priority</option>
              <option>Title</option>
            </select>
          </div>
        </div>
      </header>
      <main className="App-main">
        <div className="SectionContainer">
          {Object.keys(sortedTickets).map((group) => (
            <section key={group} className="Section">
              <p>
                {group} {getGroupCardCount(group)}
              </p>
              <div className="CardContainer">
                {sortedTickets[group].map((ticket) => (
                  <div key={ticket.id} className="Card">
                    <p>{ticket.id}</p>
                    <h4>{ticket.title}</h4>
                    <div className="content">
                      <TbAlertCircleFilled />
                      <p>{ticket.tag}</p>
                    </div>
                    <p></p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
