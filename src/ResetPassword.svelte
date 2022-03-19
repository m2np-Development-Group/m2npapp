<script>
  import API from "./utils/Api";
  import { navigate, useLocation, Link } from "svelte-navigator";
  import { Warning } from "./lib/Notification";
  import { myInfoStore } from "./stores";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  // const navigate = useNavigate();
  // const location = useLocation();
  onMount(() => {
    if ($myInfoStore) {
      navigate("/home");
    }
  });
  const reset = () => {
    if (trim(email) == "") {
      invalidEmailMessage = "Cannot be empty";
    } else if (password == "") {
      invalidPasswordMessage = "Cannot be empty";
    } else {
      API.post("/reset-password", { email: email, password: password })
        .then((res) => {
          if (res.msg == "ok") {
            Warning("請去檢查一下郵箱以進行下一步。");
          } else {
            Warning("賬戶或密碼有誤。");
          }
        })
        .catch((e) => {
          Warning(JSON.stringify(e));
        });
    }
  };
  const onKp = (e) => {
    // console.log(e.srcElement.checkValidity())
    if (e.key === "Enter") login();
  };
  let emailInput;
  let invalidEmailMessage;
  let invalidPasswordMessage;
</script>

<section class="hero is-info">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">Reset Password?</h1>
      <h2 class="subtitle">mm... it sometimes happens.</h2>
    </div>
  </div>
</section>
<div style="padding:1em">
  <a href="/reset-pw">按我進入重設用的臨時頁面</a>
  <hr />
  <Link to="/register">未有賬戶？按此登記。</Link><br />
  <Link to="/login">突然記起？按此登入。</Link><br />
</div>
