<script>
  import { onMount } from 'svelte'
  import Icon from './Icon.svelte'
  import { omit } from '../utils/util'

  export let tag = 'button'
  export let type = ''
  export let size = ''
  export let href = ''
  export let nativeType = 'button'

  export let loading = false
  export let inverted = false
  export let outlined = false
  export let rounded = false

  export let iconLeft = null
  export let iconRight = null
  export let iconPack = null

  let iconSize = ''

  onMount(() => {
    if (!['button', 'a'].includes(tag)) throw new Error(`'${tag}' cannot be used as a tag for a Bulma button`)
  })

  $: props = {
    ...omit($$props, 'loading', 'inverted', 'nativeType', 'outlined', 'rounded', 'type'),
    class: `button ${type} ${size} ${$$props.class || ''}`,
  }

  $: {
    if (!size || size === 'is-medium') {
      iconSize = 'is-small'
    } else if (size === 'is-large') {
      iconSize = 'is-medium'
    } else {
      iconSize = size
    }
  }
</script>

<button
  {...props}
  type={nativeType}
  class:is-inverted={inverted}
  class:is-loading={loading}
  class:is-outlined={outlined}
  class:is-rounded={rounded}
  on:click>
  {#if iconLeft}
    <Icon pack={iconPack} icon={iconLeft} size={iconSize} />
  {/if}
  <span>
    <slot />
  </span>
  {#if iconRight}
    <Icon pack={iconPack} icon={iconRight} size={iconSize} />
  {/if}
</button>
