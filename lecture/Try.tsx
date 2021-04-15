import React, { FC, memo } from "react";

interface TryInfo {
  try: string;
  result: string;
}

interface TryProps {
  tryInfo: TryInfo;
}

const Try: FC<TryProps> = ({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
};

export default memo(Try);
