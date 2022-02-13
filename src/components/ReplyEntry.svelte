<script>
  import Username from "./Username.svelte";
  import { exists } from "../utils/util";
  import API from "../utils/Api";
  import { Warning } from "./Notification";
  import Postbox from "./Postbox.svelte";
  import Markdown from "./Markdown.svelte";
  import { myInfoStore } from "../stores";
  export let onDelete = () => {};
  export let reply;
  let editingReply = {};
  $: if (reply.id) {
    if (editingReply.id != reply.id) {
      editingReply = {};
    }
  }
  let isFloatingBoxShow = false;
  export let threadAuthorId;
</script>

<div
  class="reply_box_outer"
  on:mouseenter={() => {
    if (
      reply.user_id == $myInfoStore.user.id ||
      threadAuthorId == $myInfoStore.user.id
    ) {
      isFloatingBoxShow = true;
    }
  }}
  on:mouseleave={() => {
    isFloatingBoxShow = false;
  }}
>
  {#if !exists(editingReply.id)}
    <div class="reply_box">
      <Username userId={reply.user_id} />:
      <span class="marked">
        <Markdown content={reply.content} />
      </span>
    </div>
    {#if isFloatingBoxShow}
      <div class="editbox">
        {#if reply.user_id == $myInfoStore.user.id}
          <i
            class="fa fa-pencil-alt"
            on:click={() => {
              editingReply = reply;
            }}
          />
        {/if}
        <i
          on:click={() => {
            if (confirm("你確定要刪除嗎?" + reply.id)) {
              API.post("/delete_reply", { id: reply.id }).then((res) => {
                if (res.msg == "ok") {
                  onDelete(reply.id);
                } else {
                  Warning(res.msg);
                }
              });
            }
          }}
          class="fa fa-trash"
        />
      </div>
    {/if}
  {:else}
    <div style="background-color: #f7f7fa;">
      <Username userId={reply.user_id} />:<br />
      <Postbox
        finishHandler={(content) => {
          reply.content = content;
          editingReply = {};
        }}
        onCancel={(txt) => {
          if (txt != reply.content) {
            //alert("Work in progress");
          } else {
          }
          editingReply = {};
        }}
        onSubmit={(txt) =>
          API.post("update_reply", { id: reply.id, content: txt })}
        initialText={reply.content}
      />
    </div>
  {/if}
</div>

<style>
  .reply_box_outer:hover {
    background-color: #f7f7fa;
  }
  .reply_box_outer {
    position: relative;
    padding: 1px;
  }
  .editbox {
    position: absolute;
    right: 0;
    top: 0px;
    color: #bbb;
    background: white;
    border-radius: 3px;
    padding: 0 1px 1px 1px;
  }
  .editbox i {
    padding: 3px;
    cursor: pointer;
    border-radius: 3px;
  }
  .editbox i:hover {
    color: white;
    background-color: #ccc;
  }
</style>
