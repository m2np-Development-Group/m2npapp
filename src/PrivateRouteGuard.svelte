<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { myInfoStore } from "./stores";
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
    }else if(!$myInfoStore){
      API.get("/get_profile").then((res) => {
        $myInfoStore=res;
      });
    }
  </script>
  
  {#if localStorage.getItem("M2NP_TOKEN") && $myInfoStore}
    <slot />
  {/if}
  
  {#if !$myInfoStore}
    Loading User Info.
  {/if}