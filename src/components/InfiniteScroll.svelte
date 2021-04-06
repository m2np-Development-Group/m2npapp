<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { Button } from "svelma";
  export let threshold = 0;
  export let horizontal = false;
  export let elementScroll = false;
  export let hasMore = true;

  const dispatch = createEventDispatcher();
  let isLoadMore = false;
  let component;

  $: {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;

      element.addEventListener("scroll", onScroll);
      element.addEventListener("resize", onScroll);
    }
  }
  let hidden = true;
  const goTop = () => {
    const element = elementScroll ? elementScroll : component.parentNode;
    element.scrollTop = 0;
  };
  const onScroll = (e) => {
    const element = e.target;
    hidden = e.target.scrollTop < 2000;

    const offset = horizontal
      ? e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft
      : e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop;

    if (offset <= threshold) {
      if (!isLoadMore && hasMore) {
        dispatch("loadMore");
      }
      isLoadMore = true;
    } else {
      isLoadMore = false;
    }
  };

  onDestroy(() => {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;

      element.removeEventListener("scroll", null);
      element.removeEventListener("resize", null);
    }
  });
</script>

<div bind:this={component} style="width:0px" />
<div class="back-to-top" class:hidden>
  <Button on:click={goTop} rounded iconRight="arrow-up">Top</Button>
</div>

<style>
  .back-to-top {
    opacity: 1;
    transition: opacity 0.5s, visibility 0.5s;
    position: fixed;
    z-index: 99;
    right: 20px;
    user-select: none;
    bottom: 20px;
  }

  .back-to-top.hidden {
    opacity: 0;
    visibility: hidden;
  }
</style>
