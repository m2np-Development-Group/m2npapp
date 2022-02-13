<script>
  import { onMount } from "svelte";
  import { Button } from "svelma";
  import CodeMirror from "./CodeMirror.svelte";
  import { Warning } from "../components/Notification";
  import EmojiSelector from "./EmojiSelector.svelte";
  import { exists } from "../utils/util";
  import API from "../utils/Api";

  export let onSubmit = (txt) => {};
  export let finishHandler = (id) => {};
  export let style = "";
  export let placeholder = "";
  export let onCancel = null;

  $: placeholder, editor?.setOption("placeholder", placeholder);

  // export let afterSubmit = (res)=>{};
  let files;
  export let initialText = "";
  const submitPost = () => {
    if (editor.getValue().trim() == "") {
      Warning("Missing Content");
      return;
    }
    onSubmit(editor.getValue()).then((res) => {
      if (res.msg == "ok") {
        finishHandler(editor.getValue());
        editor.setValue("");
        editor.clearHistory();
        editor.setValue("");
        editor.clearHistory();
      } else {
        Warning(res.msg);
      }
    });
  };
  let overridden = false; //override close window
  let editor;

  onMount(function () {
    window.onbeforeunload = function () {
      if (editor.getValue() != "") {
        if (overridden != true) {
          return "你的文章還沒儲存, 確定要離開嗎?";
        }
      }
    };
  });
  let isShowEmojiSelector = false;
  let isShowFileUploader = false;
  let fileinput;
  let uploadPercentage;
</script>

<div style={style}>
  <CodeMirror bind:editor onSubmit={submitPost} initialText={initialText} />

  {#if isShowEmojiSelector}
    <div style="margin-top:3px">
      <EmojiSelector onInsert={(id) => editor.replaceSelection(` \$${id} `)} />
    </div>
  {/if}
  {#if isShowFileUploader}
    <div style="margin-top:3px">FS (WIP)</div>
  {/if}
  <div class="toolbar">
    <div class="toolbar-left">
      <label for="smiley">
        <i
          class="fas fa-smile big-icon"
          on:click={() => {
            isShowEmojiSelector = !isShowEmojiSelector;
          }}
        />
      </label>

      <i
        class="fas fa-file-image big-icon"
        on:click={() => {
          fileinput.click();
        }}
      />

      <input
        style="display:none"
        type="file"
        accept=".jpg, .jpeg, .png"
        bind:this={fileinput}
        on:change={(e) => {
          let image = e.target.files[0];
          let reader = new window.FileReader();
          if (image && image.type.match("image.*")) {
            reader.readAsDataURL(image);
          }
          reader.onload = (e) => {
            if (e.target.result.length > 3000 * 1000) {
              alert("file is too large");
              return;
            }
            //avatar = e.target.result;

            let data = new window.FormData();
            data.append("file", files[0]);

            API.formPostFile("/upload_image", data, (e) => {
              uploadPercentage = Math.round((e.loaded * 100.0) / e.total);
            })
              .then((res) => {
                if (res.msg == "ok") {
                  editor.replaceSelection(res.filename);
                } else {
                  console.log(res);
                }
              })
              .finally(() => {
                files = null;
                uploadPercentage = null;
              });
          };
        }}
        bind:files
      />
      {#if files && files[0]}
        <p>
          {files[0].name} : {uploadPercentage != 100
            ? uploadPercentage + "%"
            : "Processing..."}
        </p>
      {/if}

      <span style="opacity:0.6">按 Ctrl+Enter 送出</span>
    </div>
    <div class="submit_buttons">
      {#if exists(onCancel)}
        <Button size="is-small" rounded on:click={onCancel(editor.getValue())}
          >取消</Button
        >
      {/if}
      {#if exists(onSubmit)}
        <Button
          size="is-small"
          rounded
          type="is-success"
          iconLeft="paper-plane"
          on:click={submitPost(editor.getValue())}>提交</Button
        >
      {/if}
    </div>
  </div>
  <div style="clear:both" />
</div>

<style>
  .toolbar {
    padding-top: 3px;
  }
  .toolbar-left {
    display: block;
    float: left;
    padding: 3px 0 0 3px;
  }
  .toolbar-left i {
    padding-right: 3px;
    cursor: pointer;
  }
  .submit_buttons {
    float: right;
    padding: 0;
  }
  .big-icon {
    font-size: 16px;
    color: dimgray;
  }
</style>
