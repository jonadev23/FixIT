import React from "react";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <nav>
      <div className="header flex px-[4%] py-[2%] justify-between">
        <section>
          <img className="w-16" src={logo} alt="" srcset="" />
        </section>
        <section>
          <ul className="flex gap-4">
            <li>About</li>
            <li>Contact</li>
          </ul>
        </section>
        <section>
          <button className="btn btn-accent text-white">Login</button>
        </section>
      </div>
    </nav>
  );
};

export default Header;
