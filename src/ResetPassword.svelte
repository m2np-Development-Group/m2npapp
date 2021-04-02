<script>
    import API from "./utils/Api";
    import { navigate, useLocation, Link } from "svelte-navigator";
    import { Warning } from "./components/Notification";
    import { myInfoStore } from "./stores";
    import { onMount } from "svelte";
    import { Field, Input } from "svelma2"
    import { slide } from 'svelte/transition'
  
    let email = "";
    let password = "";
    // const navigate = useNavigate();
    // const location = useLocation();
    onMount(() => {
      if ($myInfoStore) {
        navigate("/home");
      }
    });
    const reset = () => {
      if (trim(email) == "") {
        invalidEmailMessage="Cannot be empty"
      } else if (password == "") {
        invalidPasswordMessage="Cannot be empty"
      } else {
        API.post("/reset-password", { email: email, password: password }).then((res) => {
          if (res.msg == "ok") {
            Warning("請去檢查一下郵箱以進行下一步。");
          } else {
            Warning("賬戶或密碼有誤。");
          }
        }).catch((e)=>{
            Warning(JSON.stringify(e))
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
          Reset Password?
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
  <button on:click={reset}>重設</button>
  <hr />
  <Link to="/register">未有賬戶？按此登記。</Link><br />
  <Link to="/login">突然記起？按此登入。</Link><br />
  </div>