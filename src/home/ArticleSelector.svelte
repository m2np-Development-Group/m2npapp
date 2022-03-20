<script>
  import Cell from "./Cell.svelte";
  import InfiniteScroll from "../components/InfiniteScroll.svelte";

  export let timeline = [];
  export let onCellClick = () => {};
  export let loadMore = () => {};
  export let hasMore = false;

  export let style;

  export let dom = {};
</script>

<section class="cells" style={style} bind:this={dom}>
  <Cell onCellClick={onCellClick} timeline={timeline} />
  <InfiniteScroll
    hasMore={hasMore}
    threshold={500}
    on:loadMore={() => {
      loadMore();
    }}
  />
</section>
