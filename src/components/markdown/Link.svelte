<script>
  import {playerLinks} from "../../stores.js";
  import Image from './Image.svelte';

  import {getUrlExtension, matchYoutubeUrl} from "../../utils/util"
  export let href = ''
  export let title = undefined

  export let raw = ''
  export let text = ''


  let ytid;
  let ext;

  $: if(href){
    
    ytid = matchYoutubeUrl(href);
    if(ytid==""){
      ext = getUrlExtension(href);
      if(ext!=""){
        ext = ext.toLowerCase();
      }

    }
  }

</script>
{#if ytid!=""}
  <a on:click={()=>{
    const ytHref="https://www.youtube.com/embed/"+ytid;
    if(!$playerLinks.links.includes(ytHref)){
      $playerLinks.links.push(ytHref);
      $playerLinks.currentIndex = $playerLinks.links.length-1;
    }else{
      $playerLinks.currentIndex = $playerLinks.links.indexOf(ytHref);
    }
    $playerLinks=$playerLinks;

  }} {title}>YT: {ytid}</a>
{:else}
  {#if (ext=='jpg'||ext=='png'||ext=='gif'||ext=='jpeg')}
    <Image href={href} />
  {:else}
    <a {href} {title} target="_blank"><slot></slot></a>
  {/if}

{/if}
