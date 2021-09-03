<script>
  import { link } from "svelte-navigator";
  import { onMount } from "svelte";
  import API from "./utils/Api";
  let message = "登出中。";
  onMount(() => {
    API.get("/logout").then((res) => {
      if (res.msg == "ok") {
        message = "你已成功登出。";
      } else {
        message = "你經已成功登出。";
      }
      
    }).catch((reason)=>{
      console.log(reason);
      message = "你經已成功登出。";
    }).finally(()=>{
      localStorage.removeItem("M2NP_TOKEN")
    });
  });
</script>
<section class="hero is-info">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Logout M2NP?
      </h1>
      <h2 class="subtitle">
        {message}
      </h2>
    </div>
  </div>
</section>
<div style='padding:1em'>
<a href="/login"><i class="fa fa-sign-in-alt" /> 回去登入</a>
<a href="/register" use:link><i class="fa fa-pencil-alt" /> 回去註冊</a>
</div>