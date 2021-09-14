<script>
  import { link } from "svelte-navigator";
  import Postbox from "./components/Postbox.svelte";
  import { exists } from "./utils/util";
  import API from "./utils/Api";
  import LeftBar from "./home/LeftBar.svelte";
  import ArticleSelector from "./home/ArticleSelector.svelte";
  import { onMount } from "svelte";

  import {
    myInfoStore,
    filluserStore,
    docClicked,
    myUnreadIds,
    wallpaper,
    playerLinks,
    globalPopOver,
  } from "./stores.js";
  import {
    getUrlExtension,
    matchYoutubeUrl,
    matchSoundCloudUrl,
  } from "./utils/util";
  import ArticleDetail from "./components/ArticleDetail.svelte";
  import Settings from "./Settings.svelte";
  import Search from "./components/Search.svelte";

  import { Button, Modal } from "svelma";

  export let username = null;

  let coinSound = new Audio("/assets/coin.mp3");
  let flipCoinSound = new Audio("/assets/flipcoin.mp3");
  let showingArticle = {};
  let newBatch = [];
  let timeline = [];
  let maxTS = { inbox: null, outbox: null, public: null, search: null };
  let minTS = { inbox: null, outbox: null, public: null, search: null };
  let replies;
  let currentChannel = "outbox";
  let isMyself = false;
  let profile = {};
  let notifications = [];
  let isSettingsShowing = false;
  let cellsSection;
  let coverMessage = "";
  let showSearch = false;
  let isShowFilterBox = true;
  let isUserMenuShowing = false;
  let isNotificationMenuShowing = false;

  const source = new EventSource(
    "https://m2np.com/api/streams/" + localStorage.getItem("M2NP_TOKEN"),
    { withCredentials: true }
  );
  source.addEventListener(
    "news",
    function (event) {
      const obj = JSON.parse(event.data);
      $myUnreadIds = obj;
      //console.log(event.data);
      if (event.data == "") {
        source.close(); // disconnect stream
      }
    },
    false
  );
  // Get the data from the api, after the page is mounted.
  onMount(async () => {});
  function mount() {
    timeline = [];

    if (isMyself) {
      columnSelected = [true, false, false];
      currentChannel = "inbox";
    } else {
      columnSelected = [false, true, false];
      currentChannel = "outbox";
    }
    fetchProfile();
    fetchData("fresh");
  }
  $: if (username) {
    if (username != null && username != "") {
      isMyself = username == $myInfoStore?.user?.username;
      mount();
    }
  }

  function fetchProfile() {
    if (isMyself) {
      profile = $myInfoStore;
      $wallpaper = profile.user.wallpaper;
      filluserStore([profile.user]);
      return;
    }
    API.get("/get_profile", {
      username: username,
    }).then((res) => {
      if (res.msg != "ok") {
        if (res.msg == "user not found") {
          coverMessage = "查無此人";
        }
      } else {
        profile = res.data;
        filluserStore(res.data.users);
      }
      $wallpaper = profile.user.wallpaper;
    });
  }

  function markAllAsRead() {
    API.post("/mark_all_as_read", { postId: postId }).then((res) => {
      if (res.msg != "ok") {
        return;
      }
      $myUnreadIds = [];
    });
  }
  // function fetchUnreadIds() {
  //   API.get("/get_unread").then((res) => {
  //     if (res.msg != "ok") {
  //       return;
  //     }
  //     $myUnreadIds = res.data;
  //   });
  // }
  //"fresh" =new
  //"prepend" =load new
  //"append" = load old
  function fetchData(mode = "fresh") {
    let pUser = username;

    //set url
    let channel = currentChannel;
    let url = "/get_" + channel;

    //set params
    rightSearchTerm = rightSearchTerm.trim();
    let params = {
      username: pUser,
      filter: rightSearchTerm == "" ? null : rightSearchTerm,
    };
    if (mode === "append") {
      params.less_than_ts = minTS[channel];
    } else if (mode === "prepend") {
      params.more_than_ts = maxTS[channel];
    }

    API.get(url, params).then((res) => {
      //fetchUnreadIds();
      filluserStore(res.users);
      if (
        Array.isArray(res.posts) &&
        (res.posts.length > 0 || mode == "fresh")
      ) {
        newBatch = res.posts;
        timeline =
          mode == "append"
            ? [...timeline, ...newBatch]
            : mode == "prepend"
            ? [...newBatch, ...timeline]
            : newBatch;

        maxTS[channel] = timeline[0]?.created_at;
        minTS[channel] = timeline[timeline.length - 1]?.created_at;

        if ($docClicked) {
          //sounds
          if (mode == "append") {
            coinSound.play();
          } else {
            flipCoinSound.play();
          }
        }
      }
    });
  }

  setInterval(function () {
    //fetchUnreadIds()
  }, 30000);
  async function refreshReplies(post_id) {
    replies = undefined;
    await API.get("/get_replies", { post_id: post_id }).then((res) => {
      replies = res;
    });
  }
  function markAsRead(postId) {
    API.post("/mark_as_read", { postId: postId }).then((res) => {
      if (res.msg != "ok") {
        return;
      }
      $myUnreadIds = $myUnreadIds.filter((m) => m != postId);
    });
  }

  const hideAllPopup = () => {
    isNotificationMenuShowing = false;
    isUserMenuShowing = false;
  };

  let rightSearchTerm = "";

  let columnSelected = [true, false, false];

  const changeToTab = (id) => {
    isShowFilterBox = id != "updated";

    if (currentChannel == id) {
      return false;
    }
    currentChannel = id;
    rightSearchTerm = "";
    fetchData("fresh");
    return true;
  };
</script>

<main>
  {#if $playerLinks.links.length > 0}
    <div id="media-player">
      <span
        style="display: inline-block;height: 100%;vertical-align: middle;" />
      <Button
        style="position: absolute;right: 0.5em; top:.5em; z-index:4;"
        size="is-small"
        on:click={() => {
          $playerLinks.links = [];
        }}
        iconRight="times">關閉</Button>
      <Button
        style="position: absolute;right: 7em; top: .5em; z-index:4;"
        size="is-small"
        iconPack="fas"
        on:click={() => {
          window
            .open($playerLinks.links[$playerLinks.currentIndex][0], "_blank")
            .focus();
        }}
        iconRight="external-link-alt">開新</Button>
      {#if $playerLinks.links[$playerLinks.currentIndex][1] != "img"}
        <iframe
          style="width:95%; height:calc(100% - 80px); vertical-align: middle;"
          src={$playerLinks.links[$playerLinks.currentIndex][0]}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen />
      {:else}
        <img
          src={$playerLinks.links[$playerLinks.currentIndex][0]}
          alt="carousel"
          style="max-width:95%; max-height:calc(100% - 80px); vertical-align: middle;" />
      {/if}
    </div>
  {/if}

  {#if $globalPopOver.isShow}
    <article
      class="message is-dark"
      style="position:fixed;top:{$globalPopOver.top}px;left:{$globalPopOver.left}px ; background:white; z-index:5">
      <div class="message-header">
        <p>{$globalPopOver.title}</p>
        <button
          class="delete"
          aria-label="delete"
          on:click={() => {
            $globalPopOver = {};
          }} />
      </div>
      <div class="message-body">
        {$globalPopOver.content}
      </div>
    </article>

    <div />
  {/if}

  <div class="modal" class:is-active={coverMessage != ""}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" />
        <!-- <button class="delete" aria-label="close" on:click={()=>{coverMessage=""}}></button> -->
      </header>
      <section class="modal-card-body">
        {coverMessage}
      </section>
      <footer class="modal-card-foot">
        <!-- <button class="button is-success" on:click={()=>{coverMessage=""}}>OK</button> -->
      </footer>
    </div>
  </div>

  <Settings bind:active={isSettingsShowing} />

  <Modal bind:active={showSearch}>
    <div style="background:white;padding:1em;border-radius:1em">
      <Search />
    </div>
  </Modal>

  <div
    class="columns is-mobile is-variable is-1"
    on:click={()=>{isNotificationMenuShowing=false;isUserMenuShowing=false}}
    style="position:fixed; top:40px;left:3px;bottom:3px;right:3px;margin:0">
    <div class="column is-2 is-hidden-mobile">
      <div
        class="app-box"
        style="overflow-y: auto; padding:3px;max-height:100%;">
        <LeftBar bind:profile />
      </div>
    </div>
    <div
      class="column"
      class:is-4={$playerLinks.links.length == 0}
      class:is-6={$playerLinks.links.length > 0}
      style="position:relative">
      <ArticleSelector
        bind:dom={cellsSection}
        style="background:white; overflow-y: auto; height:100%; overflow-x:hidden; border-radius:.3em;border:2px solid #CCC;"
        bind:timeline
        hasMore={newBatch.length > 0}
        loadMore={() => fetchData("append")}
        onCellClick={async (v) => {
          showingArticle = v;
          await refreshReplies(v.id);
          if ($myUnreadIds.includes(v.id)) {
            markAsRead(v.id);
          }
          window.hljs.highlightAll()
        }} />
      <div
        style="position:absolute; bottom:1em;right:2em"
        class="is-hidden-mobile">
        <Button
          size="is-small"
          on:click={() => {
            cellsSection.scrollTop = 0; //scroll top
            fetchData("prepend");
          }}
          rounded
          iconRight="arrow-up">Prepend</Button>
        <Button
          size="is-small"
          on:click={() => {
            cellsSection.scrollTop = cellsSection.scrollHeight; //scroll bottom
            fetchData("append");
          }}
          rounded
          iconRight="arrow-down">Append</Button>
      </div>
    </div>
    <div class="column">
      <div style="position:relative;height:100%;">
        {#if exists(showingArticle.id)}
          <Button
            style="position: absolute;right: 2.5em; top:.5em; z-index:4;"
            size="is-small"
            on:click={() => {
              showingArticle = {};
            }}
            iconRight="times"
            rounded>關閉</Button>
          <div
            class="app-box"
            style="max-height: calc(100% - 83px);padding: 3px;
            background: #f0f0f0;">
            <ArticleDetail
              style="padding:3px"
              onArticleContentChanged={(content) => {
                timeline = timeline.map((v) => {
                  if (v.id == showingArticle.id) {
                    v.content = content;
                  }
                  return v;
                });
              }}
              onDelete={() => {
                timeline = timeline.filter((v) => v.id != showingArticle.id);
                showingArticle = {};
                if (profile.user.id == $myInfoStore.user.id) {
                  profile.user.article_count--;
                }
              }}
              article={showingArticle}
              replies={replies} />
          </div>
        {/if}

        <div
          style="
        width: 100%;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        padding: 3px;
        background: white;
        "
          class="app-box">
          <Postbox
            onSubmit={(txt) => {
              if (exists(showingArticle.id)) {
                return API.post("/post_reply", {
                  post_id: showingArticle.id,
                  content: txt,
                });
              } else {
                return API.post("/post_post", { content: txt });
              }
            }}
            placeholder={exists(showingArticle.id) ? "回覆Po" : "發新Po"}
            finishHandler={(content) => {
              if (exists(showingArticle.id)) {
                //reply
                refreshReplies(showingArticle.id);
              } else {
                //create
                if (currentChannel != "inbox") {
                  fetchData("prepend");
                }

                if (profile.user.id == $myInfoStore.user.id) {
                  profile.user.article_count++;
                }
              }
            }} />
        </div>
      </div>
    </div>
  </div>

  <div
    class="columns is-mobile is-variable is-1"
    style="position:fixed; top:0;left:3px;right:3px;margin:0">
    <div class="column is-2 is-hidden-mobile">
      <a href="/" use:link style="display:block;margin:.5em 0 0 .5em;color:#333"
        ><i
          class="fa fa-home"
          aria-hidden="false"
          style="filter: drop-shadow(2px 4px 6px white);" /></a>
    </div>
    <div class="column is-6">
      <div
        class="app-box thin"
        style="
      border:2px solid #CCC;border-radius:.3em;
      overflow:hidden;
      ">
        <div class="columnSwitcher" style="margin-left:.5em">
          {#if isMyself}
            <span
              on:click={() => {
                changeToTab("inbox");
              }}
              class:active={currentChannel == "inbox"}>
              <i class="fas fa-inbox" /> 進口
            </span>
          {/if}
          <span
            on:click={() => {
              changeToTab("outbox");
            }}
            class:active={currentChannel == "outbox"}>
            <i class="fas fa-newspaper" /> 出口
          </span>
          <span
            on:click={() => {
              changeToTab("public");
            }}
            class:active={currentChannel == "public"}
            ><i class="fas fa-water" /> 海洋
          </span>
          {#if $myUnreadIds.length > 0 || currentChannel == "updated"}
            <span
              on:click={() => {
                changeToTab("updated");
              }}
              style="color:red"
              class:active={currentChannel == "updated"}
              ><i class="fas fa-comment-dots" /> 未讀
            </span>
          {/if}
        </div>
        {#if isShowFilterBox}
          <div
            style="
          right: 0;
          float: right;clear:none">
            <input
              style="font-size: 13px;
            margin: 4px;
            border: 2px dotted #CCC;
            color: #333;"
              type="text"
              placeholder=""
              bind:value={rightSearchTerm}
              on:keypress={(e) => {
                if (e.key === "Enter") {
                  fetchData("fresh");
                }
              }}
              autocomplete="off" />
          </div>
        {:else}
          <div class="columnSwitcher" style="float:right;padding-right:3px">
            <span
              on:click={() => {
                markAllAsRead();
              }}
              ><i class="fas fa-check" /> 全部標記為已讀
            </span>
          </div>
        {/if}
        <div style="clear:both" />
      </div>
    </div>
    <div class="column">
      <div class="app-box thin small_nav" style="">
        <div
          class="dropdown is-right userMenu"
          class:is-active={isUserMenuShowing}>
          <div
            style="padding-right:1em;display: inline-block;cursor:pointer"
            class="dropdown-trigger"
            on:click={() => {
              isNotificationMenuShowing=false;
              isUserMenuShowing = !isUserMenuShowing;
            }}>
            <div
              style="cursor:pointer
              overflow: hidden;
              height: 24.25px;
              "
              aria-haspopup="true"
              aria-controls="dropdown-menu2">
              {#if $myInfoStore?.user?.avatar}
                <img
                  src={$myInfoStore?.user?.avatar}
                  alt="avatar"
                  style="border-radius:3px;width:20px" />
              {/if}
              <span>{$myInfoStore?.user?.display_name}</span>
            </div>
          </div>
          <div class="dropdown-menu" id="dropdown-menu2" role="menu">
            <div class="dropdown-content">
              <div
                class="dropdown-item"
                on:click={() => {
                  isSettingsShowing = true;
                }}>
                <i class="fa fa-cog" aria-hidden="true" alt="設定" />
                設定
              </div>
              <hr class="dropdown-divider" />
              <div class="dropdown-item">
                <a href="/logout" use:link
                  ><i class="fa fa-sign-out-alt" aria-hidden="true" /> Sign Out</a>
              </div>
            </div>
          </div>
        </div>

        <div
          class="dropdown is-right userMenu"
          class:is-active={isNotificationMenuShowing}>
          <i
            class="fa fa-bell dropdown-trigger"
            aria-hidden="true"
            on:click={() => {
              isUserMenuShowing=false;
              isNotificationMenuShowing = !isNotificationMenuShowing;
            }}
            on:open={() => {
              API.get("/notifications").then((res) => {
                notifications = res;
              });
            }} />
          <div class="dropdown-menu" id="dropdown-menu3" role="menu">
            <div class="dropdown-content">
              <div class="dropdown-item">
                {#if notifications.length > 0}
                  {#each notifications as v}
                    <a href={v.url} use:link>{v.message}</a>
                  {/each}
                {:else}
                  🤗沒有通知很棒棒
                {/if}
              </div>
            </div>
          </div>
        </div>

        <div>
          <i
            class="fa fa-search"
            aria-hidden="true"
            on:click={() => {
              showSearch = !showSearch;
            }} />
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  :root {
    --frame-height: calc(100vh - 43px);
    --box-background: #fefefe;
  }

  .columnSwitcher {
    float: left;
    font-size: 15px;
    color: gray;
    margin: 5px 2px;
  }
  .columnSwitcher span {
    color: gray;
    cursor: pointer;
    font-weight: normal;
  }
  .columnSwitcher .active {
    color: rgb(87, 109, 233);
  }
  .userMenu a {
    color: gray;
    font-size: 15px;
  }
  .small_nav {
    display: flex;
    padding: 0.3em;
    margin-bottom: 1.2em;
    top: 0px;
    z-index: 3;
    right: 0px;
    font-size: 15px;
    float: right;
  }
  .small_nav.left {
    right: unset;
    left: 0px;
    top: 0px;
    font-size: 18px;
    padding: 8px 0 0 6px;
  }
  .small_nav i {
    cursor: pointer;
  }

  .app-box {
    border: 2px solid #ccc;
    border-radius: 0.3em;
    background-color: var(--box-background);
  }
  .app-box.thin {
    height: 36px;
  }

  .small_nav i {
    color: dimgray;
    display: inline-block;
    padding: 5px 5px;
    height: 20px;
    vertical-align: top;
  }

  .dropdown-item {
    cursor: pointer;
  }
  .dropdown-trigger * {
    vertical-align: middle;
    text-align: center;
    color: inherit;
  }
  .column {
    padding-top: 3px;
    padding-bottom: 3px;
  }
  #media-player {
    top: 43px;
    left: 6px;
    bottom: 6px;
    z-index: 10;
    position: fixed;
    overflow: auto;
    background: white;
    text-align: center;
    border: #ccc 2px solid;
    border-radius: 3px;
    background: #000;
  }
  @media only screen and (max-width: 768px) {
    #media-player {
      width: auto;
      right: 6px;
    }
  }
  @media only screen and (min-width: 769px) {
    #media-player {
      width: calc(66.7% - 10px);
    }
  }
</style>
