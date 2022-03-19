import { writable } from "svelte/store";
import { userStore } from "../stores.js";
import { listen } from "svelte/internal";

//import Link from "../components/markdown/Link.svelte";

//trim specific characters
export const trim = (str, char) => {
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
export const exists = (v) => {
  if (
    v === undefined ||
    v === null ||
    v === 0 ||
    v === "0" ||
    v === "" ||
    v === {} ||
    v === []
  ) {
    return false;
  }
  return true;
};
export const getUrlExtension = (url) => {
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
const parseIntToChinese = (num) => {
  const k = parseInt(num);
  if (k == "1") {
    return "一";
  }
  if (k == "2") {
    return "兩";
  }
  if (k == "3") {
    return "三";
  }
  return k;
};

export function omit(obj, ...keysToOmit) {
  return Object.keys(obj).reduce((acc, key) => {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key]
    return acc
  }, {})
}


export const getDateDiff = (dateTimeStamp) => {
  dateTimeStamp = dateTimeStamp * 1000;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const halfamonth = day * 15;
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

export const matchYoutubeUrl = (url) => {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return "";
};

export const matchSoundCloudUrl = (url) => {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:soundcloud\.com\/|soundcloud\.com\/(?:tracks\/|playlists\/|users\/|groups\/|sounds\/|sets\/))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return "";
};

//generate soundcloud embed url
export const generateSoundCloudEmbedUrl = (url) => {
  return (
    "https://w.soundcloud.com/player/?url=" +
    url +
    "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"
  );
};

//generate soundcloud embed url
export const generateYoutubeEmbedUrl = (id) => {
  return "https://www.youtube.com/embed/" + id;
};

export function getEventsAction(component) {
  return node => {
    const events = Object.keys(component.$$.callbacks);
    const listeners = [];
    events.forEach(event =>
      listeners.push(listen(node, event, e => bubble(component, e)))
    );
    return {
      destroy: () => {
        listeners.forEach(listener => listener());
      }
    };
  };
}

export const colorMap = [
  "1abc9c",
  "2c3e50",
  "2980b9",
  "7f8c8d",
  "f1c40f",
  "d35400",
  "27ae60",
];
