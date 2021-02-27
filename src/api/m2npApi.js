import Api from "./Api";

export const get = async (url) => {
  try {
    const response = await Api.get(url);
    return response;
  } catch (error) {
    console.error(error);
  }
};
