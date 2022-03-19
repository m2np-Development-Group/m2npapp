<section class="hero is-primary is-fullheight">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
          <div class="box">
            <slot name="main" />
          </div>
          <slot name="bottom" />
        </div>
      </div>
    </div>
  </div>
</section>

<div
  style="
position: fixed;
right: 1em;
bottom: .5em;
color: white;
font-size: 2em;
opacity: 0.7;
font-weight: lighter;
text-decoration: overline;
-webkit-user-select: none;
user-select: none;
"
>
  m2np v20220320
</div>
