<script>
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import API from "../utils/Api";
  import {BasicStickers} from "../utils/const"
  import {BasicStickersUrlPrefix} from "../utils/const"

  let hovering = false;

  const drop = (event, target) => {
    event.dataTransfer.dropEffect = "move";
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    const newTracklist = list;

    if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
    } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
    }
    list = newTracklist;
    hovering = null;
  };
  onMount(() => {
    API.get("/my_emojis", {}).then((res) => {
      // list = res;
    });
  });
  const dragstart = (event, i) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    const start = i;
    event.dataTransfer.setData("text/plain", start);
  };
  export let onInsert = (id) => {};
</script>

<div class="list">
  {#each Object.entries(BasicStickers) as [key, url], index(key)}
    <div
      class="list-item"
      animate:flip={{ duration: 300 }}
      draggable={true}
      on:dragstart={(event) => dragstart(event, index)}
      on:drop|preventDefault={(event) => drop(event, index)}
      ondragover="return false"
      on:dragenter={() => (hovering = index)}
      class:is-active={hovering === index}>
      <img
        src="{BasicStickersUrlPrefix}{url}"
        on:click={() => {
          onInsert(key);
        }}
        alt="emoji" />
    </div>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-wrap: wrap;
    background-color: white;
    border-radius: 4px;
    width: 100%;
    border: 1px #ccc solid;
  }

  .list-item {
    width: 30px;
    /* border: 1px solid #dbdbdb; */
    padding: 2px;
  }

  .list-item.is-active {
    background-color: #3273dc;
    color: #fff;
  }
</style>
