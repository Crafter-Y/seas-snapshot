require("dotenv").config();
const Screenshotter = require("./instance");

//await new Promise((res) => setTimeout(res, 1000));

const main = async () => {
  const sc = new Screenshotter();
  await sc.init();

  await sc.capture("login");

  await sc.login();
  await new Promise((res) => setTimeout(res, 1000));

  await sc.capture("board");

  await sc.press('::-p-xpath(//*[text()="Plan 2"])');
  await sc.capture("dense-board");

  await sc.press('::-p-xpath(//*[text()="Plan with a really long name"])');
  await sc.capture("long-title-board");

  await sc.resetSize();
  await sc.pressX("text/Jahresansicht");
  await sc.capture("yearly-board");

  await sc.press('::-p-xpath(//*[text()="Plan 5"])');
  await sc.press('::-p-xpath(//*[text()="-"])');
  await sc.capture("boardrow");
  await sc.back();

  await sc.resetSize();
  await sc.press(
    '::-p-xpath(//*[@id="root"]/div/div/div/div/div/div/div/div/div[2]/div/div/div[1]/div/div[2]/button[1]/div/div/div/img)'
  ); // calendar icon
  await sc.capture("calendar");
  await sc.back();

  await sc.resetSize();
  await sc.press(
    '::-p-xpath(//*[@id="root"]/div/div/div/div/div/div/div/div/div[2]/div/div/div[1]/div/div[2]/button[2]/div/div/div/img)'
  ); // print icon
  await sc.capture("print-1");

  await sc.press('::-p-xpath(//*[text()="Weiter"])');
  await sc.capture("print-2");

  await sc.press('::-p-xpath(//*[text()="Dense 1"])');
  await sc.press('::-p-xpath(//*[text()="Dense 2"])');
  await sc.press('::-p-xpath(//*[text()="Dense 3"])');
  await sc.press('::-p-xpath(//*[text()="Weiter"])');
  await sc.capture("print-3");
  await sc.back();

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Passwort ändern"])');
  await sc.capture("pwreset");
  await sc.back();

  await sc.press(
    '::-p-xpath(//*[@id="root"]/div/div/div/div/div/div/div/div/div[2]/div/div/div[1]/div/button/div/div/div/img)'
  ); // settings icon
  await sc.capture("mobile-context");
  await sc.clickCoords(0, 0);

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Einstellungen"])');
  await sc.capture("settings");

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Mitglieder verwalten"])');
  await sc.capture("se-users");

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Spalten verwalten"])');
  await sc.capture("se-cols");

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Termine verwalten"])');
  await sc.capture("se-events");

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Kommentarvorlagen"])');
  await sc.capture("se-co-template");

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Pläne verwalten"])');
  await sc.capture("se-pages");

  await sc.resetSize();
  await sc.press('::-p-xpath(//*[text()="Module verwalten"])');
  await sc.capture("se-modules");

  sc.shutdown();
};
try {
  main();
} catch (e) {
  console.error(e);
}
