<script>
  import API from "./utils/Api";
  import { navigate, Link, link } from "svelte-navigator";
  import { Warning } from "./components/Notification";
  import { Field, Input, Button } from "svelma";
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

<section class="hero is-info">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">M2NP</h1>
      <h2 class="subtitle">mm~ no problem</h2>
    </div>
  </div>
</section>
<div style="padding:1em">
  {#if beforeReg}
    <Field label="@Username (alphabet/0-9/_)" message={invalidUsernameMessage}>
      <Input
        type="username"
        placeholder="Username"
        bind:value={username}
        on:keypress={onKp} />
    </Field>

    <Field label="Email (其他人不會看到)" message={invalidEmailMessage}>
      <Input
        type="email"
        placeholder="E-Mail"
        bind:value={email}
        on:keypress={onKp} />
    </Field>

    <Field label="Password" message={invalidPasswordMessage}>
      <Input
        type="password"
        placeholder="Password"
        bind:value={password}
        on:keypress={onKp} />
    </Field>
    <Button type="is-primary" on:click={register}>Register</Button>
  {:else}
    註冊成功，請檢查郵箱。
  {/if}
  <hr />
  <Link to="/login">已有賬戶？按我登入。</Link>
</div>
