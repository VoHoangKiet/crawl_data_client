import axios from "axios";
class Api {
  instance;
  constructor() {
    this.instance = axios.create({
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
const api = new Api().instance;
export default api;
