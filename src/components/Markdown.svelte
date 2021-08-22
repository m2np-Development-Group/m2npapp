<script>
  import SvelteMarkdown from 'svelte-markdown'
  import Link from "./markdown/Link.svelte";

  export let content="";
</script>
<SvelteMarkdown source={content} options={{
    gfm:true,
    breaks:true,
  }}
  isInline={true}
  renderers={{"link": Link}}
  />  
