const api = {
  set(key, value, storage) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
      value = 'obj-' + value;
    }
    storage.setItem(key, value);
  },

  get(key, storage) {
    let v = storage.getItem(key);
    if (!v) {
      return;
    }
    if (v.indexOf('obj-') === 0) {
      v = v.slice(4);
      return JSON.parse(v);
    }
    return v;
  },

  remove(key, storage) {
    storage.removeItem(key);
  }
};

const store = {
  storage: window.localStorage,
  set(key, value) {
    return api.set(key, value, this.storage);
  },
  get(key) {
    return api.get(key, this.storage);
  },
  remove(key) {
    return api.remove(key, this.storage);
  },
  session: {
    storage: window.sessionStorage,
    set(key, value) {
      return api.set(key, value, this.storage);
    },
    get(key) {
      return api.get(key, this.storage);
    },
    remove(key) {
      return api.remove(key, this.storage);
    }
  }
};

export default store;
