<script>
  import { getDateDiff, myMarked } from "../utils/util";
  import { userStore } from "../stores.js";
  import API from "../api/Api";
  import { Warning } from "./Notification";
  import AvatarBox from "./AvatarBox.svelte";
  import Carousel from "./Carousel.svelte";
  import { Modal } from "svelma2";

  export let showingArticle;

  export let replies = [];
  export let onDelete = () => {};
  let isActive = false;
  let editingArticle = false;
</script>

<Modal bind:active={isActive}>
  <div style="background:white;padding:1em;border-radius:1em;overflow:hidden">
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

  {#if !editingArticle}
    <div class="post_content marked">
      {@html myMarked(showingArticle["content"])}
    </div>
  {:else}
    editing
  {/if}
  <i class="fa fa-pencil-alt" on:click={() => {editingArticle=!editingArticle}} />
  <i
    on:click={() => {
      isActive = !isActive;
    }}
    class="fa fa-train" />

  <i
    on:click={() => {
      if (confirm("你確定要刪除嗎?" + showingArticle.id)) {
        API.post("/delete_post", { id: showingArticle.id }).then((res) => {
          if (res.msg == "ok") {
            onDelete();
          } else {
            Warning(res.msg);
          }
        });
      }
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
    border-bottom: 1px solid rgba(50, 50, 50, 0.2);
  }
  .replies {
    max-height: calc(100vh - 300px);

    overflow-y: auto;
  }
</style>
