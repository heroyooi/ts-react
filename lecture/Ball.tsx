import React, { VFC } from "react";

interface Props {
  number: number;
  onClick?: () => void;
}

const Ball: VFC<Props> = ({ number, onClick }) => {
  let background;
  if (number <= 10) {
    background = "red";
  } else if (number <= 20) {
    background = "orange";
  } else if (number <= 30) {
    background = "yellow";
  } else if (number <= 40) {
    background = "blue";
  } else {
    background = "green";
  }
  return (
    <div className="ball" style={{ background }} onClick={onClick}>
      {number}
    </div>
  );
};

export default Ball;
