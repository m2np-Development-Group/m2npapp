<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { myInfoStore, filluserStore } from "./stores";
  import { exists } from "./utils/util";

  import API from "./utils/Api";
  const navigate = useNavigate();
  const location = useLocation();
  // const getCookieValue = (name) => (
  //   document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  // )

  let loadingUserData = false;
  $: if (!localStorage.getItem("M2NP_TOKEN")) {
    navigate("/login", {
      state: { from: $location.pathname },
      replace: true,
    });
  } else if (!exists($myInfoStore) && !loadingUserData) {
    loadingUserData = true;
    API.get("/get_profile").then((res) => {
      if (!exists(res.data)) {
        alert("data retrive error");
        navigate("/login", {
          state: { from: $location.pathname },
          replace: true,
        });
        return;
      }

      loadingUserData = false;
      $myInfoStore = res.data;
      filluserStore(res.data.followings);
      filluserStore(res.data.followers);
    });
  }
</script>

{#if localStorage.getItem("M2NP_TOKEN") && $myInfoStore}
  <slot />
{/if}

{#if !$myInfoStore}
  <div
    class="is-loading"
    style="display:none;width:100%;padding:1em;font-family:Fantasy;font-size:2em"
  >
    Loading...
  </div>
{/if}
