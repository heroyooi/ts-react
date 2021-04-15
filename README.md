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

- TS로 만들어진 NPM, 알아서 TS를 지원함. 예) redux
- TS로 만들어지지는 않았지만, index.d.ts 파일을 제공해서 따로 타입 정의를 하지 않아도 된다. 예) axios
- 워낙 유명한 라이브러리라서 커뮤니티가 타입들을 만들어 놓았다. 예) react, react-dom

```command
npm i @types/react @types/react-dom -D
```

- 웹팩과 타입스크립트를 연결해서 사용할 것이기 때문에 npx tsc -w가 아닌 아래 명령어로 실행한다.

```command
npx webpack
```

- 타입스크립트 설정 tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": [
      "ES5",
      "ES2015",
      "ES2016",
      "ES2017",
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

<hr />

## 참고

- [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)
