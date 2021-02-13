import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		hello: 'world'
	}
});

export default app;