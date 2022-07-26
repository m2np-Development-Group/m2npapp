<script>
  import { Warning, Success } from "../../lib/Notification";
  import API from "../../utils/Api";

  let fileResult, fileinput, files, isLoading, loadingPercentage;
  let isConvertComments;
  const onFileSelected = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target.result.length > 60 * 1000 * 1000) {
        // 60MB
        alert("file is too large");
        return;
      }
      //file size
      fileResult = file.name + " | " + e.target.result.length / 1000 + "KB";
    };
  };

  const submitBackup = () => {
    let data = new FormData();
    if (files) {
      data.append("backup", files[0]);
    } else {
      Warning("請選擇檔案");
      return;
    }
    //confirm prompt
    if (!confirm("確定要更新備份嗎？(更新後所有舊有的噗浪文章都會被刪除)")) {
      return;
    }

    data.append("is_convert_comments", isConvertComments);

    isLoading = true;

    loadingPercentage = null;
    API.formPostFile("/convert_plurk", data, (e) => {
      loadingPercentage = Math.round((e.loaded * 100.0) / e.total);
    }).then((res) => {
      if (res.status == 200) {
        Success("成功");
      } else {
        Warning(JSON.stringify(res));
      }
      isLoading = false;
    });
  };
</script>

<div>
  {#if isLoading}
    <div class="progress">
      <div
        class="progress-bar"
        role="progressbar"
        style="width: {loadingPercentage}%;"
        aria-valuenow={loadingPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {loadingPercentage}%
      </div>
    </div>
  {:else}
    <div class="file is-boxed">
      <label class="file-label">
        <input
          style="display:none"
          type="file"
          accept=".zip"
          on:change={(e) => onFileSelected(e)}
          bind:this={fileinput}
          bind:files
        />

        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-folder-open" />
          </span>
          <span class="file-label"> Choose a file… </span>
        </span>
      </label>
    </div>
      <!-- checkboxes -->
      <div class="field">
        <label class="label">
          <input
            type="checkbox"
            checked={isConvertComments}
          />
          轉換評論
        </label>
    </div>
    <div>
      {#if fileResult}
        {fileResult}
      {/if}
    </div>
    <button class="button is-success" on:click={submitBackup} style='margin-top:1em'>
      <span class="icon"><i class="fas fa-upload" /></span>
      <span>Submit</span>
    </button>
  {/if}
</div>
