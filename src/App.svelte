<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Router, Route, globalHistory } from "svelte-navigator";

  import PrivateRoute from "./PrivateRoute.svelte";

  import Home from "./Home.svelte";
  import Logout from "./Logout.svelte";
  import Login from "./Login.svelte";
  import Register from "./Register.svelte";
  import Settings from "./Settings.svelte";
  import ResetPassword from "./ResetPassword.svelte";
  import HashTag from "./HashTag.svelte";

  import { docClicked, myInfoStore, wallpaper } from "./stores";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { currentPath, exists } from "./utils/util";
  import type { Unlisten } from "svelte-navigator/types/NavigatorHistory";

  let unsub: Unlisten;
  export let url = "";

  onMount(async () => {
    console.log(
      "%cM2NP WebFrontEnd v20220320 : 衫易綾",
      "font-weight:bold"
    );
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

  let defaultWallpaperSVG =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1005%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='url(%23SvgjsLinearGradient1006)'%3e%3c/rect%3e%3cpath d='M -782.7055499764153%2c463 C -686.71%2c395.6 -494.71%2c139 -302.7055499764154%2c126 C -110.71%2c113 -14.71%2c367.6 177.2944500235846%2c398 C 369.29%2c428.4 465.29%2c285.6 657.2944500235847%2c278 C 849.29%2c270.4 980.75%2c367.6 1137.2944500235847%2c360 C 1293.84%2c352.4 1379.46%2c264 1440%2c240' stroke='rgba(51%2c 121%2c 194%2c 0.58)' stroke-width='2'%3e%3c/path%3e%3cpath d='M -363.40984879882456%2c146 C -267.41%2c175.6 -75.41%2c268.6 116.59015120117542%2c294 C 308.59%2c319.4 404.59%2c269.8 596.5901512011754%2c273 C 788.59%2c276.2 884.59%2c345 1076.5901512011753%2c310 C 1268.59%2c275 1483.91%2c68.2 1556.5901512011753%2c98 C 1629.27%2c127.8 1463.32%2c386.8 1440%2c459' stroke='rgba(51%2c 121%2c 194%2c 0.58)' stroke-width='2'%3e%3c/path%3e%3cpath d='M -205.7179099316886%2c223 C -109.72%2c265.2 82.28%2c467.4 274.2820900683114%2c434 C 466.28%2c400.6 562.28%2c64.2 754.2820900683114%2c56 C 946.28%2c47.8 1042.28%2c351 1234.2820900683114%2c393 C 1426.28%2c435 1673.14%2c277.4 1714.2820900683114%2c266 C 1755.43%2c254.6 1494.86%2c322 1440%2c336' stroke='rgba(51%2c 121%2c 194%2c 0.58)' stroke-width='2'%3e%3c/path%3e%3cpath d='M -641.8780400213259%2c136 C -545.88%2c202.6 -353.88%2c476.2 -161.87804002132583%2c469 C 30.12%2c461.8 126.12%2c108.4 318.12195997867417%2c100 C 510.12%2c91.6 606.12%2c412.2 798.1219599786741%2c427 C 990.12%2c441.8 1149.75%2c179.4 1278.121959978674%2c174 C 1406.5%2c168.6 1407.62%2c354.8 1440%2c400' stroke='rgba(51%2c 121%2c 194%2c 0.58)' stroke-width='2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1005'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='15.28%25' y1='-39.29%25' x2='84.72%25' y2='139.29%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1006'%3e%3cstop stop-color='%230e2a47' offset='0'%3e%3c/stop%3e%3cstop stop-color='%2300459e' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
</script>

<SvelteToast options={{ duration: 8000, intro: { y: -64 } }} />
<!-- primary={false} makes route do not autofocus -->
<Router primary={false}>
  <div
    id="wallpaper"
    style="background-image: url('{exists($wallpaper)
      ? $wallpaper
      : defaultWallpaperSVG}');"
  />

  <Route path="/" component={Login} />
  <Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/logout" component={Logout} />
  <Route path="/reset-password" component={ResetPassword} />

  <Route path="/hashtag/:tag" let:params>
    <HashTag tag={params.tag} />
  </Route>

  <PrivateRoute path="/home">
    <Home username={$myInfoStore.user.username} currentChannel="inbox" />
  </PrivateRoute>
  <PrivateRoute path="/home/:box" let:params>
    <Home username={$myInfoStore.user.username} currentChannel={params.box} />
  </PrivateRoute>
  <PrivateRoute path="/settings">
    <Settings />
  </PrivateRoute>
  <PrivateRoute path="/user/:username" let:params>
    <Home username={params.username} />
  </PrivateRoute>
</Router>

<style>
  #wallpaper {
    background-size: cover;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.6;
    z-index: -1;
  }
</style>
