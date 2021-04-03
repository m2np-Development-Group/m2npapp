<!-- App.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { globalHistory } from "svelte-navigator/src/history";
  import { Router, Link, Route, navigate, links } from "svelte-navigator";

  import PrivateRoute from "./PrivateRoute.svelte";

  import Home from "./Home.svelte";
  import Logout from "./Logout.svelte";
  import Login from "./Login.svelte";
  import Register from "./Register.svelte";
  import Settings from "./Settings.svelte";
  import ResetPassword from "./ResetPassword.svelte";
  import HashTag from "./HashTag.svelte";

  import { docClicked } from "./stores";
  import Notifications from "svelte-notifications";

  import { currentPath } from "./utils/util";
  

  let unsub;
  export let url = "";

  onMount(async () => {
    console.log("%cM2NP WebFrontEnd v20210403", "font-weight:bold");
    unsub = globalHistory.listen(({ location, action }) => {
      console.log(location, action);
      $currentPath = location.pathname;

      url = $currentPath;
    });
  });
  onDestroy(() => {
    unsub();
  });
  document.addEventListener("click", function () {
    $docClicked = true;
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
  <Notifications>
    <Route path="/" component={Login} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/logout" component={Logout} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/hashtag/:tag" let:params>
      <HashTag tag={params.tag} />
    </Route>

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
</Router>

<style>

  /* dark */
  /* @import "https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css"; */
  @import "https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css";
  /* light */
  /* @import "https://jenil.github.io/bulmaswatch/flatly/bulmaswatch.min.css"; */
  /* @import 'bulma/css/bulma.css'; */


  :global(.popover_content) {
    border-radius: 3px;
    padding: 0.5em;
    background: white;
    width: 300px;
    height: 200px;
    overflow: auto;
    font-size: 12px;
    /* color: black; */
  }
  :global(a) {
    text-decoration: none;
  }
  :global(code){
    padding: 1px .5em 1px;
  }

  :global(hr) {
    height: 0px;
    border: none;
    border-top: 1px solid #bfc2c7;
  }
  :global(h1:focus) {
    outline: none;
  }
  :global(html,body) {
      height: 100%;
      font-size: 13px;
      overflow: hidden;
      background:#DDD;
    }

    :global(pre) {
      padding: 0
    }

</style>
