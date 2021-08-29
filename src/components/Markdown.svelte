<script>
  import SvelteMarkdown from 'svelte-markdown'
  import Link from "./markdown/Link.svelte";
  import Text from "./markdown/Text.svelte";
  import Image from "./markdown/Image.svelte";

  export let content="";

</script>
<SvelteMarkdown source={content} options={{
    gfm:true,
    breaks:true,
  }}
  isInline={true}
  renderers={{"link": Link, "text": Text, "image": Image}}
  />  
