<script>
    import Popover from "svelte-popover";
    import {getDateDiff,myMarked} from "../utils/util";
    import { userInfoStore, usernameStore, avatarStore,displaynameStore } from "../stores.js";
import API from "../api/Api";


    let avatars = {};
  avatarStore.subscribe((value) => {avatars = value;});
  let usernames = {};
  usernameStore.subscribe((value) => {usernames = value;});
  let displaynames = {};
  displaynameStore.subscribe((value) => {displaynames = value;});

let userPopoverDetail;
    export let showingArticle;

    export let replies = [];
</script>
<article>
  <div class="avatar_box">
    <Popover on:open={() => {
      API.get("/get_profile",{user_id:showingArticle["user_id"]}).then((res)=>{
        userPopoverDetail=res
      });
    }} arrowColor="#fff">
      <div slot="target">
        {#if avatars[showingArticle["user_id"]] != null}
          <img
            width="20"
            src={avatars[showingArticle["user_id"]]}
            class="avatars"
            alt="avatar" />
        {/if}
        {displaynames[showingArticle["user_id"]]}
      </div>
      <div slot="content" style='background:white;width:300px;height:200px;overflow:auto;font-size:12px;color:black'>
        {JSON.stringify(userPopoverDetail)}
      </div>
    </Popover>

    <small>
      {getDateDiff(showingArticle.created_at)}
    </small>
  </div>
  <div class="post_content marked">
    {@html myMarked(showingArticle["content"])}
  </div>
  <i class="fa fa-trash-alt" />
  <span on:click={() => alert("retweet")}><i class="fa fa-retweet" /></span>
  <span on:click={() => alert("like")}><i class="fa fa-heart-o" /></span>
</article>

<div class="replies">
  {#each replies as reply}
    {displaynames[reply.user_id]}:
    <span class="marked">{@html myMarked(reply.content)}</span>
  {/each}
  {#if replies.length == 0}
    No Replies.
  {/if}
</div>

<style>
  .marked {
    word-break: break-all;
  }
      .replies {
    max-height: calc(100vh - 300px);

    overflow-y: auto;
  }
</style>