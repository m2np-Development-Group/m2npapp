<script>
  import API from "./api/Api";
  import { navigate, Link } from "svelte-routing";

  let email = "";
  let password = "";
</script>

<h1>Login</h1>
<input type="email" placeholder="E-Mail" bind:value={email} />
<input type="password" placeholder="Password" bind:value={password} />
<button
  on:click={() => {
    if (email == "" || password == "") {
      alert("fill in both");
    } else {
      API.post("/login", { email: email, password: password }).then((res) => {
        if (res.msg == "ok") {
          navigate("/home");
        }
      });
    }
  }}>Login</button>
<hr />
<Link to="/register">register</Link>
