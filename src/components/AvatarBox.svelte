<script>
  import API from "../utils/Api";
  import Username from "./Username.svelte";
  import { userStore } from "../stores";
  export let userId;

  let userPopoverDetail;
</script>

{#if userId}
  <div style="display:flex" class="avatar_box">
    <div>
      {#if $userStore.avatar[userId] != null}
        <img
          width="33"
          src={$userStore.avatar[userId]}
          class="avatars"
          alt="avatar"
        />
      {/if}
    </div>
    <div class="names">
      <small><Username userId={userId} /></small>
      <br />
      <slot />
    </div>
  </div>
{/if}

<style>
  .names {
    padding: 0 0.5em 0 0.2em;
    line-height: 1em;
    margin-top: -3px;
  }
  .avatar_box {
    padding-bottom: 6px;
  }
  .avatar_box * {
    vertical-align: middle;
  }
</style>
