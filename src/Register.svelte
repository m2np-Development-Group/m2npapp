<script>
  import API from "./api/Api";
  import { navigate, Link } from "svelte-routing";
  import { getNotificationsContext } from "svelte-notifications";

  const { addNotification } = getNotificationsContext();

  let email = "";
  let password = "";
  let username = "";
  let beforeReg = true;

  const register = () => {
    if (email == "" || password == "" || username == "") {
      alert("fill in both");
    } else {
      API.post("/register", {
        email: email,
        username:username,
        password: password,
      }).then((res) => {
        if (res.msg != "ok") {
          addNotification({
            text: res.msg,
            position: "top-right",
            type: "warning",
            removeAfter: 3000,
          });
        }else{
          beforeReg = false;
        }
      });
    }
  };
</script>

<h1>Register M2NP</h1>

{#if beforeReg}
  <input type="username" placeholder="Username" bind:value={username} />
  <input type="email" placeholder="E-Mail" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />
  <button on:click={register}>Register</button>
{:else}
  Success.
  <Link to="/login">Click here to Login</Link>
{/if}
<hr />
<Link to="/login">Already Have An Account? Go to Login.</Link>
