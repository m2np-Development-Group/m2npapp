<script>
  import Field from "../../lib/Field.svelte";
  import Input from "../../lib/Input.svelte";
  import Button from "../../lib/Button.svelte";
  let oldPassword;
  let newPassword;
</script>


  <Field label="舊密碼">
    <Input
      type="password"
      bind:value={oldPassword}
      placeholder="舊密碼"
      passwordReveal={true}
      autocomplete="off"
    />
  </Field>
  <Field label="新密碼">
    <Input
      type="password"
      bind:value={newPassword}
      placeholder="新密碼"
      passwordReveal={true}
      autocomplete="off"
    />
  </Field>
  <Field label="　">
    <Button type="is-primary">更改</Button>
  </Field>
