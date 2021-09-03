<script>
  //import LazyImage from 'svelte-lazy-image';
  import {playerLinks} from "../../stores.js";
  export let href = ''
  export let title = undefined
  export let text = ''
  export let raw=''; raw;
</script>
  
  <img src={href} {title} alt={text} on:click={()=>{
    if(!$playerLinks.links.includes(href)){
      $playerLinks.links.push(href);
      $playerLinks.currentIndex = $playerLinks.links.length-1;
    }else{
      $playerLinks.currentIndex = $playerLinks.links.indexOf(href);
    }
    $playerLinks=$playerLinks;
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
    cursor: pointer;
    max-width: 100px;
  }
</style>