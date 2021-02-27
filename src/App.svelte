<!-- App.svelte -->
<script>
  import { onMount } from "svelte";

  import { Router, Link, Route, navigate, links } from "svelte-routing";
  import Home from "./Home.svelte";
  import Logout from "./Logout.svelte";
  import Login from "./Login.svelte";
  import API from "./api/Api";
  import Register from "./Register.svelte";
  export let url = "";
  import Modal from "svelte-simple-modal";
  import Notifications from "svelte-notifications";

  onMount(async () => {
    console.log(url);
    if (url != "/login" && url != "/register" && url != "/logout") {
      API.get("/check").then(function (response) {
        console.log(response);
        if (response.msg != "ok") {
          navigate("/login", { replace: false });
        } else {
          if (url == "") {
            navigate("/home", { replace: false });
          }
        }
      });
    }
  });
</script>

<Router url={url}>
  <Modal>
    <Notifications>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/home" component={Home} />
      <Route path="/logout" component={Logout} />
    </Notifications>
  </Modal>
</Router>

<style>
  :global(a) {
    color: bisque;
  }
</style>
