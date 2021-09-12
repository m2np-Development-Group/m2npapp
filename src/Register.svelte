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

<section class="hero is-primary is-fullheight">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
          <div class="box">
            <form autocomplete="off">
              {#if beforeReg}
                <Field
                  label="@Username (alphabet/0-9/_)"
                  message={invalidUsernameMessage}>
                  <Input
                    type="username"
                    placeholder="Username"
                    bind:value={username}
                    on:keypress={onKp}
                    autocomplete="off" />
                </Field>

                <Field
                  label="Email (其他人不會看到)"
                  message={invalidEmailMessage}>
                  <Input
                    type="email"
                    placeholder="E-Mail"
                    bind:value={email}
                    on:keypress={onKp}
                    autocomplete="off"
                    icon="envelope" />
                </Field>

                <Field label="Password" message={invalidPasswordMessage}>
                  <Input
                    type="password"
                    placeholder="Password"
                    bind:value={password}
                    on:keypress={onKp}
                    autocomplete="new-password"
                    icon="key"
                    passwordReveal={true} />
                </Field>
                <Button type="is-primary" on:click={register}>Register</Button>
              {:else}
                註冊成功，請檢查郵箱。
              {/if}
            </form>
          </div>
          已有賬戶？<a href="/login" use:link>按我登入</a><br />
          <a href="https://m2np.com/reset-pw" target="_blank">重設密碼(暫用)</a>
        </div>
      </div>
    </div>
  </div>
</section>

<div
  style="
position: fixed;
right: 1em;
bottom: .5em;
color: white;
font-size: 2em;
opacity: 0.7;
font-weight: lighter;
text-decoration: overline;
">
  m2np v20210913
</div>
<style>
  a {
    font-weight: bold;
  }
</style>