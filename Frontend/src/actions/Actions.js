import httpClient from "./helpers/httpClient";

class Actions {
  get(path, options) {
    return httpClient.get(path, options);
  }

  post(path, body, options) {
    return httpClient.post(path, body, options);
  }

  put(path, body, options) {
    return httpClient.put(path, body, options);
  }

  patch(path, body, options) {
    return httpClient.patch(path, body, options);
  }

  delete(path, body, options) {
    return httpClient.delete(path, body, options);
  }
}

export default new Actions();
