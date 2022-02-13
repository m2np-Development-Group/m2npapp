<script>
  import { colorMap } from "../utils/util";
  import { userStore } from "../stores.js";
  import { link } from "svelte-navigator";
  export let userId;
</script>

<a class="un" href={"/user/" + $userStore.username[userId]} use:link>
  <span style={"color: #" + colorMap[$userStore.color[userId]]}
    >{$userStore.displayname[userId]}</span
  >
</a>

<style>
  .un {
    font-weight: bold;
  }
</style>
