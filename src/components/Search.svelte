<script>
  import API from "../api/Api";
  import { link } from "svelte-navigator";
  let content = "請輸入";
  let searchWord = "";
  let currentType = 0;

  let fetch = async (txt, type) => {
    content = "Loading...";
    if (type == 0) {
      API.get("/search?username=" + txt).then((res) => {
        content = res;
      });
    } else {
      content = "Working in progress...";
    }
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
      }} />
    <span class="icon is-small is-left">
      <i class="fas fa-search" />
    </span>
  </p>
</div>

<div class="tabs is-boxed">
  <ul>
    <li
      class:is-active={currentType == 0}
      on:click={() => {
        changeTab(0);
      }}>
      <a>
        <span class="icon is-small"
          ><i class="fas fa-grin-squint" aria-hidden="true" /></span>
        <span>人</span>
      </a>
    </li>
    <li
      class:is-active={currentType == 1}
      on:click={() => {
        changeTab(1);
      }}>
      <a>
        <span class="icon is-small"
          ><i class="fas fa-file-alt" aria-hidden="true" /></span>
        <span>文</span>
      </a>
    </li>
    <li
      class:is-active={currentType == 2}
      on:click={() => {
        changeTab(2);
      }}>
      <a>
        <span class="icon is-small"
          ><i class="fas fa-music" aria-hidden="true" /></span>
        <span>音</span>
      </a>
    </li>
    <li
      class:is-active={currentType == 3}
      on:click={() => {
        changeTab(3);
      }}>
      <a>
        <span class="icon is-small"
          ><i class="far fa-file-image" aria-hidden="true" /></span>
        <span>圖</span>
      </a>
    </li>
  </ul>
</div>
<div class="block">

      {#if Array.isArray(content)}
        {#each content as v}
          <a href={`/user/` + v.username} use:link>{v.username}</a> 
        {/each}
      {:else}
        {content}
      {/if}
</div>
