<script>
  import { onMount } from "svelte";
  import API from "../utils/Api";


  export let postId;
  let post;
  onMount(() => {
    API.get(`/get_post/${postId}`).then((res) => {
      post = res;
    });
  });
</script>

{JSON.stringify(post)}
