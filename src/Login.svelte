<script>
  import API from "./api/Api";
  import { navigate, useLocation, Link } from "svelte-navigator";
  import { warning } from "./components/Notification";
  import { userInfoStore } from "./stores";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  // const navigate = useNavigate();
  // const location = useLocation();
  onMount(() => {
    if ($userInfoStore) {
      navigate("/home");
    }
  });
  const login = () => {
    if (email == "" || password == "") {
      alert("fill in both");
    } else {
      API.post("/login", { email: email, password: password }).then((res) => {
        if (res.msg == "ok") {
          $userInfoStore = res.user;
          console.log($userInfoStore);
          localStorage.setItem("M2NP_TOKEN", res.token);
          // const from = ($location.state && $location.state.from) || "/home";
          navigate("/home");
        } else {
          warning("賬戶或密碼有誤。");
        }
      });
    }
  };
  const onKp = (e) => {
    if (e.key === "Enter") login();
  };
</script>

<h1>Login M2NP</h1>
<input
  on:keypress={onKp}
  type="email"
  placeholder="E-Mail"
  bind:value={email} />
<input
  on:keypress={onKp}
  type="password"
  placeholder="Password"
  bind:value={password} />
<button on:click={login}>Login</button>
<hr />
<Link to="/register">未有賬戶？按此登記。</Link><br />
<Link to="/reset_password">忘記密碼？按此重設。</Link>
