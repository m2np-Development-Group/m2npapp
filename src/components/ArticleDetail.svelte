<script>
  import { getDateDiff, myMarked } from "../utils/util";
  import { userStore } from "../stores.js";
  import API from "../api/Api";
  import { Warning } from "./Notification";
  import AvatarBox from "./AvatarBox.svelte";
  import Carousel from "./Carousel.svelte";
  import { Modal } from "@abbychau/svelma";

  export let showingArticle;

  export let replies = [];

  let isActive = false;
  let editingArticle = false;
</script>

<Modal bind:active={isActive}>
  <div style="background:white;padding:1em;border-radius:1em">
    <Carousel />
  </div>
</Modal>

<article>
  <AvatarBox userId={showingArticle["user_id"]}>
    <small>
      {getDateDiff(showingArticle.created_at)}
    </small>
    <small class="reply_count" class:red={showingArticle.nor > 0}
      >{showingArticle.nor}</small>
  </AvatarBox>

  {#if editingArticle}
  <div class="post_content marked">
    {@html myMarked(showingArticle["content"])}
  </div>
  {/if}
  <i
    class="fa fa-pencil-alt"
    on:click={() => {
      
    }} />
  <i
    on:click={() => {
      isActive = !isActive;
    }}
    class="fa fa-trash-alt" />
  <span on:click={() => Warning("retweet")}><i class="fa fa-retweet" /></span>
  <span on:click={() => Warning("like")}><i class="fa fa-heart-o" /></span>
</article>

<div class="replies">
  {#each replies as reply}
    {$userStore.displayname[reply.user_id]}:
    <span class="marked">{@html myMarked(reply.content)}</span>
  {/each}
  {#if replies.length == 0}
    No Replies.
  {/if}
</div>

<style>
  :global(.marked) {
    word-break: break-all;
  }
  :global(.marked hr) {
    display: none;
  }

  article {
    border-bottom: 1px solid;
  }
  .replies {
    max-height: calc(100vh - 300px);

    overflow-y: auto;
  }
</style>
