<script>
  //       <ReplyEntry userId={reply.user_id} content={reply.content}
  import Username from "./Username.svelte";
  import { exists, myMarked } from "../utils/util";
  import API from "../utils/Api";
  import { Warning } from "./Notification";
  import Postbox from "./Postbox.svelte";

  export let reply;
  let editingReply = {};
  $: if (reply.id) {
    if (editingReply.id != reply.id) {
      editingReply = {};
    }
  }
  let show = false;

  function toggleShow() {
    show = !show;
  }
</script>

<div
  class="reply_box_outer"
  on:mouseenter={toggleShow}
  on:mouseleave={toggleShow}>
  {#if !exists(editingReply.id)}
    <div class="reply_box">
      <Username userId={reply.user_id} />:
      <span class="marked">{@html myMarked(reply.content)}</span>
    </div>
    {#if show}
      <div class="editbox">
        <i
          class="fa fa-pencil-alt"
          on:click={() => {
            editingReply = reply;
          }} />
        <i
          on:click={() => {
            if (confirm("你確定要刪除嗎?" + reply.id)) {
              API.post("/delete_post", { id: reply.id }).then((res) => {
                if (res.msg == "ok") {
                  // onDelete();
                } else {
                  Warning(res.msg);
                }
              });
            }
          }}
          class="fa fa-trash-alt" />
      </div>
    {/if}
  {:else}
    <Postbox
      finishHandler={(content) => {
        reply.content = content;
        editingReply = {};
      }}
      onCancel={(txt) => {
        if (txt != reply.content) {
          alert("Work in progress");
        } else {
          editingReply = {};
        }
      }}
      onSubmit={(txt) =>
        API.post("update_reply", { id: reply.id, content: txt })}
      initialText={reply.content} />
  {/if}
</div>

<style>
  .reply_box_outer:hover {
    background-color: #ddd;
  }
  .reply_box_outer {
    position: relative;
  }
  .editbox {
    position: absolute;
    right: 0;
    top: 0;
    color: #bbb;
  }
</style>
