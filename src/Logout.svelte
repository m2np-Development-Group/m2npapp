<script>
  import { link } from "svelte-navigator";
  import { onMount } from "svelte";
  import API from "./api/Api";
  let message = "登出中。";
  onMount(() => {
    API.get("/logout").then((res) => {
      if (res.msg == "ok") {
        message = "你已成功登出。";
      } else {
        message = "logout not success";
      }
      localStorage.removeItem("M2NP_TOKEN");
    });
  });
</script>

<h1>Logout</h1>
{message}
<hr />
<a href="/login">Login</a>
<a href="/register" use:link>Register</a>
