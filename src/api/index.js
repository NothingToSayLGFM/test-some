import axios from "axios";

const URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio";
const HTTP = axios.create({
  headers: {
    Authorization: "Token " + process.env.VUE_APP_API_TOKEN,
  },
});

export const api = {
  async getUser(str) {
    try {
      const res = await HTTP.post(URL, { query: str });
      return res.data.suggestions;
    } catch (err) {
      throw new Error(err);
    }
  },
};
