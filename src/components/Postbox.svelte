<script>
  import { onMount } from "svelte";
  import API from "../api/Api";
  import inlineAttachment from "./inlineAttachment";
  import { warning } from "../components/Notification";

  export let finishHandler = (id) => {};
  export let style = "";
  export let placeholder = "";
  export let onSubmit = (txt)=>{};
  // export let afterSubmit = (res)=>{};

  const submitPost = () => {
    onSubmit(editor.getValue()).then((res)=>{        
      editor.setValue("");
      editor.clearHistory();
      if (res.msg == "ok") {
        editor.setValue("");
        editor.clearHistory();
        finishHandler(res.id);
      } else {
        warning(res.msg);
      }
    });
  };
  var textContent;
  var overridden = false; //override close window
  var editor;

  onMount(function () {
    editor = CodeMirror.fromTextArea(textContent, {
      mode: {
        name: "gfm",
        tokenTypeOverrides: {
          emoji: "emoji",
        },
      },
      lineWrapping: true,
      theme: "monokai",
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
        var result = JSON.parse(xhr.responseText),
          filename = result[this.settings.jsonFieldName];

        if (result && filename) {
          var newValue;
          if (typeof this.settings.urlText === "function") {
            newValue = this.settings.urlText.call(this, filename, result);
          } else {
            newValue = this.settings.urlText.replace(
              this.filenameTag,
              filename
            );
          }
          var text = this.editor.getValue().replace(this.lastValue, newValue);
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
  <textarea name="content" bind:this={textContent} placeholder={placeholder} />
  <span on:click={()=>alert("x")}><i class="fa fa-smile-o" /></span>
  <span on:click={()=>alert("x")}><i class="fa fa-file-image-o" /></span>
  <span style="opacity:0.6">按 Ctrl+Enter 送出</span>
</div>

<style>
  textarea {
    width: 100%;
  }
</style>
