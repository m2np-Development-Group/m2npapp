import { writable } from 'svelte/store';

// const store = writable(localStorage.getItem("store") || "");
// store.subscribe(val => localStorage.setItem("store", val));

export const myInfoStore = writable(null);
// myInfoStore.subscribe(val => localStorage.setItem("myInfoStore", val));

export const userStore = writable({avatar:{},username:{},displayname:{},color:{}});
export const docClicked = writable(false);