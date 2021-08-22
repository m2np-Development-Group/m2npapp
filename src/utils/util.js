import { writable } from "svelte/store"
import marked from "marked";
import {userStore} from "../stores.js"
import Link from "../components/markdown/Link.svelte";

let displaynames;
const unsubscribe = userStore.subscribe(value => {
	displaynames = value.displaynameOfUsername;
});
export const exists = (v) => {
	
	if (v === undefined || v === null || v === 0 || v === "0" || v === "" || v === "{}" || v === "[]") {
		return false;
	}
	return true
}

export const timeConverter = (UNIX_timestamp) => {
	const a = new Date(UNIX_timestamp * 1000);
	const months = [
		"Jan","Feb","Mar","Apr","May","Jun",
		"Jul","Aug","Sep","Oct","Nov","Dec",
	];
	const year = a.getFullYear();
	const month = months[a.getMonth()];
	const date = a.getDate();
	const hour = a.getHours();
	const min = a.getMinutes();
	const sec = a.getSeconds();
	const time = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
	return time;
};

export const currentPath = writable(window.location.pathname)
const parseIntToChinese = (num)=>{
	const k = parseInt(num)
	if(k=="1"){return "一";}
	if(k=="2"){return "兩";}
	if(k=="3"){return "三";}
	return k
}
export const getDateDiff = (dateTimeStamp) => {
	dateTimeStamp = dateTimeStamp * 1000
	const minute = 1000 * 60;
	const hour = minute * 60;
	const day = hour * 24;
	const halfamonth = day * 15;
	const month = day * 30;
	const now = new Date().getTime();
	const diffValue = now - dateTimeStamp;
	const suffix = (diffValue < 0)?"後":"前";
	const monthC = diffValue / month;
	const weekC = diffValue / (7 * day);
	const dayC = diffValue / day;
	const hourC = diffValue / hour;
	const minC = diffValue / minute;
	let result = "";
	if (monthC >= 1) {
		result = "" + parseIntToChinese(monthC) + "個月" + suffix;
	}
	else if (weekC >= 1) {
		result = "" + parseIntToChinese(weekC) + "周" + suffix;
	}
	else if (dayC >= 1) {
		result = "" + parseIntToChinese(dayC) + "天" + suffix;
	}
	else if (hourC >= 1) {
		result = "" + parseIntToChinese(hourC) + "小時" + suffix;
	}
	else if (minC >= 1) {
		result = "" + parseIntToChinese(minC) + "分鐘" + suffix;
	} else {
		result = "剛剛";
	}
	return result;
}


const renderer = new marked.Renderer();

function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

renderer.link = (href, title, text) => Link;
// renderer.blockquote = (text) => text;
const tokenizer = new marked.Tokenizer();
tokenizer.blockquote = ()=>{};
const markedOptions = { tokenizer:tokenizer, renderer: renderer, breaks: true };

export const myMarked = (str) => {
	// console.log(displaynames)
	if (str == undefined || str == null) {
		return "";
	}
	return marked(str, markedOptions)
		.replaceAll("&#39;", "&apos;")
		.replace(/@([a-z\d_]+)/gi, (match,capture)=>
		{
			return `<a href="/user/${capture}">`+displaynames[capture]+"</a>"
		}
		)//mention
		.replaceAll("<p>", "")
		.replaceAll("</p>", "<br />")
		.replace(
			/\B#([\u4e00-\u9fa5_a-zA-Z0-9]+)/g,
			'<a href="/hashtag/$1">#$1</a>'
		);
};

export const colorMap = {1:"red",2:"yellow",3:"blue",4:"green"}
