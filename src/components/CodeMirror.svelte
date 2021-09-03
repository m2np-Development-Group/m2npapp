<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import CodeMirror from "codemirror";
  import "codemirror/addon/display/placeholder";
  import "codemirror/addon/edit/continuelist";
  import "codemirror/mode/markdown/markdown";
  import "codemirror/addon/mode/overlay";
  import "codemirror/mode/gfm/gfm";
  import inlineAttachment from "./inlineAttachment";

  export let onSubmit = ()=>{};
  
  const dispatch = createEventDispatcher();

  let classes = "";
    export let initialText = "";
  export let editor = null;
  let options = {
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
            onSubmit();
        },
        "Cmd-Enter": (cm) => {
            onSubmit();
        },
      },
    };
  export { classes as class };

  let element;

  onMount(() => {
    createEditor();
  });

  $: if (element) {
    createEditor(options);
  }

  function createEditor(options) {
    if (editor) element.innerHTML = "";

    editor = CodeMirror(element, options);
    editor.setValue(initialText)

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


    editor.on("cursorActivity", (event) => {
      dispatch("activity", event);
    });
    editor.on("change", (event) => {
      dispatch("change", event);
    });
    // More events could be set up here
  }
</script>

<div bind:this={element} class={classes} />

<style unscoped>
  :global(.CodeMirror) {
    border: 1px solid #ccc;
    height: auto;
    max-height: 150px;
    border-radius: 0.3em;
  }

  :global(.CodeMirror-scroll) {
    height: auto;
    max-height: 150px;
  }

  :global(.CodeMirror pre.CodeMirror-placeholder) {
    color: #999;
  }
</style>
