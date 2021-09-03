<!-- App.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { globalHistory } from "svelte-navigator/src/history";
  import { Router, Route } from "svelte-navigator";

  import PrivateRoute from "./PrivateRoute.svelte";

  import Home from "./Home.svelte";
  import Logout from "./Logout.svelte";
  import Login from "./Login.svelte";
  import Register from "./Register.svelte";
  import Settings from "./Settings.svelte";
  import ResetPassword from "./ResetPassword.svelte";
  import HashTag from "./HashTag.svelte";

  import { docClicked,myInfoStore,wallpaper } from "./stores";
  import Notifications from "svelte-notifications";

  import { currentPath } from "./utils/util";
  

  let unsub;
  export let url = "";

  onMount(async () => {
    console.log("%cM2NP WebFrontEnd v20210901 : 幽城", "font-weight:bold");
    unsub = globalHistory.listen(({ location, action }) => {
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
  <div id='wallpaper' style='background-image: url({$wallpaper});'></div>
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
      <Home username={$myInfoStore.user.username} />
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
  @import "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/codemirror.min.css";
  @import "https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.2/css/all.min.css";
  /* light */
  /* @import "https://jenil.github.io/bulmaswatch/flatly/bulmaswatch.min.css"; */
  /* @import 'bulma/css/bulma.css'; */

  #wallpaper {    
    content: "";
    background-size: cover;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.6;
  }

</style>
