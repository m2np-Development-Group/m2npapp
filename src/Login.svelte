<script>
  import HeroFullHeight from "./components/HeroFullHeight.svelte";
  import API from "./utils/Api";
  import { navigate, link } from "svelte-navigator";
  import { Warning } from "./lib/Notification";
  import { myInfoStore, filluserStore } from "./stores";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  onMount(() => {
    if ($myInfoStore) {
      navigate("/home");
    }
  });
  const login = () => {
    if (email.trim() == "") {
      invalidEmailMessage = "Cannot be empty";
    } else if (password == "") {
      invalidPasswordMessage = "Cannot be empty";
    } else {
      API.post("/login", { email: email, password: password }).then((res) => {
        if (res.msg == "ok") {
          $myInfoStore = res.user;
          filluserStore(res.user.followings);
          filluserStore(res.user.followers);

          localStorage.setItem("M2NP_TOKEN", res.token);
          // const from = ($location.state && $location.state.from) || "/home";
          navigate("/home");
        } else {
          Warning("賬戶或密碼有誤。");
        }
      });
    }
  };
  const onKp = (e) => {
    // console.log(e.srcElement.checkValidity())
    if (e.key === "Enter") login();
  };
  let emailInput;
  let invalidEmailMessage = "";
  let invalidPasswordMessage = "";
</script>

<HeroFullHeight>
  <div slot="main">
    <div class="field">
      <label for="" class="label">Email</label>
      <div class="control has-icons-left">
        <input
          type="email"
          on:keypress={onKp}
          bind:this={emailInput}
          bind:value={email}
          placeholder="e.g. abbychau@gmail.com"
          class="input"
          required
        />
        <span class="icon is-small is-left">
          <i class="fa fa-envelope" />
        </span>
      </div>
      {#if invalidEmailMessage != ""}
        <p class="help is-danger">{invalidEmailMessage}</p>
      {/if}
    </div>
    <div class="field">
      <label for="" class="label">Password</label>
      <div class="control has-icons-left">
        <input
          on:keypress={onKp}
          bind:value={password}
          passwordReveal={true}
          type="password"
          placeholder="*******"
          class="input"
          required
        />
        <span class="icon is-small is-left">
          <i class="fa fa-lock" />
        </span>
      </div>
      {#if invalidPasswordMessage != ""}
        <p class="help is-danger">{invalidPasswordMessage}</p>
      {/if}
    </div>
    <div class="field">
      <button class="button is-success" on:click={login}> Login </button>
    </div>
  </div>
  <div slot="bottom">
    沒有賬號？<a href="/register" use:link>按我註冊</a><br />
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
