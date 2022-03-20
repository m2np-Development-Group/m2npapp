<script>
  import API from "./utils/Api";
  import HeroFullHeight from "./components/HeroFullHeight.svelte";
  import { link } from "svelte-navigator";
  import { Warning } from "./lib/Notification";
  import Input from "./lib/Input.svelte";
  import Button from "./lib/Button.svelte";
  import Field from "./lib/Field.svelte";

  let email = "";
  let password = "";
  let username = "";
  let beforeReg = true;
  let invalidPasswordMessage = "";
  let invalidEmailMessage = "";
  let invalidUsernameMessage = "";

  const onKp = (e) => {
    if (e.key === "Enter") register();
  };

  const register = () => {
    if (email == "" || password == "" || username == "") {
      Warning("請填入所有的欄位。");
    } else {
      API.post("/register", {
        email: email,
        username: username,
        password: password,
      }).then((res) => {
        if (res.msg != "ok") {
          Warning("請填入所有的欄位。");
        } else {
          beforeReg = false;
        }
      });
    }
  };
</script>

<HeroFullHeight>
  <div slot="main">
    <form autocomplete="off">
      {#if beforeReg}
        <Field
          label="@Username (alphabet/0-9/_)"
          message={invalidUsernameMessage}
        >
          <Input
            type="username"
            placeholder="Username"
            bind:value={username}
            on:keypress={onKp}
            autocomplete="off"
          />
        </Field>

        <Field label="Email (其他人不會看到)" message={invalidEmailMessage}>
          <Input
            type="email"
            placeholder="E-Mail"
            bind:value={email}
            on:keypress={onKp}
            autocomplete="off"
            icon="envelope"
          />
        </Field>

        <Field label="Password" message={invalidPasswordMessage}>
          <Input
            type="password"
            placeholder="Password"
            bind:value={password}
            on:keypress={onKp}
            autocomplete="new-password"
            icon="key"
            passwordReveal={true}
          />
        </Field>
        <Button type="is-primary" on:click={register}>Register</Button>
      {:else}
        註冊成功，請檢查郵箱。
      {/if}
    </form>
  </div>
  <div slot="bottom">
    已有賬戶？<a href="/login" use:link>按我登入</a><br />
    <a href="/reset-password" use:link>重設密碼</a>
  </div>
</HeroFullHeight>

<style>
  a:hover {
    text-decoration: underline;
  }
  a {
    font-weight: bold;
  }
</style>
