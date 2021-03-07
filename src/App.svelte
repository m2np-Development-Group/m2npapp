<!-- App.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { globalHistory } from "svelte-routing/src/history";
  import { Router, Link, Route, navigate, links } from "svelte-routing";
  import Home from "./Home.svelte";
  import Logout from "./Logout.svelte";
  import Login from "./Login.svelte";
  import API from "./api/Api";
  import Register from "./Register.svelte";
  export let url = "";
  import Modal from "svelte-simple-modal";
  import Notifications from "svelte-notifications";
  import { currentPath } from "./utils/util";
  let unsub;

  const urlMiddleware = (url) => {
    console.log("um:" + url)
    if (url != "/login" && url != "/register" && url != "/logout") {
        API.get("/check").then(function (response) {
          console.log(response);

          console.log(url);
          if (response.msg != "ok") {
            navigate("/login", { replace: false });
          } else {
            if (url == "/" || url == "") {
              navigate("/home", { replace: false });
            }
          }
        });
      }
  }

  onMount(async () => {
    unsub = globalHistory.listen(({ location, action }) => {
      console.log(location, action);
      $currentPath = location.pathname;

      url = $currentPath;
      urlMiddleware(url)
    });

    urlMiddleware(location.pathname)
  });
  onDestroy(() => {
    unsub();
  });
  const typeSound = new Audio("/assets/type.mp3");
  document.addEventListener("keydown", function (e) {
    if (!typeSound.paused) {
      typeSound.currentTime = 0;
    }
    typeSound.play();
  });
</script>

<Router>
  <Modal>
    <Notifications>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/home" component={Home} />
      <Route path="/user/:username" let:params>
        <Home username={params.username} />
      </Route>
      <Route path="/logout" component={Logout} />
    </Notifications>
  </Modal>
</Router>

<style>
  :global(a) {
    color: bisque;
    text-decoration: none;
  }
  :global(a:hover) {
    text-decoration: underline;
  }
  :global(body) {
    background-image: radial-gradient(circle at 0% 0%, #2c3940, #1b1f27 70%);
    color: #bfc2c7;
    font-family: monospace;
  }
  :global(hr) {
    height: 0px;
    border: none;
    border-top: 1px solid #bfc2c7;
  }
</style>
