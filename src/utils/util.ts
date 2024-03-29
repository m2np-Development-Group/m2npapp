import { writable } from "svelte/store";
import { userStore } from "../stores";


//trim specific characters
export const trim = (str: string, char: string) => {
  let start = 0,
    end = str.length - 1;
  while (str[start] == char) start++;
  while (str[end] == char) end--;
  return str.substring(start, end + 1);
};

let displaynames;
const unsubscribe = userStore.subscribe((value) => {
  displaynames = value.displaynameOfUsername;
});
export const exists = (v:any) => {
  // check if v is empty object
  if (typeof v === "object" &&
  v !== null &&
  v !== undefined &&
  Object.keys(v).length === 0) {
    return false;
  }
  // check if v is empty array
  if (Array.isArray(v) && v.length === 0) {
    return false;
  }
  if (
    v === undefined ||
    v === null ||
    v === 0 ||
    v === "0" ||
    v === ""
  ) {
    return false;
  }
  return true;
};
export const getUrlExtension = (url: string) => {
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

export const timeConverter = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
};

export const currentPath = writable(window.location.pathname);
const parseIntToChinese = (num: string | number) => {
  let char = typeof num === "string" ? parseInt(num) : num;
  // round to integer
  char = Math.round(char);
  if (char == 1) {
    return "一";
  }
  if (char == 2) {
    return "兩";
  }
  if (char == 3) {
    return "三";
  }
  return char;
};

// omit is a function that returns a copy of an object without the specified keys.
export function omit(obj: { [x: string]: any; }, ...keysToOmit: string[]) {
  return Object.keys(obj).reduce((acc, key) => {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
    return acc;
  }, {});
}

export const getDateDiff = (dateTimeStamp: number) => {
  dateTimeStamp = dateTimeStamp * 1000;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  //const halfamonth = day * 15;
  const month = day * 30;
  const now = new Date().getTime();
  
  const diffValue = now - dateTimeStamp;
  const suffix = diffValue < 0 ? "後" : "前";
  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;
  let result = "";
  if (monthC >= 1) {
    result = "" + parseIntToChinese(monthC) + "個月" + suffix;
  } else if (weekC >= 1) {
    result = "" + parseIntToChinese(weekC) + "周" + suffix;
  } else if (dayC >= 1) {
    result = "" + parseIntToChinese(dayC) + "天" + suffix;
  } else if (hourC >= 1) {
    result = "" + parseIntToChinese(hourC) + "小時" + suffix;
  } else if (minC >= 1) {
    result = "" + parseIntToChinese(minC) + "分鐘" + suffix;
  } else {
    result = "剛剛";
  }
  return result;
};

export const matchYoutubeUrl = (url: string) => {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return "";
};

export const matchSoundCloudUrl = (url: string) => {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:soundcloud\.com\/|soundcloud\.com\/(?:tracks\/|playlists\/|users\/|groups\/|sounds\/|sets\/))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return "";
};

//generate soundcloud embed url
export const generateSoundCloudEmbedUrl = (url: string) => {
  return (
    "https://w.soundcloud.com/player/?url=" +
    url +
    "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"
  );
};

//generate soundcloud embed url
export const generateYoutubeEmbedUrl = (id: string) => {
  return "https://www.youtube.com/embed/" + id;
};

export const colorMap = [
  "1abc9c",
  "2c3e50",
  "2980b9",
  "7f8c8d",
  "f1c40f",
  "d35400",
  "27ae60",
];

export function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
