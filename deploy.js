const execSync = require("child_process").execSync;

console.log("Building...");
execSync("npm run build");

console.log("Removing old files...");
const fs = require("fs");
const path = require("path");
//remove  public/build/bundle.js.map, ignore error
try {
  fs.unlinkSync(path.join(__dirname, "public/build/bundle.js.map"));
} catch (e) {
  //console.log(e);
}

console.log("Making new index.html ...");

//read string from public/index.html
const index = fs.readFileSync(
  path.join(__dirname, "public/index.html"),
  "utf8"
);

//current time in ISO, then replace -,T,:,Z,. with ''
const time = new Date().toISOString().replace(/-|T|:|\.|Z/g, "");

//get the integer after ?_= , and replace it with the current time
const index_time = index.replace(/\?_=\d+/, "?_=" + time);
//write the new index.html
fs.writeFileSync(path.join(__dirname, "public/index.html"), index_time);

console.log("Copying new files...");

//use node-scp
const { Client } = require("node-scp");
async function upload() {
  const client = await Client({
    host: "208.87.131.252",
    port: 22,
    username: "root",
    privateKey: fs.readFileSync("C:/Users/abby/.ssh/id_rsa"),
    // passphrase: 'your key passphrase',
  });

  await client.uploadDir("./public", "/home/wwwroot/m2np.com");
  //close the connection
  client.close();
}

//upload and check if upload() timeout
upload();
