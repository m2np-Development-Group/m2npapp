<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { userInfoStore } from "./stores";
    import API from "./api/Api"
    const navigate = useNavigate();
    const location = useLocation();
    const getCookieValue = (name) => (
      document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
    )
    $: if (!localStorage.getItem("M2NP_TOKEN")) {
      navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    }else if(!$userInfoStore){
      API.get("/get_profile").then((res) => {
        $userInfoStore=res;
      });
    }
  </script>
  
  {#if localStorage.getItem("M2NP_TOKEN") && $userInfoStore}
    <slot />
  {/if}
  
  {#if !$userInfoStore}
    Loading User Info.
  {/if}