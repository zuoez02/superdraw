import { useState } from "react";
import "./index.css";
export default function Sidebar(props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div id="mySidebar" className={`sidebar ${open ? "open" : ""}`}>
        <button className="closebtn" onClick={() => setOpen(false)}>
          x
        </button>
        <a href="#">Dummy Home</a>
        <a href="#">Dummy About</a>{" "}
      </div>
      <div className={`${open ? "sidebar-open" : ""}`}>
        <button
          className="openbtn"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Open Sidebar
        </button>
        {props.children}
      </div>
    </>
  );
}
