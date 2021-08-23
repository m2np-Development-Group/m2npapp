<script>
  import {flip} from 'svelte/animate';
  import {onMount} from 'svelte';
  import API from "../utils/Api";
  
  let list = [{url: "https://picsum.photos/seed/4/30", id: 0}, 
							{url: "https://picsum.photos/seed/43/30", id: 1},
							{url: "https://picsum.photos/seed/4123/30", id: 2}, 
							{url: "https://picsum.photos/seed/44/30", id: 3},
						  {url: "https://picsum.photos/seed/444/30", id: 4}];
  let hovering = false;

  const drop = (event, target) => {
    event.dataTransfer.dropEffect = 'move'; 
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    const newTracklist = list

    if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
    } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
    }
    list = newTracklist
    hovering = null
  }
  onMount(() => {
    API.get("/my_emojis", {}).then((res) => {
      // list = res;
    });
  });
  const dragstart = (event, i) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    const start = i;
    event.dataTransfer.setData('text/plain', start);
  }
  export let onInsert = (id) => {};

</script>

<div class="list">
  {#each list as n, index  (n.url)}
    <div
			 class="list-item" 
       animate:flip={{duration:300}}
       draggable={true} 
       on:dragstart={event => dragstart(event, index)}
       on:drop|preventDefault={event => drop(event, index)}
       ondragover="return false"
       on:dragenter={() => hovering = index}
       class:is-active={hovering === index}>
       	<img src={n.url} on:click={()=>{onInsert(n.id)}} alt="emoji" />
    </div>
  {/each}

</div>
<style>
  .list {
		display:flex;
		flex-wrap:wrap;
    background-color: white;
    border-radius: 4px;
		width:100%;
    border:1px dimgray solid;
  }

  .list-item {
		width:30px;
		border: 1px solid #dbdbdb;
		padding:2px;
  }


  .list-item.is-active {
    background-color: #3273dc;
    color: #fff;
  }
</style>