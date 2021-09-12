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
  let invalidEmailMessage="";
  let invalidPasswordMessage="";
</script>


<section class="hero is-primary is-fullheight">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
          <div class="box">
            <div class="field">
              <label for="" class="label">Email</label>
              <div class="control has-icons-left">
                <input type="email"
                on:keypress={onKp}
                bind:this={emailInput}
                bind:value={email}
                placeholder="e.g. abbychau@gmail.com" 
                class="input"
                
                required>
                <span class="icon is-small is-left">
                  <i class="fa fa-envelope"></i>
                </span>
              </div>
              {#if invalidEmailMessage!=""}
              <p class="help is-danger">{invalidEmailMessage}</p>
              {/if}
            </div>
            <div class="field">
              <label for="" class="label">Password</label>
              <div class="control has-icons-left">
                <input 
                on:keypress={onKp}
                bind:value={password} passwordReveal={true}
                type="password" placeholder="*******" class="input" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </div>
              {#if invalidPasswordMessage!=""}
              <p class="help is-danger">{invalidPasswordMessage}</p>
              {/if}
            </div>
            <div class="field">
              <label for="" class="checkbox">
                <input type="checkbox">
               Remember me
              </label>
            </div>
            <div class="field">
              <button class="button is-success" on:click={login}>
                Login
              </button>
            </div>
          </div>
          沒有賬號？<a href="/register" use:link>按我註冊</a><br />
          <a href="https://m2np.com/reset-pw" target="_blank">重設密碼(暫用)</a>

        </div>
      </div>
    </div>
  </div>
</section>


<div style='
position: fixed;
right: 1em;
bottom: .5em;
color: white;
font-size: 2em;
opacity: 0.7;
font-weight: lighter;
text-decoration: overline;
'>
  m2np v20210913
</div>

<style>
  a {
    font-weight: bold;
  }
</style>