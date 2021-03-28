import { writable } from 'svelte/store';

export const myInfoStore = writable(null);

export const userStore = writable({avatar:{},username:{},displayname:{},color:{}});

export const docClicked = writable(false);