<script lang="ts">
  import HeroFullHeight from "./components/HeroFullHeight.svelte";
  import API from "./utils/Api";
  import { navigate, link } from "svelte-navigator";
  import { Success, Warning } from "./lib/Notification";
  import { myInfoStore } from "./stores";
  import { onMount } from "svelte";
  import Field from "./lib/Field.svelte";
  import Input from "./lib/Input.svelte";
  import Button from "./lib/Button.svelte";

  let email = "";
  let beforeReset = true;
  let invalidEmailMessage = "";
  onMount(() => {
    if ($myInfoStore) {
      navigate("/home");
    }
  });
  const reset = () => {
    if (email.trim() == "") {
      Warning("請輸入電郵信箱。");
    } else {
      console.log("reset");
      API.post("/reset-password", { email: email })
        .then((res) => {
          if (res.status == 200) {
            Success("請去檢查一下郵箱以進行下一步。");
            //redirect to login page
            navigate("/login");
          } else {
            Warning("找不到該使用者。");
          }
        })
        .catch((_e) => {
          Warning("此服務目前暫不提供。");
        });
    }
  };
  const onKp = (e : any) => {
    if (e.key === "Enter") reset();
  };
</script>

<HeroFullHeight>
  <div slot="main">
    <form autocomplete="off">
      {#if beforeReset}
        <Field label="Email" message={invalidEmailMessage}>
          <Input
            required
            type="email"
            placeholder="E-Mail"
            bind:value={email}
            on:keypress={onKp}
            autocomplete="off"
            icon="envelope"
          />
        </Field>

        <Button type="is-primary" on:click={reset}>Send OTP</Button>
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
