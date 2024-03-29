export const BasicStickers = {
  "(p-joyful)": "38692e95e30abcd59898.gif",
  "(p-smile)": "6622935828514f94a04f.gif",
  "(p-tongue)": "28a8c933cf014dcd423a.gif",
  "(p-woot)": "3d5dd88acb198686283f.gif",
  "(p-wink)": "d52e817f51980ac5e06f.gif",
  "(p-sad)": "d5e7be5e4e2e02feed64.gif",
  "(p-surprised)": "1b07e99b3a2f2453192e.gif",
  "(p-angry)": "4050be0c3c86d606943f.gif",
  "(p-cry)": "c29b3bc4f134ad3418a8.gif",
  "(p-crying)": "b906941d869a0ee5e996.gif",
  "(p-laugh)": "7c86b00237142683b40b.gif",
  "(p-tears)": "7e69bc46313d6bfc9157.gif",
  "(p-wave)": "80955a97bcde85ba47fd.gif",
  "(p-blush)": "6f1dd445dc3e6b0934f3.gif",
  "(p-goodluck)": "2b47fd4026f061a9bec4.gif",
  "(p-hungry)": "87e48a9d3f3115736d60.gif",
  "(p-nerd)": "b72637e5aba38e279cb4.gif",
  "(p-stare)": "cdf4d85ffe4059ae63fd.gif",
  "(p-cool)": "e0d98dcf357870f37543.gif",
  "(p-doh)": "71186f036bb62e392088.gif",
  "(p-griltongue)": "fe629c5a9ed0f9240776.gif",
  "(p-mmm)": "2e9642968a3325d724b5.gif",
  "(p-rock)": "f7ba78844f036f465f69.gif",
  "(p-music)": "2e948ae7195e68b97ac5.gif",
  "(ooxx)": "8cdc3558e966508e150c.gif",
  "(p-sick)": "389369261e46e7b5bdad.gif",
  "(p-drinking)": "5b2022b62fbe9bededf6.gif",
  "(p-unsure)": "916db9f512a723f3c8ed.gif",
  "(candle)": "57db6fb886218eddaf95.gif",
  "(RIP)": "821e530331b97f1d49f6.gif",
  "(LOL)": "839bd0af2cb7d92ba651.gif",
  "(woot)": "a2222b2e2383bb7b7a8d.gif",
  "(K)": "5d46d9251d5eec2a2214.gif",
  "(angry)": "638945ed5ef6ca74dfd3.gif",
  "(annoyed)": "33ded221bc52845cd3c5.gif",
  "(wave)": "ff597919404d87e6ded3.gif",
  "(cozy)": "dc6d5d24d6eb0bd4c074.gif",
  "(sick)": "c7c806055d52998022f5.gif",
  "(goodluck)": "5873d5d21efbbd843fce.gif",
  "(griltongue)": "6588bf08df341d71bc90.png",
  "(mmm)": "f21b0111490d416e0f06.gif",
  "(hungry)": "e6ec17499e33956a1dff.gif",
  "(music)": "775713cc17fbc7c3df26.gif",
  "(tears)": "6b910901f860c63d0784.gif",
  "(tongue)": "d30843cc05e277db256b.gif",
  "(unsure)": "86e24900e41e286acfa6.gif",
  "(highfive)": "74720893ed4837dcf07f.gif",
  "(dance)": "1e940333bb38fc3c8c3c.gif",
  "(blush)": "8924117d7b11b5cec86e.gif",
};

export const BasicStickersUrlPrefix = "https://cdn0.m2np.com/file/kiyomi/smilies/";

// when npm run dev: "http://localhost";
// when npm run build: "https://dev.m2np.com";

let _apiHost = "https://dev.m2np.com";

if (process.env.NODE_ENV === "development") {
  _apiHost = "http://localhost:3000";
} else if (process.env.NODE_ENV === "production") {
  _apiHost = "https://dev.m2np.com";
} else {
  console.error("NODE_ENV is not set");
}

export const apiHost = _apiHost; 
export const apiDomain = `${apiHost}/v1`;
export const cometDomain = `${apiHost}/comet`;
