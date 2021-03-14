import { writable } from 'svelte/store';

export const userInfoStore = writable(null);

export const avatarStore = writable({});
export const usernameStore = writable({});
export const displaynameStore = writable({});
