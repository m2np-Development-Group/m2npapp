<script>
	import HeroFullHeight from './components/HeroFullHeight.svelte';
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

<HeroFullHeight>
  <div slot="main">
  {message}
  <div style='padding:1em'>
    <a href="/login"><i class="fa fa-sign-in-alt" /> 登入</a><br />
    <a href="/register" use:link><i class="fa fa-pencil-alt" /> 註冊</a>
  </div>
  </div>
</HeroFullHeight>
<style>
  a:hover{
    text-decoration: underline;
  }
  a {
    font-weight: bold;
  }
</style>