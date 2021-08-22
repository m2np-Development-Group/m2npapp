<script>
  import {playerSrc} from "../../stores.js";
  export let href = ''
  export let title = undefined

  export let raw = ''
  export let text = ''

  function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return "";
  }
  let ytid = matchYoutubeUrl(href);

</script>
{#if ytid!=""}
<a on:click={()=>{
  $playerSrc="https://www.youtube.com/embed/"+ytid
}} {title}>YT: {ytid}</a>
{:else}
<a {href} {title} target="_blank"><slot></slot></a>
{/if}
