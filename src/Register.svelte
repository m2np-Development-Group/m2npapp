<script>
  import API from "./api/Api";
  import { navigate, Link } from "svelte-routing";
  import { getNotificationsContext } from "svelte-notifications";

  const { addNotification } = getNotificationsContext();

  let email = "";
  let password = "";
  let beforeReg = true;

  const register = () => {
    if (email == "" || password == "") {
      alert("fill in both");
    } else {
      API.post("/register", {
        email: email,
        password: password,
      }).then((res) => {
        if (res.msg == "duplicated") {
          addNotification({
            text: res.msg,
            position: "top-right",
            type: "warning",
            removeAfter: 3000,
          });
        }
        if (res.msg == "ok") {
          beforeReg = false;
        }
      });
    }
  };
</script>

<h1>Register M2NP</h1>

{#if beforeReg}
  <input type="username" placeholder="Username" bind:value={email} />
  <input type="email" placeholder="E-Mail" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />
  <button on:click={register}>Register</button>
{:else}
  Success.
  <Link to="/login">Click here to Login</Link>
{/if}
<hr />
<Link to="/login">Already Have An Account? Go to Login.</Link>
