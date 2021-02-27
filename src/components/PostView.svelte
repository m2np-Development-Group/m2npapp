<script>
  import { onMount } from "svelte";
  import API from "../api/Api";

  // const { Modal, open, close } = Carousel;

  export let postId;
  let post;
  onMount(() => {
    API.get(`/get_post/${postId}`).then((res) => {
      post = res;
    });
  });
</script>

<!-- <Modal /> -->
{JSON.stringify(post)}
