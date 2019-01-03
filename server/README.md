
## JTM server

### This app include the following features:

- Node.js
- Koa
- Websocket
- Sequelize
- Jest

## Commands

### DB init /

```zsh
# create new mondel
$ node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
# create tables
$ npm run migrate
```

### Unit test 
```zsh
# test all
$ npm run test
# unit test 
$ npm run test:watch
```

### Run

```zsh
# run dev mode:
$ npm run dev
# run prod mode:
$ npm run start
```