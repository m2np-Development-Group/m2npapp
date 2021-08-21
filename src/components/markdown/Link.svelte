<script>
  import {playerSrc} from "../../stores.js";
  export let href = ''
  export let title = undefined
  function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
  }
  let ytid = matchYoutubeUrl(href);

</script>
{#if ytid}
<a on:click={()=>{
  $playerSrc=ytid
}} {title}>YT: {ytid}</a>
{:else}
<a {href} {title}><slot></slot></a>
{/if}
