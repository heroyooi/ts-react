# React.js + TypeScript

## 초기 세팅

```command
npm init
npm i typescript
npm i react react-dom
npm i webpack webpack-cli -D
```

- 타입스크립트는 자체적으로 최신 문법을 ES5, ES3(IE9)까지 지원해준다. 그래서 따로 바벨이 필요없다.
- 하지만, 타입스크립트와 바벨을 같이 쓰는 경우도 있다.
- 웹팩과 타입스크립트 연결해주는 로더 : ts-loader, awesome-typescript-loader

```command
npm i awesome-typescript-loader -D
```

### TS를 도입하는 유형

- 1. TS로 만들어진 NPM, 알아서 TS를 지원함. 예) redux (TS)
- 2. TS로 만들어지지는 않았지만, index.d.ts 파일을 제공해서 따로 타입 정의를 하지 않아도 된다. 예) axios (TS)
- 3. 워낙 유명한 라이브러리라서 커뮤니티가 타입들을 만들어 놓았다. 예) react, react-dom (DT)

```command
npm i @types/react @types/react-dom -D
```

- 웹팩과 타입스크립트를 연결해서 사용할 것이기 때문에 npx tsc -w가 아닌 아래 명령어로 실행한다.

```command
npx webpack
```

- 타입스크립트 설정 tsconfig.json

```js
{
  "compilerOptions": {
    "strict": true,
    "lib": [
      "ES5",
      "ES2015",
      "ES2016", // [].includes
      "ES2017", // async, await
      "ES2018",
      "ES2019",
      "ES2020",
      "DOM"
    ],
    "jsx": "react",
    "esModuleInterop": true // import React from 'react';
  }
}
```

- 웹팩 설정 webpack.config.js

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development", // 배포용: production
  devtool: "eval", // 배포용: hidden-source-map
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts"],
  },

  entry: {
    app: "./client", // client.tsx 파일을 통해서 app.js 을 만들어 낸다.
  },
  module: {
    // 바벨 대신 TS 설정
    rules: [
      {
        test: /\.tsx?$/, // ts, tsx 파일들
        loader: "awesome-typescript-loader",
      },
    ],
  },
  plugins: [],
  output: {
    filename: "[name].js", // [name].js => app.js
    path: path.join(__dirname, "dist"),
  },
};
```

## 1-3 이벤트 핸들러 useRef 타이핑

- 이벤트 핸들러를 같이 쓰면 알아서 매개변수 e가 타입 추론이 된다.
- 함수를 분리해서 이벤트 핸들러로 연결하는 경우는 매개변수 e가 타입 추론이 안된다. 그래서 아래와 같이 선언해줘야한다.

```tsx
const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {};
```

- FormEvent는 대부분 폼 태그에서 이루어지 때문에 뒤 제네릭 부분을 생략해도 무방하다.

<hr />

- useRef를 사용할 때 따로 제네릭을 선언하지 않으면 null일 가능성을 가지고 있기 때문에 제네릭을 선언함으로 타입 추론을 시켜준다.

```tsx
const GuGuDan = () => {
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = (e: React.FormEvent) => {
    if (input) {
      input.focus();
    }
  };
};
```

- ※ 타입 추론이 제대로 안되는 경우 제네릭을 사용하여 타입 추론을 시켜준다.

## 추가 세팅

```command
npm rm awesome-typescript-loader
npm i webpack-dev-server @types/webpack @types/webpack-dev-server -D
npm i react-refresh @pmmmwh/react-refresh-webpack-plugin fork-ts-checker-webpack-plugin -D
npm i @babel/core babel-loader ts-loader ts-node -D
```

- webpack.config.ts 새로 작성

```ts
import path from "path";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const config = {
  name: "typescript-react-dev",
  mode: "development", // production
  devtool: "eval", // hidden-source-map
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts"],
  },
  entry: {
    app: "./client",
  },
  module: {
    // 바벨 대신 TS 설정
    rules: [
      {
        loader: "babel-loader",
        options: { plugins: ["react-refresh/babel"] },
      },
      {
        test: /\.tsx?$/, // ts, tsx 파일들
        loader: "ts-loader",
        exclude: path.join(__dirname, "node_modules"),
      },
    ],
  },
  plugins: [new ReactRefreshPlugin(), new ForkTsCheckerWebpackPlugin()],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist/",
  },
  devServer: {
    publicPath: "/dist/",
    hot: true,
  },
};

export default config;
```

## 1-5. useCallback 타이핑

```tsx
const WordRelay = () => {
  const onChange = useCallback<
    (e: React.ChangeEvent<HTMLInputElement>) => void
  >((e) => {
    setValue(e.currentTarget.value);
  }, []);
};
```

- useCallback에도 제네릭 자리가 마련되어 있어서 타입추론이 가능해진다.
- 가독성이 문제라고 판단되면 아래와 같이 작성도 가능하다.

```tsx
const WordRelay = () => {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  }, []);
};
```

## 2-1. 숫자야구 타이핑

- useState에서 빈 배열은 항상 타이핑 문제를 일으킨다. 그래서 제네릭에 타입을 지정해준다.

```tsx
interface TryInfo {
  try: string;
  result: string;
}

const NumberBaseball = () => {
  const [tries, setTries] = useState<TryInfo[]>([]);
};
```

## 2.2 Props 타이핑

```tsx
import React, { FC } from "react";

interface TryProps {
  tryInfo: {
    try: string;
    result: string;
  };
}

const Try: FC<TryProps> = ({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
};
```

## 2.3 setTimeout useRef 타이핑

```tsx
const ResponseCheck = () => {
  const timeout = useRef<number>(null);

  const onClickScreen = () => {
    timeout.current = setTimeout(() => {});
  };
};
```

- 오버로딩으로 인하여 타입추론이 되는 형태가 정해지는데, 타입 정의를 보고 짝을 맞춰서 맞는 오버로딩이 선택되게끔 해야한다.
- 위 useRef의 제네릭이 number인 상황에서는 리턴 타입이 RefObject가 된다. 그래서 아래와 같이 수정해서 오버로딩을 바꿔준다.

```tsx
const ResponseCheck = () => {
  const timeout = useRef<number | null>(null);
  const onClickScreen = () => {
    timeout.current = window.setTimeout(() => {});
  };
};
```

- 위와 같이 작성하므로 useRef의 리턴 타입을 MutableRefObject로 바꿔준다.
- 그리고 setTimeout은 return 타입을 NodeJS.Timeout으로 인지하므로 위와 같이 window.setTimeout으로 바꿔서 number가 리턴될 수 있도록 바꿔준다.

## 3.1 useCallback과 keyof typeof

```tsx
const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
} as const;

type ImgCoords = typeof rspCoords[keyof typeof rspCoords];

const computerChoice = (imgCoords: ImgCoords) => {
  return (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => {
    return rspCoords[k] === imgCoords;
  })!;
};

const RSP = () => {
  const onClickBtn = (choice: keyof typeof rspCoords) => () => {};
};
```

- 상수 값을 고정해서 사용할 때, as const 를 붙여준다.
- keyof typeof rspCoords 는 "바위" | "가위" | "보" 가 되고,
  typeof rspCoords[keyof typeof rspCoords] 는 "0" | "-142px" | "-284px" 가 된다.
- 남이 만든 타입인 Object.keys는 string[]를 리턴하기 때문에, 위와 같이 강제로 형변환을 해준다.
- onClickBtn의 매개변수 choice는 "바위" | "가위" | "보"이므로 keyof typeof rspCoords 가 된다.

## 3.3 로또 추첨기와 FC useMemo

```tsx
import React, { VFC } from "react";

interface Props {
  number: number;
  onClick?: () => void;
}

const Ball: VFC<Props> = ({ number, onClick }) => {};
```

- props를 전달 받는 함수형 컴포넌트는 FC로 타입을 선언하는데, children이 없는 경우 VFC를 사용한다.
- 물론 FC로 해도 문제는 없다.
- props를 정의할 때 있어도 되고, 없어도 되는 경우 ?를 붙여준다.

## 4.1 useReducer 타이핑

- initialState 타이핑을 한다.

```tsx
interface ReducerState {
  winner: "O" | "X" | "";
  turn: "O" | "X";
  tableData: string[][];
  recentCell: [number, number];
}

const initialState: ReducerState = {
  winner: "",
  turn: "O",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  recentCell: [-1, -1],
};
```

<hr />

- 액션 및 액션 생성자를 타이핑한다.

```tsx
export const SET_WINNER = "SET_WINNER" as const;

interface SetWinnerAction {
  type: typeof SET_WINNER;
  winner: "O" | "X";
}

const setWinner = (winner: "O" | "X"): SetWinnerAction => {
  return { type: SET_WINNER, winner };
};
```

<hr />

- 리듀서 타이핑을 한다.

```tsx
type ReducerActions = SetWinnerAction | ClickCellAction;
const reducer = (
  state: ReducerState,
  action: ReducerActions
): ReducerState => {};
```

## 4.2 Dispatch children

- dispatch와 데이터, 이벤트를 상속받는 테이블 컴포넌트를 다음과 같이 작성한다.

```tsx
interface Props {
  tableData: string[][]; // 2차원 배열
  dispatch: Dispatch<any>;
  onClick: () => void;
}

const Table: FC<Props> = ({ tableData, dispatch }) => {};
```

- Dispatch 제네릭 자리에 any 대신 액션들을 넣어도 된다.

## 5-2. Context API 타이핑

- Context를 만들 때 createContext에서 제네릭을 이용하여 타입을 정의해준다.

```tsx
interface Context {
  tableData: number[][];
  halted: boolean;
  dispatch: Dispatch<ReducerActions>;
}

export const TableContext = createContext<Context>({
  tableData: [],
  halted: true,
  dispatch: () => {},
});
```

## 6-1. 리액트 라우터 타이핑

```command
npm i react-router react-router-dom
npm i -D @types/react-router @types/react-router-dom
```

- 기존 react-router에서 정의해놓은 props를 확장해서 정의할 경우

```tsx
import { RouteChildrenProps } from "react-router";

interface Props extends RouteChildrenProps {
  hello: "heroyooi";
}

class GameMatcher extends Component<Props> {}
```

- RouteChildrenProps에 history, location, match가 정의되어있다.

## 6-2. match와 location, history

- match.params 를 사용할 때는 RouteChildrenProps에 제네릭이 마련되어 있어서 params의 값들에 대한 타입을 추론하도록 할 수 있다.

- Games.tsx

```tsx
const Games = () => {
  return (
    <BrowserRouter>
      <Route
        path="/game/:name"
        render={(props) => <GameMatcher {...props} />} // 방법 1
        component={GameMatcher} // 방법 2
      />
    </BrowserRouter>
  );
};
```

- GameMatcherClass.tsx

```tsx
class GameMatcher extends Component<RouteChildrenProps<{ name: string }>> {
  render() {
    console.log(this.props.match.params.name);
  }
}
```

## 6-3. withRouter

- withRouter를 감싸주면 RouteComponentProps가 강제된다.

```tsx
import { RouteComponentProps, withRouter } from "react-router-dom";

class GameMatcher extends Component<RouteComponentProps<{ name: string }>> {}

export default withRouter(GameMatcher);
```

## 6-4. react router hooks

- Games.tsx

```tsx
const Games = () => {
  return (
    <BrowserRouter>
      <Route path="/game/:name" render={() => <GameMatcher />} />
    </BrowserRouter>
  );
};
```

- 훅스로 할 경우 props를 전달하지 않아도 된다.

- GameMatcher.tsx

```tsx
import { useRouteMatch, useLocation, useHistory } from "react-router";

const GameMatcher = () => {
  const match = useRouteMatch<{ name: string }>();
  const location = useLocation();
  const history = useHistory();

  console.log(match.params.name);
};
```

- 위의 예제와 동일하게 useRouteMatch에 제네릭을 넣어주면 match.params.name을 인식한다.

## 7-1. 리덕스 구조 잡기

```command
npm i redux react-redux redux-devtools-extension
npm i immer
```

## 7-2. action reducer 타이핑

- reducers/index.ts

```ts
const reducer = combineReducers<{
  user: UserState;
  posts: string[];
}>({
  user: userReducer,
  posts: postReducer,
});

export type RootState = ReturnType<typeof reducer>; // 함수의 리턴 타입을 가져오는 방법
```

- 리듀서 타입추론이 안되면 제네릭으로 타입추론을 해줘야한다. 잘되면 안해도 된다.

- actions/user.ts

```ts
export const LOG_IN_REQUEST = "LOG_IN_REQUEST" as const;

export interface LogInRequestAction {
  type: typeof LOG_IN_REQUEST;
  data: { id: string; password: string };
}

export const logIn = (data: { id: string; password: string }) => {};
```

- reducers/user.ts

```ts
import { LOG_IN_REQUEST, LogInRequestAction } from "./../actions/user";

export interface UserState {
  isLoggingIn: boolean;
  data: {
    nickname: string;
  } | null;
}

const initialState: UserState = {
  isLoggingIn: false,
  data: null,
};

type UserReducerActions = LogInRequestAction | LogInSuccessAction;

const userReducer = (prevState = initialState, action: UserReducerActions) => {
  switch (action.type) {
    case LOG_OUT:
      return {
        ...prevState,
        data: null,
      };
    default:
      return prevState;
  }
};

export default userReducer;
```

## 7-6

## 참고

- [TS 공식문서 | Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TS 공식문서 | What's New](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)
