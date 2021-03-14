import { writable } from "svelte/store"
import marked from "marked";


export const timeConverter = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
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
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
};

export const currentPath = writable(window.location.pathname)

export const getDateDiff = (dateTimeStamp) => {
	dateTimeStamp = dateTimeStamp*1000
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){return;}
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
	var minC =diffValue/minute;
	var result = "";
	if(monthC>=1){
		result="" + parseInt(monthC) + "個月前";
	}
	else if(weekC>=1){
		result="" + parseInt(weekC) + "周前";
	}
	else if(dayC>=1){
		result=""+ parseInt(dayC) +"天前";
	}
	else if(hourC>=1){
		result=""+ parseInt(hourC) +"小時前";
	}
	else if(minC>=1){
		result=""+ parseInt(minC) +"分鐘前";
	}else
	result="剛剛";
	return result;
}


const renderer = new marked.Renderer();
renderer.link = (href, title, text) =>
  `<a target="_blank" href="${href}">${text}</a>`;
const markedOptions = { renderer: renderer, breaks: true };

export const myMarked = (str) => {
  if (str == undefined || str == null) {
	return "";
  }
  return marked(str, markedOptions)
	.replaceAll("&#39;", "&apos;")
	.replace(/@([a-z\d_]+)/gi, '<a href="/user/$1">@$1</a>')
	.replaceAll("<p>", "")
	.replaceAll("</p>", "<br />")
	.replace(
	  /\B#([\u4e00-\u9fa5_a-zA-Z0-9]+)/g,
	  '<a href="/hashtag/$1">#$1</a>'
	);
};