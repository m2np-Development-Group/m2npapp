<script>
  import { getDateDiff} from "../utils/util";
  import { myInfoStore } from "../stores.js";
  import { exists } from "../utils/util";
  import API from "../utils/Api";
  import { Warning } from "./Notification";
  import AvatarBox from "./AvatarBox.svelte";
  import Postbox from "./Postbox.svelte";
  import ReplyEntry from "./ReplyEntry.svelte";
  import Markdown from "./Markdown.svelte";
  
  export let onArticleContentChanged=(content)=>{}
  export let article;
  export let style;
  export let classes;
  $: if (article.id) {
    if (editingArticle.id != article.id) {
      editingArticle = {};
    }
  }
  export let replies;
  export let onDelete = () => {};
  let editingArticle = {};

</script>


<div style={style} class={classes}>
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
        <Markdown content={article["content"]} />
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
            if (confirm("你有改過喔! 確定要取消嗎? ")){
              editingArticle = {};
            }
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
      <span on:click={() => {
        API.post("/retweet", { postId: article.id }).then((res) => {
        if (res.msg != "ok") {
          return;
        }else{
          alert("success");
        }
        });
      }}
        ><i class="fa fa-retweet" /></span>
    {/if}
    <span on:click={() => Warning("like")}><i class="fa fa-heart-o" /></span>
  </article>

  <div class="replies">
    {#if replies === undefined}
      <i class="fas fa-spinner fa-pulse" /> LOADING...
    {:else}
      {#each replies as reply}
        <ReplyEntry reply={reply} onDelete={(id)=>{
          article.nor--
          replies=replies.filter((v)=>{
            return v.id != id
          })
        }} />
      {/each}
      {#if replies.length == 0}
        No Replies.
      {/if}
    {/if}
  </div>
</div>
<style>
  :global(.marked) {
    word-break: break-all;
  }
  :global(.marked hr) {
    display: none;
  }
  article {
    overflow:auto;
    max-height: calc(50vh - 50px);
    border-bottom: 1px solid rgba(50, 50, 50, 0.2);
  }
  .replies {
    max-height: calc(100vh - 400px);

    overflow-y: auto;
  }

  .post_content {
    overflow:auto;
  }
  :global(.post_content table) {
    border-spacing: 0;
  }
  :global(.post_content table td) {
    padding-right: 1em;
    /* border-bottom: #fbbc2a67 1px solid; */
  }

</style>
