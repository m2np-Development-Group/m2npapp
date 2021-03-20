<script>
  import { onMount } from "svelte";
  import API from "../api/Api";
  import inlineAttachment from "./inlineAttachment";
  import { Warning } from "../components/Notification";
  import Popover from "svelte-popover";
  import EmojiSelector from "./EmojiSelector.svelte";
  export let finishHandler = (id) => {};
  export let style = "";
  export let placeholder = "";
  export let onSubmit = (txt) => {};
  // export let afterSubmit = (res)=>{};
  let files;
  export let initialText="";
  const submitPost = () => {
    onSubmit(editor.getValue()).then((res) => {
      editor.setValue("");
      editor.clearHistory();
      if (res.msg == "ok") {
        editor.setValue("");
        editor.clearHistory();
        finishHandler(res.id);
      } else {
        Warning(res.msg);
      }
    });
  };
  let textContent;
  let overridden = false; //override close window
  let editor;

  onMount(function () {
    editor = CodeMirror.fromTextArea(textContent, {
      mode: {
        name: "gfm",
        tokenTypeOverrides: {
          emoji: "emoji",
        },
      },
      lineWrapping: true,
      extraKeys: { Enter: "newlineAndIndentContinueMarkdownList" },

      lineNumbers: true,
      matchBrackets: true,
      indentUnit: 4,
      indentWithTabs: true,
      enterMode: "keep",
      tabMode: "shift",
      extraKeys: {
        "Ctrl-Enter": (cm) => {
          submitPost();
        },
        "Cmd-Enter": (cm) => {
          submitPost();
        },
      },
    });
    inlineAttachment.editors.codemirror4.attach(editor, {
      onFileUploadResponse: function (xhr) {
        const result = JSON.parse(xhr.responseText),
          filename = result[this.settings.jsonFieldName];

        if (result && filename) {
          let newValue;
          if (typeof this.settings.urlText === "function") {
            newValue = this.settings.urlText.call(this, filename, result);
          } else {
            newValue = this.settings.urlText.replace(
              this.filenameTag,
              filename
            );
          }
          const text = this.editor.getValue().replace(this.lastValue, newValue);
          this.editor.setValue(text);
          this.settings.onFileUploaded.call(this, filename);
        }
        return false;
      },
    });

    window.onbeforeunload = function () {
      if (editor.getValue() != "") {
        if (overridden != true) {
          return "你的文章還沒儲存, 確定要離開嗎?";
        }
      }
    };
  });
</script>

<div style={style}>
  <textarea name="content" bind:this={textContent} placeholder={placeholder}>{initialText}</textarea>

  <Popover
    overlayColor="rgba(0,0,0,0.1)"
    on:open={() => {
      // alert("X");
    }}
    arrowColor="#fff">
    <span slot="target" style="display:inline">
      <i class="fas fa-smile" />
    </span>
    <div slot="content">
      <div class="popover_content">
        <EmojiSelector />
      </div>
    </div>
  </Popover>

  <label for="file-input">
    <i class="fas fa-file-image" />
  </label>

  <input type="file" id="file-input" style="display:none" bind:files />
  {#if files && files[0]}
    <p>
      {files[0].name}
    </p>
  {/if}

  <span style="opacity:0.6">按 Ctrl+Enter 送出</span>
</div>

<style>
  textarea {
    width: 100%;
  }
  :global(.popover) {
    display: inline;
  }
</style>
