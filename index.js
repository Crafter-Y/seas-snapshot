require("dotenv").config();
const Screenshotter = require("./instance");

//await new Promise((res) => setTimeout(res, 1000));

const main = async () => {
  const sc = new Screenshotter();
  await sc.init();

  await sc.capture("login");

  await sc.login();

  await sc.capture("board");

  sc.shutdown();
};
main();
