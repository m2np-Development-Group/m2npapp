<script>
  import { onMount, getContext } from "svelte";
  import { link, links } from "svelte-routing";
  import marked from "marked";
  import Postbox from "./components/Postbox.svelte";
  import PostView from "./components/PostView.svelte";
  import { timeConverter, getDateDiff } from "./utils/util";
  import API from "./api/Api";
  import { autoresize } from "./utils/autoresize.js";
  import InfiniteScroll from "./components/InfiniteScroll.svelte";
  import { parse } from "QS";
  import Popover from "svelte-popover";
	import Hoverable from './components/Hoverable.svelte';
  import UserSearchBox from './components/UserSearchBox.svelte'
  export let location;
  let queryParams;
  $: queryParams = console.log(parse(location.search.replace("?", "")));

  let coinSound = new Audio("/assets/coin.mp3");
  let flipCoinSound = new Audio("/assets/flipcoin.mp3");

  let showingArticle = {};
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
      if (isArray(res) && res.length>0) {
        newBatch = res;
        timeline = isAppend
          ? [...timeline, ...newBatch]
          : [...newBatch, ...timeline];

        maxTS = timeline[0].created_at;
        minTS = timeline[timeline.length - 1].created_at;

        if (isAppend) {
          coinSound.play();
        } else {
          flipCoinSound.play();
        }
      }
    });
  }

  const { open } = getContext("simple-modal");

  const showPostView = (id, imageId) => {
    open(PostView, { postId: id, imageId: imageId });
  };

  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) =>
    `<a target="_blank" href="${href}">${text}</a>`;
  const markedOptions = { renderer: renderer, breaks: true };
  const renderer2 = new marked.Renderer();
  renderer2.link = (href, title, text) =>
    `<a target="_blank" href="${href}">${text}</a>`;
  renderer2.paragraph = (text) => text + "<br />";
  const markedOptions2 = { renderer: renderer2, breaks: true };

  const myMarked = (str) => {
    if (str == undefined || str == null) {
      return "";
    }
    return marked(str, markedOptions)
      .replace("&#39;", "&apos;")
      .replace(/@([a-z\d_]+)/gi, '<a href="/user/$1">@$1</a>')
      .replace("<p>", "")
      .replace("</p>", "")
      .replace(
        /\B#([\u4e00-\u9fa5_a-zA-Z0-9]+)/g,
        '<a href="/hashtag/$1">#$1</a>'
      );
  };
  const myMarkedForReplies = (str) => {
    if (str == undefined || str == null) {
      return "";
    }
    return marked(str, markedOptions2)
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
    });
  }
</script>

<svelte:head />
<main>
  <div
    style="width:300px; position:fixed; left:1em; height:calc(100vh - 1em); padding:0;margin-block-start:0">
    <nav
      style="border-bottom:1px #CCC solid; padding:.4em; font-size:1.2em; margin-bottom:1.2em">
      <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
      <a href="/logout" use:link><i class="fa fa-sign-out" aria-hidden="true" /></a>
      <i class="fa fa-bell" aria-hidden="true" />

      <Hoverable let:hovering={isSearchBoxShowing}>
        {#if isSearchBoxShowing}
          <UserSearchBox />

        {:else}
          <i class="fa fa-search" aria-hidden="true" />
        {/if}
      </Hoverable>

      
    </nav>

    <img width="40" src={profile?.user?.avatar} alt="avatar" />
    {profile?.user?.display_name} <br />

    {@html myMarked(profile?.user?.description)}

    Followings: {JSON.stringify(profile.followings)} <br />
    Followers: {JSON.stringify(profile.followers)} <br /><br />
    Last Login: <strong>{getDateDiff(profile.user?.last_login)}</strong><br />
    Post Count: <strong>{profile.user?.article_count}</strong><br />
  </div>

  <div class="postbox">
    {#if showingArticle.id === undefined}
      <Postbox
        finishHandler={(id) => {
          API.get(`get_post/${id}`).then((res) => {
            timeline = [res, ...timeline];
          });
        }} />
    {:else}
      <article
        style="border-bottom:1px solid #BBB"
        bind:this={articleCards[showingArticle.id]}>
        <div class="avatar_box">
          <Popover arrowColor="#fff">
            <div slot="target">
              <img
                width="20"
                src={avatars[showingArticle["user_id"]]}
                class="avatars"
                alt="avatar" />
              {usernames[showingArticle["user_id"]]}
            </div>
            <div slot="content" class="content">Content</div>
          </Popover>

          <small on:click={() => showPostView(showingArticle["id"])}>
            {getDateDiff(showingArticle.created_at)}
          </small>
        </div>
        <div class="post_content">
          {@html myMarked(showingArticle["content"])}
        </div>
        <span on:click={() => alert("retweet")}
          ><i class="fa fa-retweet" /></span>
        <span on:click={() => alert("like")}><i class="fa fa-heart-o" /></span>
      </article>

      <div class="replies">
        {#each replies as reply}
          <table>
            <tr>
              <td>
                
              </td>
              <td style="width:100%">
                
              </td>
            </tr>
          </table>
          {usernames[reply.user_id]}<br/>
          {@html myMarked(reply.content)}
        {/each}
        {#if replies.length == 0}
          No Replies.
        {/if}
      </div>
      <div style="width:100%; margin-top:1em">
        <textarea
          use:autoresize
          bind:value={replyContent}
          on:keyup={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key == "Enter") {
              API.post("/post_reply", {
                post_id: showingArticle.id,
                content: replyContent,
              }).then((res) => {
                if (res.msg == "ok") {
                  replyContent = "";
                }
              });
            }
          }}
          class="reply_box" /><br />
        <span on:click={() => alert("x")}><i class="fa fa-smile-o" /></span>
        <span on:click={() => alert("x")}
          ><i class="fa fa-file-image-o" /></span>

        <span style="opacity:0.6">按 Ctrl+Enter 送出</span>
      </div>
    {/if}
  </div>
  <section class="cards">
    <i class="fa fa-trash-alt" />
    {#each timeline as v, k}
      <article class="card" bind:this={articleCards[v.id]}>
        <div class="avatar_box">
          <img
            width="20"
            src={avatars[v["user_id"]]}
            class="avatars"
            alt="avatar" />
          <small on:click={() => showPostView(v["id"])}>
            {usernames[v["user_id"]]}
            {getDateDiff(v.created_at)}
          </small>
        </div>
        <div
          class="post_content"
          on:click={() => {
            showingArticle = v;
            refreshReplies(v.id);
          }}>
          {@html myMarked(v["content"])}
        </div>
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
  :global(.replies table) {
    width: 100%;
  }
  :global(.replies td) {
    vertical-align: top;
    white-space: nowrap;
  }
  .replies {
    max-height: 200px;
    overflow-y: auto;
  }

  .postbox {
    position: fixed;
    width: 280px;
    left: 20px;
    bottom: 2px;
    z-index: 100;
  }

  .reply_box {
    height: 19px;
    resize: none;
    border: 1px solid #999;
    color: #bfc2c7;
    background: #2c3940;
  }
  .card {
    color: #fbbd2a;
    /* border:1px solid red; */
    box-shadow: 0 0 0 1px #8a463c;

    overflow: hidden;
    height: 150px;
    padding: 2px;
  }
  nav a {
    color: #fbbd2a;
  }

  /* Flexbox stuff */

  .cards {
    top: 10px;
    bottom: 10px;
    left: 320px;
    position: fixed;
    width: calc(100vw - 326px);
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
  .post_content {
    padding-left: 0.3em;
    font-size: 13px;
  }
  :global(.post_content table) {
    border-spacing: 0;
  }
  :global(.post_content table td) {
    padding-right: 1em;
    border-bottom: #fbbc2a67 1px solid;
  }
</style>
