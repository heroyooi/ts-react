import React, { Dispatch, FC, useMemo, memo } from "react";
import Td from "./Td";

interface Props {
  rowData: string[];
  rowIndex: number;
  dispatch: Dispatch<any>;
}

const Tr: FC<Props> = memo(({ rowData, rowIndex, dispatch }) => {
  console.log("Tr render");
  console.log(rowData);
  return (
    <tr>
      {Array(rowData.length)
        .fill(null)
        .map((td, i) =>
          useMemo(
            () => (
              <Td
                key={i}
                dispatch={dispatch}
                rowIndex={rowIndex}
                cellIndex={i}
                cellData={rowData[i]}
              >
                {""}
              </Td>
            ),
            [rowData[i]]
          )
        )}
    </tr>
  );
});

export default Tr;
