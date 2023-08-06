<script lang="ts">
  //import LazyImage from 'svelte-lazy-image';
  import { playerLinks } from "../../stores";
  export let href = "";
  export let title = undefined;
  export let alt = "";
  export let text = "";
  export let raw = "";
  raw;
  export let width = "";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
  src={href}
  title={title}
  alt={alt ?? text}
  width={width}
  on:click={() => {
    if (!$playerLinks.links.includes(href)) {
      $playerLinks.links.push([href, "img"]);
      $playerLinks.currentIndex = $playerLinks.links.length - 1;
    } else {
      $playerLinks.currentIndex = $playerLinks.links.indexOf([href, "img"]);
    }
    $playerLinks = $playerLinks;
  }}
/>
<!-- <LazyImage
  src={href}
  placeholder={href}
  title={title}
  alt={text}
/> -->
{#if href == ""}
  <!-- should not happen -->
  <slot />
{/if}

<style>
  img {
    cursor: pointer;
    max-width: 100px;
    border-radius: 3px;
  }
</style>
