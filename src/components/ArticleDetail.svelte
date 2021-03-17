<script>
  import { getDateDiff, myMarked } from "../utils/util";
  import {
    displaynameStore,
  } from "../stores.js";
  import API from "../api/Api";
  import { Warning } from "./Notification";
  import AvatarBox from "./AvatarBox.svelte";


  export let showingArticle;

  export let replies = [];
</script>

<article>
  <AvatarBox userId={showingArticle["user_id"]}>
    <small>
      {getDateDiff(showingArticle.created_at)}
    </small>
    <small class="reply_count" class:red={showingArticle.nor > 0}
      >{showingArticle.nor}</small>
  </AvatarBox>

  <div class="post_content marked">
    {@html myMarked(showingArticle["content"])}
  </div>
  <i class="fa fa-trash-alt" />
  <span on:click={() => Warning("retweet")}><i class="fa fa-retweet" /></span>
  <span on:click={() => Warning("like")}><i class="fa fa-heart-o" /></span>
</article>

<div class="replies">
  {#each replies as reply}
    {$displaynameStore[reply.user_id]}:
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
  article {
    border-bottom: 1px solid;
  }
  .replies {
    max-height: calc(100vh - 300px);

    overflow-y: auto;
  }
</style>
