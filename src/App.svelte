<!-- App.svelte -->
<script>
  import { onMount } from "svelte";

  import { Router, Link, Route, navigate, links } from "svelte-routing";
  import Home from "./Home.svelte";
  import Logout from "./Logout.svelte";
  import Login from "./Login.svelte";
  import API from "./api/Api";
  export let url = "";

  onMount(async () => {
    console.log(url);
    if (url != "/login" && url != "/register" && url != "/logout") {
      API.get("/check").then(function (response) {
        console.log(response);
        if (response.msg != "ok") {
          
          navigate("/login", { replace: false });
        }
      });
    }
  });
</script>

<Router {url}>
  <div>
    <!-- <Route path="blog/:id" component="{BlogPost}" /> -->
    <Route path="login" component={Login} />

    <Route path="register">
      <h1>Register</h1>
      <Link to="/login">login</Link>
    </Route>
    <Route path="/home" component={Home} />
    <Route path="/logout" component={Logout} />
  </div>
</Router>

<style>
  h1 {
    font-size: 14px;
  }
</style>
