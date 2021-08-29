<script>
    export let href = ''
    export let title = undefined
    export let text = ''
    export let raw; raw;
  </script>
  
  <img src={href} {title} alt={text} />
  {#if href==""}
  <slot />
  {/if}
  