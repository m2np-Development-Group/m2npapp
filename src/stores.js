import { writable } from "svelte/store";

// const store = writable(localStorage.getItem("store") || "");
// store.subscribe(val => localStorage.setItem("store", val));

export const myInfoStore = writable(null);
// myInfoStore.subscribe(val => localStorage.setItem("myInfoStore", val));
export const myUnreadIds = writable([]);
export const userStore = writable({
  avatar: {},
  username: {},
  displayname: {},
  displaynameOfUsername: {},
  color: {},
});

export const requestedProfile = writable({});
export const requestedArticle = writable({});

export const wallpaper = writable("");
export const playerLinks = writable({ links: [], currentIndex: 0 });
export const globalPopOver = writable({
  isShow: false,
  top: 0,
  left: 0,
  content: "html",
});
export const userIdEmojiMap = writable({});

let userStoreValue;

const unsubscribe = userStore.subscribe((value) => {
  userStoreValue = value;
});

export const filluserStore = (users) => {
  users?.forEach((v) => {
    userStoreValue.avatar[v.id] = v.avatar;
    userStoreValue.username[v.id] = v.username;
    userStoreValue.displayname[v.id] = v.display_name;
    userStoreValue.displaynameOfUsername[v.username] = v.display_name;
    userStoreValue.color[v.id] = v.color;
  });

  userStore.set(userStoreValue);
};

export const docClicked = writable(false);
