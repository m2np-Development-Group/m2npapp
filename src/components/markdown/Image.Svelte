<script>
  //import LazyImage from 'svelte-lazy-image';
  import {playerSrc} from "../../stores.js";
  export let href = ''
  export let title = undefined
  export let text = ''
  export let raw=''; raw;
</script>
  
  <img src={href} {title} alt={text} on:click={()=>{
    $playerSrc=href
  }} />
  <!-- <LazyImage
  src={href}
  placeholder={href}
  title={title}
  alt={text}
/> -->
  {#if href==""}
  <!-- should not happen -->
  <slot />
  {/if}
<style>
  img{
    max-width: 100px;
  }
</style>