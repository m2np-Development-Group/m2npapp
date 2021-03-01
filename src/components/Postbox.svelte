<script>
  import { onMount } from "svelte";
  import API from "../api/Api";
  import inlineAttachment from "./inlineAttachment";
  import { getNotificationsContext } from "svelte-notifications";

  const { addNotification } = getNotificationsContext();

  export let finishHandler = (id) => {};
  export let style = "";
  const submitPost = () => {
    API.post("/post_post", { content: editor.getValue() }).then((res) => {
      console.log(res);
      if (res.msg == "ok") {
        editor.setValue("");
        editor.clearHistory();
        finishHandler(res.id);
      } else {
        addNotification({
          text: res.msg,
          position: "top-right",
          type: "warning",
          removeAfter: 3000,
        });
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
  <textarea name="content" bind:this={textContent} />
</div>

<style>
  textarea {
    width: 100%;
  }
</style>
