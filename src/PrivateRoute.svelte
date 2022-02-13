<script>
  import { Route } from "svelte-navigator";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

  export let path;
</script>

<!-- let:location let:navigate -->
<Route path={path} let:params>
  <PrivateRouteGuard>
    <slot params={params} location={location} />
    <!-- {navigate} -->
  </PrivateRouteGuard>
</Route>
