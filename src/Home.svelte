<script>
  import { onMount } from "svelte";
  import {link, links} from "svelte-routing";
  import {
    getMyTimeline,
    getPostDetails,
    getAvatarUsernameMaps,
  } from "./api/m2npApi";
  import marked from "marked";
  import { Carousel } from "svelte-images";
  import Postbox from "./components/Postbox.svelte";
  const { Modal, open, close } = Carousel;

  const renderer = new marked.Renderer();
  renderer.link = ( href, title, text ) => `<a target="_blank" href="${ href }">${ text }</a>`; //title="${ title }"

  const isArray = Array.isArray;
  let postDetail = {};
  let timeline = [];
  let avatars = {};
  let usernames = {};

  // Get the data from the api, after the page is mounted.
  onMount(async () => {
    const res = await getMyTimeline();
    timeline = res;

    const res2 = await getAvatarUsernameMaps();
    avatars = res2[0];
    usernames = res2[1];
  });

  // const handleOnClick = (event) => {
  //   const name = event.target.name;
  //   getPostDetails(name).then((res) => {
  //     postDetail = res;
  //   });
  // };

</script>

<svelte:head>

</svelte:head>
<main>
  <menu
    style="width:210px; position:fixed; left:1em; height:calc(100vh - 1em); overflow-y:scroll;padding:0;margin-block-start:0"
  >
    <nav style="border-bottom:1px #CCC solid; margin-right:1em;padding:.4em">
      <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
      <a href="/logout" use:link><i class="fa fa-sign-out" aria-hidden="true"></i></a>
      <a href="/?p=import_from_facebook" target="_blank">Import FB</a
      >
    </nav>

    <h3 style="padding:0;margin:.3em 0 0">m2np</h3>

    {#each timeline as v}
      <article
        style="border-bottom:1px #DDD solid;padding:.3em;max-height:100px;overflow:hidden"
      >
        <img src={avatars[v["user_id"]]} width="20" alt="avatar" />
        <a href={"/user/"+usernames[v["user_id"]]} use:link>{usernames[v["user_id"]]}</a>
        <small>{v.json["created_at"]}</small>
        <small>{v.json["post"]}</small>
      </article>
    {/each}
  </menu>

  <section style="margin-left:230px" id="right_container" class="sw_all">
    <Postbox />
    {#each timeline as v}
      <article>
        <div style="padding:.3em;float:left" class="avatar_box">
          <img
            width="32"
            style="display: block;margin-bottom: .5em;margin-left: 3px;float:left"
            src={avatars[v["user_id"]]}
            class="avatars"
            alt="avatar"
          />
          <small
            class="ab_desc"
            style="position: absolute;float: left;padding-left: 1em;background: white;display:none"
          >
            {v.json["created_at"]}<br />
            <small>{usernames[v["user_id"]]}</small>
          </small>
          <div style="clear:both" />
        </div>
        <div style="height:100%;float:left" />

        <div style="float:left;width:calc(100% - 80px);padding-left:.3em">
          {@html marked(v.json["post"], { renderer:renderer })}
          
          {#if isArray(v.json["images"])}
            {#each v.json["images"] as image,i}
                
                  <img
                    width="20%"
                    src={image["src"]}
                    alt={image["alt"]}
                    on:click={() => {
                        setTimeout(() => {
                            open(v.json["images"], i);
                        }, 0);
                    }
                    
                    }
                  />
                
            {/each}
          {/if}
        </div>
        <div style="clear:both" />
      </article>
    {/each}
  </section>
  <Modal />
</main>

<style>


</style>
