<script>
    import API from "./api/Api";
    import { navigate, Link } from "svelte-routing";

    let email = "";
    let password = "";
    let message = "";
    let beforeReg = true;

    const register = () => {
        if (email == "" || password == "") {
            alert("fill in both");
        } else {
            API.post("/register", {
                email: email,
                password: password,
            }).then((res) => {
                if (res.msg == "duplicated") {
                    message = "email is already exists";
                }
                if (res.msg == "ok") {
                    beforeReg = false;
                }
            });
        }
    };
</script>

<h1>Register</h1>

{#if beforeReg}
    <div>{message}</div>
    <input type="email" placeholder="E-Mail" bind:value={email} />
    <input type="password" placeholder="Password" bind:value={password} />
    <button on:click={register}>Register</button>
{:else}
    Success.
    <Link to="/login">Click here to Login</Link>
{/if}
<hr />
<Link to="/login">Already Have An Account? Go to Login.</Link>
