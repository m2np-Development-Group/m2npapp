<script>
  import { getDateDiff, myMarked, colorMap } from "../utils/util";
  import { myInfoStore, userStore } from "../stores.js";
  import API from "../api/Api";
  import { Warning } from "./Notification";
  import AvatarBox from "./AvatarBox.svelte";
  import Carousel from "./Carousel.svelte";
  import { Modal } from "svelma2";
  import Postbox from "./Postbox.svelte";
  import Username from "./Username.svelte"
  
  export let article;
  export let replies = [];
  export let onDelete = () => {};
  let isCarViewActive = false;
  let editingArticle = false;
</script>

<Modal bind:active={isCarViewActive}>
  <div style="background:white;padding:1em;border-radius:1em;overflow:hidden">
    <Carousel />
  </div>
</Modal>

<article>
  <AvatarBox userId={article["user_id"]}>
    <small>
      {getDateDiff(article.created_at)}
    </small>
    <small class="reply_count" class:red={article.nor > 0}>{article.nor}</small>
  </AvatarBox>

  {#if !editingArticle}
    <div class="post_content marked">
      {@html myMarked(article["content"])}
    </div>
  {:else}
    <Postbox
      finishHandler={(content) => {
        article["content"]=content
        editingArticle = false;
      }}
      onSubmit={(txt) => API.post("update_post", { id: article.id, content: txt })}
      initialText={article["content"]} />
  {/if}
  <i
    class="fa fa-pencil-alt"
    on:click={() => {
      editingArticle = !editingArticle;
    }} />
  <i
    on:click={() => {
      isCarViewActive = !isCarViewActive;
    }}
    class="fa fa-train" />

  {#if article.user_id == $myInfoStore.user.id}
    <i
      on:click={() => {
        if (confirm("你確定要刪除嗎?" + article.id)) {
          API.post("/delete_post", { id: article.id }).then((res) => {
            if (res.msg == "ok") {
              onDelete();
            } else {
              Warning(res.msg);
            }
          });
        }
      }}
      class="fa fa-trash-alt" />
  {/if}
  {#if article.user_id != $myInfoStore.user.id}
    <span on:click={() => Warning("work in progress")}
      ><i class="fa fa-retweet" /></span>
  {/if}
  <span on:click={() => Warning("like")}><i class="fa fa-heart-o" /></span>
</article>

<div class="replies">
  

  {#each replies as reply}
    <Username userId={reply.user_id} />:
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
