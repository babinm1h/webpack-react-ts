import React from "react";
import m0 from "../../../public/m0.png";
import "./testik.scss";
import s from "./test.module.scss";

const Test = () => {
  const unused = 1;

  return (
    <div>
      <img src={m0} alt="" className="img" />
      <h1 className={s.title}>M0nesy</h1>
    </div>
  );
};

export default Test;
