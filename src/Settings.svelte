<script>
  import { onMount } from "svelte";
  import { Select, Field, Input, Button } from "svelma";

  import API from "./api/Api";
  import { Warning } from "./components/Notification";

  let description = "";
  let color = "";
  let displayName = "";
  let isLoading = true;
  onMount(() => {
    API.get("/get_profile", {}).then((res) => {
      description = res.description;
      color = res.color;
      displayName = res.display_name;
      isLoading = false;
    });
  });

  const submitChanges = () => {
    API.post("/update_profile", {
      description: description,
      color: color,
      display_name: displayName,
    }).then((res) => {
      Warning(JSON.stringify(res));
    });
  };
  let oldPassword;
  let newPassword;
</script>

{#if !isLoading}
  <div>
    <h1>Settings</h1>
    <Field label="Password">
      <Input
        type="password"
        bind:value={oldPassword}
        placeholder="舊密碼"
        passwordReveal={true} />
    </Field>
    <Field label="Password">
      <Input
        type="password"
        bind:value={newPassword}
        placeholder="新密碼"
        passwordReveal={true} />
    </Field>
    <Button>更改</Button>

    <hr />

    <input value={displayName} type="text" placeholder="暱稱" /><br />

    <textarea value={description} placeholder="關於您自己" /><br />
    <Field>
      <Select placeholder="您的暱稱顏色" icon="paint-roller" iconPack="fas">
        <option value="1">紅</option>
        <option value="2">黃</option>
        <option value="3">藍</option>
        <option value="4">綠</option>
      </Select>
    </Field>

    <button on:click={submitChanges}>更改</button>
  </div>
{/if}
