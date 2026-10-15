import { useEffect, useState } from "react";
import heroImg from "./assets/hero.png";
import Hero from "./assets/image.jpg";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import Button from "./Button";

function App() {
  const toggleImage = () => {
    let boolean = false;
    if (!boolean) {
      const img = document.createElement("label");
      img.htmlFor = "imageToggle";
      img.innerText = "Show Image";
      document.body.appendChild(img);
      boolean = true;
    }
  };

  const onclick = () => {
    alert("Button clicked!");
  };

  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    console.log(data);
    setData(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center", backgroundColor: "lightblue" }}>
      <h1 style={{ color: "blue", backgroundColor: "lightgray" }}>
        Hello World
      </h1>
      <label htmlFor="imageToggle"></label>
      <button
        onClick={toggleImage}
        style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
      >
        Press to show image
      </button>
      <label htmlFor="imageToggle"></label>
      <button
        onClick={toggleImage}
        style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
      >
        Press to show image
      </button>
      <label>
        <img
          src={Hero}
          alt="Hero"
          style={{ width: "200px", height: "200px" }}
        />
      </label>

      <p id="btn"></p>
      <Button name={"Hellow"} onclick={onclick}></Button>

      <p>Counter: {count}</p>
      <Button name={"Increment"} onClick={() => setCount((count) => count + 1)}>
        Increment
      </Button>
      <Button name={"Decrement"} onClick={() => setCount((count) => count - 1)}>
        Decrement
      </Button>
      <Button name={"Reset"} onClick={() => setCount(0)}>
        Reset
      </Button>

      <form className="userForm">
        {data.map(user => (
          <div key={user.id} className="userCard">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            {/* <p>{user.address}</p> */}
            <p>Location: {user.address?.geo.lat}, {user.address?.geo.lng}</p>
          </div>
        ))} 
      </form>
      <hr />
    </div>
  );
}

export default App;
