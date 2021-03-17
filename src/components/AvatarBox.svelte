<script>
  import Popover from "svelte-popover";
  import API from "../api/Api";

  import {
    userStore
  } from "../stores.js";
  export let userId;

  let userPopoverDetail;
</script>

{#if userId}
  <div class="avatar_box">
    <Popover
    overlayColor="rgba(0,0,0,0.1)"
      on:open={() => {
        API.get("/get_profile", { user_id: userId }).then((res) => {
          userPopoverDetail = res;
        });
      }}
      arrowColor="#fff">

      <div slot="target" style='display:flex'>
        <div>
          {#if $userStore.avatar[userId] != null}
            <img width="30" src={$userStore.avatar[userId]} class="avatars" alt="avatar" />
          {/if}
        </div>
        <div class='names'>
          <small>{$userStore.displayname[userId]}</small> 
          <br />
          <slot />
        </div>
      </div>
      <div slot="content">
        <div class="popover_content">
          {JSON.stringify(userPopoverDetail)}
        </div>
      </div>
    </Popover>
  </div>
{/if}

<style>
  .names{
    padding-left:.5em;
    line-height: 1em;
  }
  .avatar_box * {
    vertical-align: middle;
  }
</style>
