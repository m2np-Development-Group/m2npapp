<script>
  import {playerSrc} from "../../stores.js";
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
        console.log(ext+"XX")
      }

    }
  }

</script>
{#if ytid!=""}
  <a on:click={()=>{
    $playerSrc="https://www.youtube.com/embed/"+ytid
  }} {title}>YT: {ytid}</a>
{:else}
  {#if (ext=='jpg'||ext=='png'||ext=='gif'||ext=='jpeg')}
    <Image href={href} />
  {:else}
    <a {href} {title} target="_blank"><slot></slot></a>
  {/if}

{/if}
