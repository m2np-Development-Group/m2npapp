<script>
  //import LazyImage from 'svelte-lazy-image';
  import {playerSrc} from "../../stores.js";
  export let href = ''
  export let title = undefined
  export let text = ''
  export let raw=''; raw;
</script>
  
  <img src={href} {title} alt={text} width="100" on:click={()=>{
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
  