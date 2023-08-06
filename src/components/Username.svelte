<script>
  import { colorMap } from "../utils/util";
  import { userStore } from "../stores";
  import { link } from "svelte-navigator";
  export let userId;
</script>

{#if $userStore.username[userId] == undefined}
  <span style="color: #999">無名</span>
{:else}
  <a class="un" href={"/user/" + $userStore.username[userId]} use:link>
    <span style={"color: #" + colorMap[$userStore.color[userId]]}
      >{$userStore.displayname[userId]}</span
    >
  </a>
{/if}

<style>
  .un {
    font-weight: bold;
  }
</style>
