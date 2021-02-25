<script>
  import { link } from "svelte-routing";
  import { onMount } from "svelte";
  import API from "./api/Api";

  onMount(() => {
    API.get("/logout").then((res) => {
      alert("logout mounted");
    });
  });
</script>

You have been logged out.

<a href="/login" use:link>Login</a>
<a href="/register" use:link>Register</a>
