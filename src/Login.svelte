<script>
  import API from "./utils/Api";
  import { navigate, link } from "svelte-navigator";
  import { Warning } from "./components/Notification";
  import { myInfoStore, filluserStore } from "./stores";
  import { onMount } from "svelte";
  import { Field, Input,Button } from "svelma"
  //import Particles from "svelte-particles";
  //import Config from "./ParticleConfig"

  export let location;

let onParticlesLoaded = (event) => {
    const particlesContainer = event.detail.particles;

    // you can use particlesContainer to call all the Container class
    // (from the core library) methods like play, pause, refresh, start, stop
  };
  let onParticlesInit = (main) => {
    // you can use main to customize the tsParticles instance adding presets or custom shapes
  };
  let email = "";
  let password = "";
  onMount(() => {
    if ($myInfoStore) {
      navigate("/home");
    }
  });
  const login = () => {
    if (email.trim() == "") {
      invalidEmailMessage="Cannot be empty"
    } else if (password == "") {
      invalidPasswordMessage="Cannot be empty"
    } else {
      API.post("/login", { email: email, password: password }).then((res) => {
        if (res.msg == "ok") {
          $myInfoStore = res.user;
          filluserStore(res.user.followings);
          filluserStore(res.user.followers);
          


          console.log($myInfoStore);
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
  let invalidEmailMessage;
  let invalidPasswordMessage;
</script>



<!-- <Particles
  id="tsparticles"
  options="{Config}"
  on:particlesLoaded="{onParticlesLoaded}"
  on:particlesInit="{onParticlesInit}"
/> -->


<div style='padding:1em;max-width:400px;margin:0 auto'>
  <h1 style='font-size: 4em;
  text-align: center;
  text-decoration: line-through;
  color: black;
  font-weight: 400;'>M2NP</h1>
<Field label="E-Mail" type:is-danger={false} message={invalidEmailMessage}>
  <Input
  on:keypress={onKp}
  type="email"
  placeholder="E-Mail"
  required="required"
  bind:this={emailInput}
  bind:value={email}
  icon="envelope"
  />
  
</Field>

<Field label="密碼" message={invalidPasswordMessage}> 
  <Input on:keypress={onKp} placeholder="Password" type="password" bind:value={password} passwordReveal={true} icon="key" />
</Field>
<Button type="is-primary" on:click={login}><i class="fa fa-sign-in-alt" /> 登入</Button>


</div>

<div style='position:fixed;left:1em;bottom:1em; padding:.3em;border-radius:.3em'>
  <a href="/register" use:link>登記</a><br />
  <a href="https://m2np.com/reset-pw" target="_blank">重設密碼(暫用)</a>
  </div>

<style>
.title,.subtitle{
  color:black;
}
</style>