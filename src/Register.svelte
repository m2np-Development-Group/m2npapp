<script>
  import API from "./api/Api";
  import { navigate, Link } from "svelte-navigator";
  import { warning } from "./components/Notification";
  let email = "";
  let password = "";
  let username = "";
  let beforeReg = true;


  const onKp = (e)=>{if (e.key === "Enter") register();}

  const register = () => {
    if (email == "" || password == "" || username == "") {
      warning("請填入所有的欄位。");
    } else {
      API.post("/register", {
        email: email,
        username: username,
        password: password,
      }).then((res) => {
        if (res.msg != "ok") {
          warning("請填入所有的欄位。");
        } else {
          beforeReg = false;
        }
      });
    }
  };
</script>

<h1>Register M2NP</h1>

{#if beforeReg}
  <input type="username" placeholder="Username" bind:value={username}  on:keypress={onKp} />
  <input type="email" placeholder="E-Mail" bind:value={email} on:keypress={onKp} />
  <input type="password" placeholder="Password" bind:value={password} on:keypress={onKp} />
  <button on:click={register}>Register</button>
{:else}
  Success.
  <Link to="/login">Click here to Login</Link>
{/if}
<hr />
<Link to="/login">Already Have An Account? Go to Login.</Link>
