<script>
    import {myUnreadIds} from "../stores"
    import Cell from "./Cell.svelte"
    import InfiniteScroll from "../components/InfiniteScroll.svelte"

    export let timeline = [];
    export let onCellClick = (id)=>{};
    export let loadMore = ()=>{}
    export let hasMore=false;

    export let style;

    export let dom;
</script>

<section class="cells" style={style} bind:this={dom}>
    {#each timeline as v}
      <Cell
        isUnread={$myUnreadIds.includes(v.id)}
        onCellClick={()=>{
            onCellClick(v)
        }}
        cellData={v} />
    {/each}
  <InfiniteScroll
    hasMore={hasMore}
    threshold={500}
    on:loadMore={() => {
      loadMore();
    }} />


</section>
