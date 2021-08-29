<script>
    import {myUnreadIds} from "../stores"
    import Cell from "./Cell.svelte"
    import InfiniteScroll from "../components/InfiniteScroll.svelte"
    import {Button} from "svelma";

    export let timeline = [];
    export let onCellClick = (id)=>{};
    export let loadMore = ()=>{}
    export let hasMore=false;

    export let style;

</script>

<section class="cells" style={style}>
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
