<script>
  import SvelteMarkdown from "svelte-markdown";
  import Link from "./markdown/Link.svelte";
  import Text from "./markdown/Text.svelte";
  import Image from "./markdown/Image.svelte";
  import Html from "./markdown/Html.svelte";
  import CodeSpan from "./markdown/CodeSpan.svelte";
  import Paragraph from "./markdown/Paragraph.svelte";
  import Code from "./markdown/Code.svelte";
  import Br from "./markdown/Br.svelte";

  export let content = "";
</script>

{#if content}
  <SvelteMarkdown
    source={content}
    options={{
      gfm: true,
      breaks: true,
    }}
    isInline={false}
    renderers={{
      link: Link,
      text: Text,
      image: Image,
      html: Html,
      codespan: CodeSpan,
      paragraph: Paragraph,
      code: Code,
      br: Br,
    }}
  />
{/if}
