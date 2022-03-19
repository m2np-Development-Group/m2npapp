<script>
  import { getDateDiff } from "../utils/util";
  import { myInfoStore } from "../stores.js";
  import { exists } from "../utils/util";
  import API from "../utils/Api";
  import { Warning } from "../lib/Notification";
  import AvatarBox from "./AvatarBox.svelte";
  import Postbox from "./Postbox.svelte";
  import ReplyEntry from "./ReplyEntry.svelte";
  import Markdown from "./Markdown.svelte";
  import { watchResize } from "svelte-watch-resize";

  export let onArticleContentChanged = () => {};
  export let article;
  export let style;
  export let classes = "";
  $: if (article.id) {
    if (editingArticle.id != article.id) {
      editingArticle = {};
    }
  }
  export let replies = [];
  export let onDelete = () => {};
  export let isLiked = false;
  export let isMuted = false;
  let editingArticle = {};
  let height;
  let articleDom;
</script>

<div style={style} class={classes}>
  <article bind:this={articleDom}>
    <AvatarBox userId={article["user_id"]}>
      <small>
        {getDateDiff(article.created_at)}
      </small>
      <!-- class:red={article.nor > 0} -->
      | <small class="reply_count">{replies?.length ?? 0} 則回應</small>
    </AvatarBox>

    {#if !exists(editingArticle.id)}
      <div class="post_content marked">
        <Markdown content={article["content"]} />
      </div>

      <div>
        {#if $myInfoStore.user.id == article.user_id}
          <i
            class="fa fa-pencil-alt smallButtons editButton"
            on:click={() => {
              editingArticle = article;
            }}
          />
        {/if}

        {#if isLiked}
          <i
            class="fas fa-heart smallButtons"
            style="color:red"
            on:click={() => {
              API.post("/unlike", { postId: article.id }).then((res) => {
                isLiked = false;
              });
            }}
          />
        {:else}
          <i
            class="far fa-heart likeButton smallButtons"
            on:click={() => {
              API.post("/like", { postId: article.id }).then((res) => {
                isLiked = true;
              });
            }}
          />
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
            class="fa fa-trash trashButton smallButtons"
          />
        {/if}

        {#if isMuted}
          <i
            class="fas fa-volume smallButtons"
            style="color:cornflowerblue"
            on:click={() => {
              API.post("/unmute", { postId: article.id }).then((res) => {
                isMuted = false;
              });
            }}
          />
        {:else}
          <i
            class="fas fa-volume-mute muteButton smallButtons"
            on:click={() => {
              API.post("/mute", { postId: article.id }).then((res) => {
                isMuted = true;
              });
            }}
          />
        {/if}

        <i
          on:click={() => {
            window.open(`/p/${article.id}`, "_blank");
          }}
          class="fas fa-external-link-alt externalLinkButton smallButtons"
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
            if (confirm("你有改過喔! 確定要取消嗎? ")) {
              editingArticle = {};
            }
          } else {
            editingArticle = {};
          }
        }}
        onSubmit={(txt) =>
          API.post("update_post", { id: article.id, content: txt })}
        initialText={article["content"]}
      />
    {/if}
  </article>

  <div
    class="replies"
    use:watchResize={(node) => {
      height = articleDom.clientHeight;
    }}
    style="max-height:calc(100vh - {height + 145}px)"
  >
    {#if replies === undefined}
      <i class="fas fa-spinner fa-pulse" /> LOADING...
    {:else}
      {#if Array.isArray(replies)}
        {#each replies as reply}
          <ReplyEntry
            reply={reply}
            threadAuthorId={article["user_id"]}
            onDelete={(id) => {
              article.nor--;
              replies = replies.filter((v) => {
                return v.id != id;
              });
            }}
          />
        {/each}
      {/if}
      {#if replies.length == 0}
        <div
          style="font-size: 13px; text-align: center; color: #CCC; padding:1em"
        >
          還沒有人回應哦，趕快來搶頭香囉！:)
        </div>
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
    overflow: auto;
    max-height: calc(50vh - 50px);
    border-bottom: 1px solid rgba(50, 50, 50, 0.2);
    padding-bottom: 3px;
    margin-bottom: 3px;
  }
  .replies {
    /* max-height: calc(100vh - 400px); */
    overflow: auto;
  }

  .smallButtons {
    border-radius: 3px;
    padding: 3px;
    cursor: pointer;
  }
  .externalLinkButton:hover {
    background: #333;
    color: white;
  }
  .trashButton:hover {
    background: #666;
    color: white;
  }
  .likeButton:hover {
    background: red;
    color: white;
  }
  .muteButton:hover {
    background: cornflowerblue;
    color: white;
  }
  .editButton:hover {
    background: #050b15;
    color: white;
  }

  .post_content {
    overflow: auto;
    padding: 3px;
  }
  :global(.post_content table) {
    border-spacing: 0;
  }
  :global(.post_content table td) {
    padding-right: 1em;
    /* border-bottom: #fbbc2a67 1px solid; */
  }
</style>
