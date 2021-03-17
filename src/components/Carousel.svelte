<script>
	import {fade} from 'svelte/transition'
	
	const carouselPhotos = [
		'https://picsum.photos/300/200?random=1',
		'https://picsum.photos/300/200?random=2',
		'https://picsum.photos/300/200?random=3'
	]
	
	let index = 0
	
	const next = () => {
		index++
	}
	const prev = () => {
		index--
	}
</script>

<style>
	img, button {
		position: absolute;
	}
</style>

{#each [carouselPhotos[index]] as src (index)}
	<img transition:fade {src} alt="" />	
{/each}

{#if index < carouselPhotos.length - 1 }
<button style='right:0' on:click={next}>Next!</button>
{/if}
{#if index > 0}
<button style='left:0' on:click={prev}>Prev!</button>
{/if}