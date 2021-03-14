<!-- App.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { globalHistory } from "svelte-navigator/src/history";
  import { Router, Link, Route, navigate, links } from "svelte-navigator";

  import API from "./api/Api";
  import PrivateRoute from "./PrivateRoute.svelte";

  import Home from "./Home.svelte";
  import Logout from "./Logout.svelte";
  import Login from "./Login.svelte";
  import Register from "./Register.svelte";
  import Settings from "./Settings.svelte";
  
  import Modal from "svelte-simple-modal";
  import Notifications from "svelte-notifications";
  import { currentPath } from "./utils/util";

  let unsub;
  export let url = "";
  
  // const urlMiddleware = (url) => {
  //   console.log("um:" + url)
  //   if (url != "/login" && url != "/register" && url != "/logout") {
  //       API.get("/check").then(function (response) {
  //         console.log(response);

  //         console.log(url);
  //         if (response.msg != "ok") {
  //           navigate("/login", { replace: false });
  //         } else {
  //           if (url == "/" || url == "") {
  //             navigate("/home", { replace: false });
  //           }
  //         }
  //       });
  //     }
  // };
  
  onMount(async () => {
    console.log('%cM2NP WebFrontEnd v0.1', 'font-weight:bold')
    unsub = globalHistory.listen(({ location, action }) => {
      console.log(location, action);
      $currentPath = location.pathname;

      url = $currentPath;
      // urlMiddleware(url)
    });

    // urlMiddleware(location.pathname)
  });
  onDestroy(() => {
    unsub();
  });
  // const typeSound = new Audio("/assets/type.mp3");
  // document.addEventListener("keydown", function (e) {
  //   if (!typeSound.paused) {
  //     typeSound.currentTime = 0;
  //   }
  //   typeSound.play();
  // });
</script>

<!-- primary={false} makes route do not autofocus -->
<Router primary={false}>
  <Modal>
    <Notifications>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/logout" component={Logout} />

      <PrivateRoute path="/home">
        <Home />
      </PrivateRoute>
      <PrivateRoute path="/settings">
        <Settings />
      </PrivateRoute>
      <PrivateRoute path="/user/:username" let:params>
        <Home username={params.username} />
      </PrivateRoute>

      
    </Notifications>
  </Modal>
</Router>

<style>
  @import "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
  
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
  :global(h1:focus){
    outline:none
  }
</style>
