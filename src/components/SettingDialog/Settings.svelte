<script>
	import ChangePassword from './ChangePassword.svelte';
  import { onMount } from "svelte";
  import Input from "../../lib/Input.svelte";
  import Field from "../../lib/Field.svelte";
  import { colorMap } from "../../utils/util";
  import API from "../../utils/Api";
  import { Warning, Success } from "../../lib/Notification";
  import { myInfoStore, userStore } from "../../stores";
  import PlurkImporter from './PlurkImporter.svelte';

  let avatar, fileinput, wallpaper, files;
  export let active = false;
  $: {
    if (active) {
      console.log("load setting");
      isLoading = true;
      API.get("/get_profile", {}).then((res) => {
        const v = res.data.user;
        description = v.description;
        color = "" + v.color;
        displayName = v.display_name;
        isLoading = false;
        avatar = v.avatar;
        wallpaper = v.wallpaper;
      });
    }
  }
  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      if (e.target.result.length > 3000 * 1000) {
        alert("file is too large");
        return;
      }
      avatar = e.target.result;
    };
  };

  let description = "";
  let color = "3";
  let displayName = "";
  let isLoading = true;
  let loadingPercentage = null;
  onMount(() => {});

  const submitChanges = () => {
    isLoading = true;
    let data = new FormData();
    data.append("description", description);
    data.append("color", color);
    data.append("display_name", displayName);
    if (files) {
      data.append("avatar", files[0]);
    }
    data.append("wallpaper", wallpaper);

    loadingPercentage = null;
    API.formPostFile("/update_personal_info", data, (e) => {
      loadingPercentage = Math.round((e.loaded * 100.0) / e.total);
    }).then((res) => {
      if (res.status == 200) {
        const data = res.update;
        const id = $myInfoStore.user.id;
        // console.log($myInfoStore.user.id)

        $userStore.displayname[id] = displayName;
        $userStore.color[id] = color;

        $myInfoStore.user.color = color;
        $myInfoStore.user.displayname = displayName;
        $myInfoStore.user.description = description;
        $myInfoStore.user.wallpaper = wallpaper;

        if ("avatar" in data) {
          $userStore.avatar[id] = data.avatar;
          $myInfoStore.user.avatar = data.avatar;
          avatar = data.avatar;

          console.log(avatar);
        }

        Success("成功");
      } else {
        Warning(JSON.stringify(res));
      }
      isLoading = false;
    });
  };

  let isShowUpdatePassword = false;
  let isShowHome = true;
  let isPlurkInput = false;
function hideAll(){
  isShowHome = false;
  isShowUpdatePassword = false;
  isPlurkInput = false;
}
</script>
<div class="modal" class:is-active={active}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">設置</p>
      <button
        class="delete"
        aria-label="close"
        on:click={() => (active = false)}
      />
    </header>
    <section class="modal-card-body" style="height:650px">
      <div class="columns">
        <div class="column is-one-quarter">
          <aside class="menu">
            <p class="menu-label">
              通用
            </p>
            <ul class="menu-list">
              <!-- svelte-ignore a11y-missing-attribute -->
              <li><a class:is-active={isShowHome} on:click={() => {
                hideAll();
                isShowHome = true;
              }}>首頁</a></li>
              <!-- svelte-ignore a11y-missing-attribute -->
              <li><a class:is-active={isShowUpdatePassword} on:click={() => {
                hideAll();
                isShowUpdatePassword = true;
              }}>更改密碼</a></li>
            </ul>
            <p class="menu-label">
              其他
            </p>
            <ul class="menu-list">
              <!-- svelte-ignore a11y-missing-attribute -->
              <li><a class:is-active={isPlurkInput} href="http://localhost/settings" target="_blank">匯入Plurk 備份</a></li>
            </ul>
          </aside>
        </div>
        <div class="column">
          {#if isShowUpdatePassword}
            <ChangePassword bind:active={isShowUpdatePassword} />
          {/if}
          {#if isShowHome}
            {#if !isLoading}
              <div style="position:relative">
                <Field label="頭像">
                  <div
                    class="thumb"
                    style="background-image:url('{avatar}')"
                    on:click={() => {
                      fileinput.click();
                    }}
                  >
                    {#if avatar == ""}未有頭像 {/if}
      
                    <i
                      class="fa fa-pencil-alt"
                      style="position: absolute;right: 0.5em;bottom: 0.5em;text-shadow:2px 2px rgb(255 255 255 / 75%);"
                    />
                  </div>
                </Field>
                <input
                  style="display:none"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  on:change={(e) => onFileSelected(e)}
                  bind:this={fileinput}
                  bind:files
                />
      
                <Field grouped>
                  <Field label="名字顏色">
                    <div class="control has-icons-left">
                      <div class="select">
                        <select
                          bind:value={color}
                          style="background-color:#{colorMap[color]}"
                        >
                          {#each colorMap as v, i}
                            <option
                              value={i}
                              style="background-color:#{v};font-size:1.5em"
                            />
                          {/each}
                        </select>
                      </div>
                      <div class="icon is-small is-left">
                        <i class="fas fa-paint-roller" />
                      </div>
                    </div>
                  </Field>
                  <Field label="暱稱">
                    <Input bind:value={displayName} type="text" placeholder="暱稱" />
                  </Field>
                  <Field label="背景URL">
                    <Input bind:value={wallpaper} type="text" placeholder="背景URL" />
                  </Field>
                </Field>
                <Field label="自我介紹">
                  <Input
                    type="textarea"
                    bind:value={description}
                    placeholder="關於您自己"
                  />
                </Field>
              </div>
            {:else}
              <div class="is-loading" style="width:100%">
                <i class="fas fa-spinner fa-pulse" /> Processing... {loadingPercentage !=
                null
                  ? loadingPercentage + "%"
                  : ""}<br />
              </div>
            {/if}
            {#if !isLoading}
              <div style='padding-top:1em'>
                <button on:click={submitChanges} class="button is-success">提交更新</button>
              </div>
            {/if}
          {/if}
          {#if isPlurkInput}
            <PlurkImporter />
          {/if}
        </div>
      </div>


    </section>
  </div>
</div>

<style>
  .thumb {
    display: inline-block;
    width: 250px;
    height: 250px;
    background-position: center center;
    background-size: cover;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid #ccc;
    display: inline-block;
    position: relative;
    margin-bottom: 1em;
  }
</style>
