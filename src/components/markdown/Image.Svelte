<script>
    import LazyImage from 'svelte-lazy-image';

    export let href = ''
    export let title = undefined
    export let text = ''
    export let raw=''; raw;
  </script>
  
  <!-- <img src={href} {title} alt={text} /> -->
  <LazyImage
  src={href}
  placeholder={href}
  title={title}
  alt={text}
/>
  {#if href==""}
  <!-- should not happen -->
  <slot />
  {/if}
  