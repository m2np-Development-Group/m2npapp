<script>
  import API from "../utils/Api";
  import { link } from "svelte-navigator";
  let content = "請輸入";
  let searchWord = "";
  let currentType = 0;

  let fetch = async (txt, type) => {
    content = "Loading...";

    API.get("/search?username=" + txt).then((res) => {
      content = res;
    });
  };

  function changeTab(type) {
    currentType = type;
    fetch(searchWord, type);
  }
</script>

<div class="field">
  <p class="control has-icons-left has-icons-right">
    <input
      class="input"
      type="text"
      placeholder="輸入"
      bind:value={searchWord}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          changeTab(currentType);
        }
      }}
    />
    <span class="icon is-small is-left">
      <i class="fas fa-search" />
    </span>
  </p>
</div>

<div class="block">
  {#if Array.isArray(content)}
    {#each content as v}
      <a href={`/user/` + v.username} use:link>{v.display_name}({v.username})</a
      ><br />
    {/each}
  {:else}
    {content}
  {/if}
</div>
