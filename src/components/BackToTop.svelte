<script>
    import {Button} from "svelma";
    export let showOnPx = 150;
    let hidden = true;
  
    function goTop() {
      document.body.scrollIntoView();
    }
  
    function scrollContainer() {
      return document.documentElement || document.body;
    }
  
    function handleOnScroll() {
      if (!scrollContainer()) {
        return;
      }
  console.log(scrollContainer())
      if (scrollContainer().scrollTop > showOnPx) {
        hidden = false;
      } else {
        hidden = true;
      }
    }
  </script>
  
  <style>
    .back-to-top {
      opacity: 1;
      transition: opacity 0.5s, visibility 0.5s;
      position: fixed;
      z-index: 99;
      right: 20px;
      user-select: none;
      bottom: 20px;
      color: white;
      background-color: black;
    }
  
    .back-to-top.hidden {
      opacity: 0;
      visibility: hidden;
    }
  </style>
  
  <svelte:window on:scroll={handleOnScroll} />
  <div class="back-to-top" class:hidden>
  <Button on:click={goTop} rounded iconRight="arrow-up">Top</Button>
</div>