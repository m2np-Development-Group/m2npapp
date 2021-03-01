<script>
  import { onMount, getContext } from "svelte";
  import { link, links } from "svelte-routing";
  import marked from "marked";
  import Postbox from "./components/Postbox.svelte";
  import PostView from "./components/PostView.svelte";
  import { timeConverter } from "./utils/util";
  import API from "./api/Api";
  import { autoresize } from "./utils/autoresize.js";
  import InfiniteScroll from "./components/InfiniteScroll.svelte";
  import { parse } from "QS";

  export let location;
  let queryParams;
  $: queryParams = console.log(parse(location.search.replace("?", "")));

  let coinSound = new Audio("/assets/coin.mp3");
  let flipCoinSound = new Audio("/assets/flipcoin.mp3");

  let newBatch = [];
  let timeline = [];
  let maxTS;
  let minTS;
  let replyContent = "";
  let replies = [];

  async function fetchData(isAppend) {
    API.get(
      "/get_personal_timeline",
      isAppend
        ? { less_than_ts: minTS } //append : fetch older posts
        : { more_than_ts: maxTS } //append : fetch newer posts
    ).then((res) => {
      newBatch = res;
      timeline = isAppend
        ? [...timeline, ...newBatch]
        : [...newBatch, ...timeline];

      maxTS = timeline[0].created_at;
      minTS = timeline[timeline.length - 1].created_at;
      timeline.map((x) => {
        x.isActive = x.isActive ? true : false;
      });

      if (isAppend) {
        coinSound.play();
      } else {
        flipCoinSound.play();
      }
    });
  }

  const { open } = getContext("simple-modal");

  const showPostView = (id, imageId) => {
    open(PostView, { postId: id, imageId: imageId });
  };

  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) =>
    `<a target="_blank" href="${href}">${text}</a>`; //title="${ title }"

  const markedOptions = { renderer: renderer, breaks: true };

  const myMarked = (str) => {
    if (str == undefined || str == null) {
      return "";
    }
    return marked(str, markedOptions)
      .replace("&#39;", "&apos;")
      .replace(/@([a-z\d_]+)/gi, '<a href="/user/$1">@$1</a>')
      .replace(
        /\B#([\u4e00-\u9fa5_a-zA-Z0-9]+)/g,
        '<a href="/hashtag/$1">#$1</a>'
      );
  };

  const isArray = Array.isArray;
  let avatars = {};
  let usernames = {};
  let articleCards = {};
  let profile = {};

  // Get the data from the api, after the page is mounted.
  onMount(async () => {
    fetchData();

    API.get("/get_avatar_username_maps").then((res) => {
      avatars = res[0];
      usernames = res[1];
    });

    API.get("/get_profile").then((res) => {
      profile = res;
    });

    // setInterval(function () {
    //   var ni = timeline[8];
    //   ni.id = ni.id + 1000;
    //   timeline = [ni, ...timeline];
    // }, 30000);
  });

  // const handleOnClick = (event) => {
  //   const name = event.target.name;
  //   getPostDetails(name).then((res) => {
  //     postDetail = res;
  //   });
  // };
  function refreshReplies(post_id) {
    API.get("/get_replies", { post_id: post_id }).then((res) => {
      replies = res;
      console.log(replies);
    });
  }
  function openGrid(k, v) {
    if (v.isActive) {
      timeline[k].isActive = false;
    } else {
      timeline.map((x) => {
        x.isActive = x.id == v.id;
        if (x.isActive) {
          refreshReplies(v.id);
        }
      });
    }
    timeline = timeline;
  }
</script>

<svelte:head />
<main>
  <div
    style="width:200px; position:fixed; left:1em; height:calc(100vh - 1em); padding:0;margin-block-start:0">
    <nav style="border-bottom:1px #CCC solid; margin-right:1em;padding:.4em">
      <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
      <a href="/logout" use:link
        ><i class="fa fa-sign-out" aria-hidden="true" /></a>
    </nav>

    <img width="40" src={profile?.user?.avatar} alt="avatar" />
    {profile?.user?.display_name} <br /><br />

    {@html myMarked(profile?.user?.description)}

    Followings: {JSON.stringify(profile.followings)} <br />
    Followers: {JSON.stringify(profile.followers)} <br /><br />
    Last Login: <strong>{timeConverter(profile.user?.last_login)}</strong><br />
    Post Count: <strong>{profile.user?.article_count}</strong><br />
  </div>

  <div class="postbox">
    <Postbox
      finishHandler={(id) => {
        API.get(`get_post/${id}`).then((res) => {
          timeline = [res, ...timeline];
        });
      }} />
  </div>
  <section class="cards">
    <i class="fa fa-trash-alt" />
    {#each timeline as v, k}
      <article
        class="card"
        bind:this={articleCards[v.id]}
        class:active={v.isActive ? true : false}>
        <div class="avatar_box">
          <img
            width="20"
            src={avatars[v["user_id"]]}
            class="avatars"
            alt="avatar" />
          <small on:click={() => showPostView(v["id"])}>
            {usernames[v["user_id"]]}
            {timeConverter(v.created_at)}
          </small>
        </div>
        <div
          style="padding-left:.3em;font-size:13px"
          on:click={() => openGrid(k, v)}>
          {@html myMarked(v["content"])}
        </div>

        {#if v.isActive}
          <div class="replies">
            {#each replies as reply}
              {reply.user_id}: {reply.content}
            {/each}
          </div>
          <div style="width:700px; margin-top:1em">
            <textarea
              use:autoresize
              bind:value={replyContent}
              on:keyup={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key == "Enter") {
                  API.post("/post_reply", {
                    post_id: v.id,
                    content: replyContent,
                  }).then((res) => {
                    if (res.msg == "ok") {
                      replyContent = "";
                    }
                  });
                }
              }}
              class="reply_box" /><br />
            <span on:click={v.isActive && alert("x")}
              ><i class="fa fa-smile-o" /></span>
            <span on:click={v.isActive && alert("x")}
              ><i class="fa fa-file-image-o" /></span>

            <span style="opacity:0.6">按 Ctrl+Enter 送出</span>
          </div>
        {/if}
      </article>
    {/each}

    <InfiniteScroll
      hasMore={newBatch.length > 0}
      threshold={500}
      on:loadMore={() => {
        console.log("load more");
        fetchData(true);
      }} />
  </section>
</main>

<style>
  .postbox {
    position: fixed;
    width: calc(100vw - 236px);
    left: 220px;
    z-index: 100;
  }
  .reply_box {
    height: 19px;
    resize: none;
    border: 1px solid #999;
    color: #bfc2c7;
    outline: none;
    background: #2c3940;
  }
  .card {
    color: #fbbd2a;
    /* border:1px solid red; */
    box-shadow: 0 0 0 1px #8a463c;
    background-color: #1e242c;

    overflow: hidden;
    height: 150px;
    padding: 2px;
  }
  .card.active {
    height: 300px;
    max-width: 100%;
    width: calc(100% - 1em);
    flex: 0 0 100%;
    position: static;
    border: 2px solid #fbbd2a;
    overflow-y: scroll;
  }
  nav a {
    color: #fbbd2a;
  }

  /* Flexbox stuff */

  .cards {
    top: 40px;
    bottom: 10px;
    left: 220px;
    position: fixed;
    width: calc(100vw - 236px);
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
  }

  .card {
    flex: 0 0 500px;
    box-sizing: border-box;
  }
  @media screen and (min-width: 40em) {
    .card {
      max-width: calc(50%);
    }
  }

  @media screen and (min-width: 60em) {
    .card {
      max-width: calc(25%);
    }
  }
  :global(body) {
    overflow: hidden;
  }
  :global(.card a) {
    color: #f7694d;
    text-decoration: none;
  }
  :global(article a) {
    color: #f7694d;
    text-decoration: none;
  }
  :global(.card th) {
    border-bottom: #fbbc2a88 1px solid;
    text-align: left;
    font-weight: 700;
  }
  :global(table) {
    border-spacing: 0;
  }
  :global(table td) {
    padding-right: 1em;
    border-bottom: #fbbc2a67 1px solid;
  }
</style>
