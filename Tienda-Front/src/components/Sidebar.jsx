import { useState } from "react";
import SidebarMostrar from "./SidebarMostrar";

export default function Sidebar() {
  const [show, setShow] = useState(true);

  return (
    < >
      <div className="md:ml-12  text-white">
        <button
          type="button"
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? "Ojear por la página" : "Cerrar menu"}
        </button>

        {show ? (
          <div></div>
        ) : (
          <div  style={{ color: "blue" }}>
            <SidebarMostrar className="relative" />
          </div>
        )}
      </div>


    </>
  );
}
