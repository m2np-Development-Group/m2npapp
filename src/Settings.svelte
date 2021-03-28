<script>
  import { onMount } from "svelte";
  import { Select, Field, Input, Button } from "svelma2";

  import API from "./api/Api";
  import { Warning, Success } from "./components/Notification";
import { myInfoStore, userStore } from "./stores";

  let avatar, fileinput;
  export let active;
  $:{
    if (active){
      isLoading = true;
      API.get("/get_profile", {}).then((res) => {
        const v=res.data.user
        description = v.description;
        color = v.color;
        displayName = v.display_name;
        isLoading = false;
        avatar = v.avatar
      });
    }
  }
  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;
    };
  };

  let description = "";
  let color = 3;
  let displayName = "";
  let isLoading = true;
  onMount(() => {

  });

  const submitChanges = () => {
    console.log(displayName);
    console.log(description);
    API.post("/update_personal_info", {
      description: description,
      color: color,
      display_name: displayName,
    }).then((res) => {
      if(res.msg=="ok"){
        const id = $myInfoStore.user.id;
        console.log($myInfoStore.user.id)
        // $userStore.avatar[id] = v.avatar;
        $userStore.displayname[id] = displayName;
        $userStore.color[id] = color;
        Success("成功");
      }else{
        Warning(JSON.stringify(res));
      }
    });
  };
  let oldPassword;
  let newPassword;
</script>

{#if !isLoading}
  <div>
    <Field grouped>
      <Field label="">
        <Input
          type="password"
          bind:value={oldPassword}
          placeholder="舊密碼"
          passwordReveal={true} />
      </Field>
      <Field label="">
        <Input
          type="password"
          bind:value={newPassword}
          placeholder="新密碼"
          passwordReveal={true} />
      </Field>
      <Field label="">
        <Button type="is-primary">更改</Button>
      </Field>
    </Field>
    
    <div class="columns">
      <div class="column">
        {#if avatar}
        <img class="avatar" src={avatar} alt="d" />
      {:else}
        未有頭像
      {/if}
      </div>
      <div class="column">
        <img
        class="upload"
        src="https://static.thenounproject.com/png/625182-200.png"
        alt=""
        on:click={() => {
          fileinput.click();
        }} />
      <div
        on:click={() => {
          fileinput.click();
        }}>
      </div>
      <input
        style="display:none"
        type="file"
        accept=".jpg, .jpeg, .png"
        on:change={(e) => onFileSelected(e)}
        bind:this={fileinput} />
  
      </div>
    </div>


    <hr />

    <Input bind:value={displayName} type="text" placeholder="暱稱" /><br />

    <Input
      type="textarea"
      bind:value={description}
      placeholder="關於您自己" /><br />
    <Field>
      <Select
        placeholder="您的暱稱顏色"
        bind:selected={color}
        icon="paint-roller"
        iconPack="fas">
        <option value="1" selected={1 == color}>紅</option>
        <option value="2" selected={2 == color}>黃</option>
        <option value="3" selected={3 == color}>藍</option>
        <option value="4" selected={4 == color}>綠</option>
      </Select>
    </Field>

    <Button on:click={submitChanges} type="is-primary">更改</Button>
  </div>
{:else}
<div class="is-loading" style='width:100%'>Loading</div>
{/if}

<style>
  .upload {
    display: flex;
    height: 50px;
    width: 50px;
    cursor: pointer;
  }
  .avatar {
    display: flex;
    height: 200px;
    width: 200px;
  }
</style>
