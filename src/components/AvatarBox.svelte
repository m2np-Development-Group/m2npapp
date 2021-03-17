<script>
  import Popover from "svelte-popover";
  import API from "../api/Api";

  import {
    userInfoStore,
    usernameStore,
    avatarStore,
    displaynameStore,
  } from "../stores.js";
  export let userId;
  let avatars = {};
  avatarStore.subscribe((value) => {
    avatars = value;
  });
  let displaynames = {};
  displaynameStore.subscribe((value) => {
    displaynames = value;
  });
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
        {#if avatars[userId] != null}
          <img width="30" src={avatars[userId]} class="avatars" alt="avatar" />
        {/if}
      </div>
      <div>
        <small>{displaynames[userId]}</small> 
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
  .avatar_box * {
    vertical-align: middle;
  }
</style>
