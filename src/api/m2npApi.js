import Api from "./Api";

export const getAvatarUsernameMaps = async () => {
  try {
    const response = await Api.get("/get_avatar_username_maps");
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getMyTimeline = async () => {
  try {
    const response = await Api.get("/get_timeline");
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getPostDetails = async (id) => {
  try {
    const response = await Api.get(`/get_post/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const g = async (url) => {
  try {
    const response = await Api.get(url);
    return response;
  } catch (error) {
    console.error(error);
  }
};
