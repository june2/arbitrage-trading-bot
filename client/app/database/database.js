import Datastore from 'nedb';
import electron from 'electron';
const app = electron.remote.app;
const userData = app.getPath('userData');

console.log(`${userData}/db/`);
// let instance = null;

class Database {
  constructor(name) {
    // if (!instance) {
    //   instance = this;
    // }
    this.db = new Datastore({ filename: `${userData}/db/${name}.db`, autoload: true });
    // return instance;
  }

  find(q) {
    return new Promise((res, rej) => {
      this.db.find(q || {}, (err, docs) => {
        if (err) rej(err);
        res(docs);
      });
    });
  }

  insert(obj) {
    return new Promise((res, rej) => {
      this.db.insert(obj, (err) => {
        if (err) rej(err);
        res();
      });
    });
  }

  update(q, u) {
    return new Promise((res, rej) => {
      this.db.update(q, u, { upsert: false }, (err, docs) => {
        if (err) rej(err);
        res(docs);
      });
    });
  }

  remove(q) {
    return new Promise((res, rej) => {
      this.db.remove(q, (err) => {
        if (err) rej(err);
        res();
      });
    });
  }
}

export default Database;