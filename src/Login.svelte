<script>
  import API from "./api/Api";
  import { navigate, useLocation, Link } from "svelte-navigator";
  import { Warning } from "./components/Notification";
  import { userInfoStore } from "./stores";
  import { onMount } from "svelte";
  import { Field, Input,Button } from 'svelma'
  import { slide } from 'svelte/transition'

  let email = "";
  let password = "";
  // const navigate = useNavigate();
  // const location = useLocation();
  onMount(() => {
    if ($userInfoStore) {
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
          $userInfoStore = res.user;
          console.log($userInfoStore);
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
<section class="hero is-info">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        登入 M2NP?
      </h1>
      <h2 class="subtitle">
        mm~ no problem
      </h2>
    </div>
  </div>
</section>
<div style='padding:1em'>
<Field label="Email" type:is-danger={false} message={invalidEmailMessage}>
  <Input
  on:keypress={onKp}
  type="email"
  placeholder="E-Mail"
  required="required"
  bind:this={emailInput}
  bind:value={email} />
  
</Field>

<Field label="Password" message={invalidPasswordMessage}> 
  <Input on:keypress={onKp} placeholder="Password" type="password" bind:value={password} passwordReveal={true} />
</Field>
<Button type="is-primary" on:click={login}>登入</Button>

<hr />
<Link to="/register">未有賬戶？按此登記。</Link><br />
<Link to="/reset-password">忘記密碼？按此重設。</Link>
</div>