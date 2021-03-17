<script>
    import {getDateDiff,myMarked} from "../utils/util";
    import { userInfoStore, usernameStore, avatarStore,displaynameStore } from "../stores.js";
import API from "../api/Api";
import { Warning } from "./Notification";
import AvatarBox from "./AvatarBox.svelte"

    let avatars = {};
  avatarStore.subscribe((value) => {avatars = value;});
  let usernames = {};
  usernameStore.subscribe((value) => {usernames = value;});
  let displaynames = {};
  displaynameStore.subscribe((value) => {displaynames = value;});

    export let showingArticle;

    export let replies = [];
</script>
<article>
<AvatarBox userId={showingArticle["user_id"]} />
  <small>
    {getDateDiff(showingArticle.created_at)}
  </small>
  <div class="post_content marked">
    {@html myMarked(showingArticle["content"])}
  </div>
  <i class="fa fa-trash-alt" />
  <span on:click={() => Warning("retweet")}><i class="fa fa-retweet" /></span>
  <span on:click={() => Warning("like")}><i class="fa fa-heart-o" /></span>
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
  article{
    border-bottom: 1px solid;}
      .replies {
    max-height: calc(100vh - 300px);

    overflow-y: auto;
  }
</style>