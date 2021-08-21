<script>
  import { getDateDiff, myMarked, colorMap } from "../utils/util";
  import { myInfoStore, userStore } from "../stores.js";
  import { exists } from "../utils/util";
  import API from "../utils/Api";
  import { Warning } from "./Notification";
  import AvatarBox from "./AvatarBox.svelte";
  import Carousel from "./Carousel.svelte";
  import Link from "./markdown/Link.svelte";
  import { Modal } from "svelma";
  import Postbox from "./Postbox.svelte";
  import ReplyEntry from "./ReplyEntry.svelte";
  import SvelteMarkdown from 'svelte-markdown'

  export let onArticleContentChanged=(content)=>{}
  export let article;
  $: if (article.id) {
    if (editingArticle.id != article.id) {
      editingArticle = {};
    }
  }
  export let replies;
  export let onDelete = () => {};
  let isCarViewActive = false;
  let editingArticle = {};
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
    <!-- class:red={article.nor > 0} -->
    | <small class="reply_count">{article.nor} 則回應</small>
  </AvatarBox>

  {#if !exists(editingArticle.id)}
    <div class="post_content marked">
      <SvelteMarkdown source={article["content"]} options={{
        gfm:true,
        breaks:true,
      }}
      renderers={{    
          "link": Link
      }}
      />
    </div>
  {:else}
    <Postbox
      finishHandler={(content) => {
        // console.log("fin"+content);
        article.content = content;
        editingArticle = {};
        onArticleContentChanged(content);
      }}
      onCancel={(txt) => {
        if (txt != article["content"]) {
          alert("Work in progress");
        } else {
          editingArticle = {};
        }
      }}
      onSubmit={(txt) => API.post("update_post", { id: article.id, content: txt })}
      initialText={article["content"]} />
  {/if}

  
  {#if $myInfoStore.user.id == article.user_id}
    <i
      class="fa fa-pencil-alt"
      on:click={() => {
        editingArticle = article;
      }} />
  {/if}
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
  {#if replies === undefined}
    <i class="fas fa-spinner fa-pulse" /> LOADING...
  {:else}
    {#each replies as reply}
      <ReplyEntry reply={reply} />
    {/each}
    {#if replies.length == 0}
      No Replies.
    {/if}
  {/if}
</div>

<style>
  :global(.marked) {
    word-break: break-all;
  }
  :global(.marked hr) {
    display: none;
  }
.post_content{overflow:auto}
  article {
    overflow:auto;
    max-height: calc(50vh - 50px);
    border-bottom: 1px solid rgba(50, 50, 50, 0.2);
  }
  .replies {
    max-height: calc(50vh - 50px);

    overflow-y: auto;
  }

  .post_content {
    font-size: 13px;
  }
  :global(.post_content table) {
    border-spacing: 0;
  }
  :global(.post_content table td) {
    padding-right: 1em;
    /* border-bottom: #fbbc2a67 1px solid; */
  }

</style>
