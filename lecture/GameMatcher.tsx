import React, { Component } from "react";
import NumberBaseball from "../3.숫자야구/NumberBaseball";
import RSP from "../5.가위바위보/RSP";
import Lotto from "../6.로또/Lotto";

class GameMatcher extends Component<Props> {
  render() {
    // let urlSearchParams = new URLSearchParams(
    //   this.props.location.search.slice(1)
    // );
    // console.log(urlSearchParams.get("page"));
    if (this.props.match.params.name === "number-baseball") {
      return <NumberBaseball />;
    } else if (this.props.match.params.name === "rock-scissors-paper") {
      return <RSP />;
    } else if (this.props.match.params.name === "lotto-generator") {
      return <Lotto />;
    } else {
      return <div>일치하는 게임이 없습니다.</div>;
    }
  }
}

export default GameMatcher;
