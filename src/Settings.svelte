<script>
  import { onMount } from "svelte";
  import { Select, Field, Input, Button } from "svelma";

  import API from "./utils/Api";
  import { Warning, Success } from "./components/Notification";
import { myInfoStore, userStore } from "./stores";

  let avatar, fileinput;
  export let active;
  $:{
    if (active){
      console.log("load setting")
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
      if(e.target.result.length>3000*1000){
        alert("file is too large")
        return;
      }
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
    isLoading=true
    API.post("/update_personal_info", {
      description: description,
      color: color,
      display_name: displayName,
      avatar: avatar
    }).then((res) => {
      if(res.msg=="ok"){
        const data=res.update;
        const id = $myInfoStore.user.id;
        // console.log($myInfoStore.user.id)
        
        $userStore.displayname[id] = displayName;
        $userStore.color[id] = color;

        $myInfoStore.user.color=color;
        $myInfoStore.user.displayname=displayName;
        $myInfoStore.user.description=description;

        if('avatar' in data){
          $userStore.avatar[id] = data.avatar;
          $myInfoStore.user.avatar=data.avatar;
          avatar=data.avatar
          
        console.log(avatar);
        }
        
        Success("成功");
      }else{
        Warning(JSON.stringify(res));
      }
      isLoading=false;
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
    
    <div class='thumb' style="background-image:url('{avatar}')"
    on:click={() => {
      fileinput.click();
    }}
    >
      {#if avatar == ""}
      未有頭像
    
      
    {/if}

    <i class="fa fa-pencil-alt" style="position: absolute;
    right: 0.5em;
    bottom: 0.5em;"></i>

    </div>
    <input
      style="display:none"
      type="file"
      accept=".jpg, .jpeg, .png"
      on:change={(e) => onFileSelected(e)}
      bind:this={fileinput} />

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
        iconPack="fas"
        >
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
.thumb {
    display: inline-block;
    width: 250px;
    height: 250px;
    background-position: center center;
    background-size: cover;
    cursor:pointer;border-radius: 2px;border:1px solid #CCC;display:inline-block;position:relative
}
</style>
