<script>
  import { fade } from "svelte/transition";
  import {Button} from "@abbychau/svelma"
  function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
  export let carouselUrls = [
    "https://picsum.photos/300/200?random=1",
    "https://picsum.photos/300/200?random=2",
    "https://picsum.photos/300/200?random=3",
    "https://www.youtube.com/watch?v=i69Tp6T1V4U",
  ];

  let index = 0;

  const next = () => {
    index++;
  };
  const prev = () => {
    index--;
  };
</script>

<div style="width:calc(100vw - 100px); height:calc(100vh - 100px);">
  {#each [carouselUrls[index]] as src (index)}
    {#if !youtube_parser(src)}
      <iframe
      title="external content"
      src={src} />
    {:else}
      <iframe
        title="youtube video"
        src={"https://www.youtube.com/embed/" + youtube_parser(src)} />
    {/if}
  {/each}

  {#if index < carouselUrls.length - 1}
    <Button iconPack="fa" iconLeft="arrow-right" style="position: absolute;right:10px" on:click={next}>Next</Button>
  {/if}
  {#if index > 0}
    <Button iconPack="fa" iconLeft="arrow-left" style="position: absolute;left:10px" on:click={prev}>Prev</Button>
  {/if}
</div>

<style>
  iframe{position: absolute; height: calc(100% - 30px); width: calc(100% - 30px);}
  
</style>
