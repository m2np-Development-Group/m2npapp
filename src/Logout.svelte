<script>
  import { link } from "svelte-routing";
  import { onMount } from "svelte";
  import API from "./api/Api";
  let message;
  onMount(() => {
    API.get("/logout").then((res) => {
      if(res.msg == "ok"){
        message = "logout success";
      }else{
        message = "logout not success";
      }
      
    });
  });
</script>
<h1>Logout</h1>
{message}
<hr />
<a href="/login" use:link>Login</a>
<a href="/register" use:link>Register</a>
