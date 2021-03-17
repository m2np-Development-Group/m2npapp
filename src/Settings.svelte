<script>
  import { onMount } from "svelte";
  import { Select, Field, Input, Button } from "@abbychau/svelma";

  import API from "./api/Api";
  import { Warning } from "./components/Notification";

  let description = "";
  let color = 3;
  let displayName = "";
  let isLoading = true;
  onMount(() => {
    API.get("/get_profile", {}).then((res) => {
      description = res.user.description;
      // color = res.user.color;
      displayName = res.user.display_name;
      isLoading = false;

      // console.log(color)
    });
  });

  const submitChanges = () => {
    console.log(displayName)
    console.log(description)
    API.post("/update_personal_info", {
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
<h1 class="title">
  Settings
</h1>
{#if !isLoading}
  <div>
    <Field grouped>
    <Field label="舊密碼">
      <Input
        type="password"
        bind:value={oldPassword}
        placeholder="舊密碼"
        passwordReveal={true} />
    </Field>
    <Field label="新密碼">
      <Input
        type="password"
        bind:value={newPassword}
        placeholder="新密碼"
        passwordReveal={true} />
    </Field>
  </Field>
    <Button type="is-primary">更改</Button>
  
    <hr />

    <Input bind:value={displayName} type="text" placeholder="暱稱" /><br />

    <Input type="textarea" bind:value={description} placeholder="關於您自己" /><br />
    <Field>
      <Select placeholder="您的暱稱顏色" bind:selected={color} icon="paint-roller" iconPack="fas">
        <option value="1" selected={1 == color}>紅</option>
        <option value="2" selected={2 == color}>黃</option>
        <option value="3" selected={3 == color}>藍</option>
        <option value="4" selected={4 == color}>綠</option>
      </Select>
    </Field>

    <Button on:click={submitChanges} type="is-primary">更改</Button>
  </div>
{/if}
