<script>
    import { Route } from "svelte-navigator";
    import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
  
    export let path;
  </script>
   <!-- let:location let:navigate -->
  <Route {path} let:params>
    <PrivateRouteGuard>
      <slot {params} {location} />
      <!-- {navigate} -->
    </PrivateRouteGuard>
  </Route>
  