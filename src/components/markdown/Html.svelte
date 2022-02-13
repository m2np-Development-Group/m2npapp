<script>
  export let inRawBlock;
  inRawBlock;
  export let inLink;
  inLink;
  export let raw;
  raw;
  export let text;
</script>

{#if text === ""}
  <slot />
{/if}
{text}
