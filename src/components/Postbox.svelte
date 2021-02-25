<script>
  import { onMount } from "svelte";
  import API from "../api/Api";
  import inlineAttachment from "./inlineAttachment";
  var textContent;
  var overridden = false; //override close window
  var simplemde;

  const onSubmit = function () {
    if (simplemde.value() == "") {
      alert("請輸入內文");
      return false;
    }
    alert("submit");
  };

  onMount(function () {
    simplemde = new SimpleMDE({
      element: textContent,
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      },
      placeholder: "你有在想甚麼嗎...",
    });
    inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, {
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
      if (simplemde.value() != "") {
        if (overridden != true) {
          return "你的文章還沒儲存, 確定要離開嗎?";
        }
      }
    };
  });
</script>

<div>
  <textarea name="content" bind:this={textContent} />

  <button
    on:click={() => {
      //   jQuery("#postbox_textarea").val("ASDF");
    }}>Submit</button
  >
</div>

<style>
  textarea {
    width: 100%;
  }
</style>
