const puppeteer = require("puppeteer");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const HEADLESS = true;

const HEIGHT = 842;
const WIDTH = 596;

const BORDER = 50;

const TV_4K = {
  width: 3840,
  height: 2160,
};

const TV_WQHD = {
  width: 3440,
  height: 1440,
};

const TV_FHD = {
  width: 1920,
  height: 1080,
};

const TV_HD = {
  width: 1280,
  height: 720,
};

const GALAXY_S20 = {
  width: 360,
  height: 800,
  deviceScaleFactor: 4,
};

const IPHONE_11 = {
  width: 375,
  height: 812,
  deviceScaleFactor: 3,
};

const IPHONE_13_PRO_MAX = {
  width: 428,
  height: 926,
  deviceScaleFactor: 3,
};

const IPHONE_SE = {
  width: 375,
  height: 667,
  deviceScaleFactor: 2,
};

const GALAXY_S5 = {
  width: 360,
  height: 640,
  deviceScaleFactor: 3,
};

const PIXEL_2 = {
  width: 411,
  height: 731,
  deviceScaleFactor: 2,
};

class Screenshotter {
  /** @type {puppeteer.Browser} */
  #_browser;
  /** @type {puppeteer.Page} */
  #_page;
  /** @type {PDFKit.PDFDocument} */
  #_pdf;

  constructor() {
    if (!fs.existsSync("./imgen/")) {
      fs.mkdirSync("./imgen/");
    }
    fs.readdirSync("./imgen/").forEach((f) => fs.rmSync(`./imgen//${f}`));
  }

  async #_init_puppeteer() {
    this.#_browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: HEADLESS,
    });
    this.#_page = await this.#_browser.newPage();
    this.#_page.on("console", (message) =>
      console.log(
        `${message.type().substring(0, 3).toUpperCase()} ${message.text()}`
      )
    );
    await this.#_page.goto(`${process.env.BASE_URL}login`, {
      waitUntil: "networkidle2",
    });
  }

  async #_init_pdf() {
    this.#_pdf = new PDFDocument({ "page-size": "A4" });
    this.#_pdf.pipe(fs.createWriteStream("output.pdf"));

    this.#_pdf.image("./seas-icon.png", WIDTH / 2 - 25, undefined, {
      height: 50,
    });
    this.#_pdf.fontSize(60).text("   ");
    this.#_pdf.fontSize(11).text(new Date().toLocaleDateString("de"));
    this.#_pdf.fontSize(25).text("SEAS Kirchengemeinde Design");
    this.#_pdf.fontSize(13).text("   ");
    this.#_pdf
      .fontSize(14)
      .text("Dieses Dokument wurde automatisch generiert!");
    this.#_pdf
      .fontSize(14)
      .text("Diese Designs werden auf folgenden Plattformen verwendet:");
    this.#_pdf.fontSize(12).text("- Android");
    this.#_pdf.text("- iOS");
    this.#_pdf.text("- Web");

    this.#_pdf
      .fontSize(11)
      .text(
        `© (copyright) Helmut Haase 2022 - ${new Date().getFullYear()} • SEAS Kirchengemeinde UG (haftungsbeschränkt)`,
        BORDER,
        HEIGHT - 150
      );
  }

  async #_end_puppeteer() {
    await this.#_browser.close();
  }

  #_end_pdf() {
    this.#_pdf.end();
  }

  /** @param {string} slug */
  #_file_for_slug(slug) {
    return "./imgen/" + slug.replace("/", "-") + "-%SIZE%" + ".png";
  }

  async init() {
    await this.#_init_puppeteer();
    await this.#_init_pdf();
  }

  async shutdown() {
    this.#_end_pdf();
    if (HEADLESS) {
      await this.#_end_puppeteer();
    }
  }

  async login() {
    await this.#_page.type("input[type=email]", process.env.EMAIL);
    await this.#_page.type("input[type=password]", process.env.PASSWORD);

    await this.#_page.click('div[tabindex="0"]');
  }

  async press(query) {
    await this.#_page.click(query);
  }

  async pressX(query) {
    await this.#_page.locator(query).click();
  }

  async resetSize() {
    await this.#_page.setViewport(TV_FHD);
  }

  async back() {
    await this.#_page.goBack();
  }

  async clickCoords(x, y) {
    await this.#_page.mouse.click(x, y);
  }

  /** @param {string} slug */
  async capture(slug) {
    let filename = this.#_file_for_slug(slug);
    this.#_pdf.addPage();

    // TV 4K
    await this.#_page.setViewport(TV_4K);
    await this.#_page.screenshot({ path: filename.replace("%SIZE%", "TV_4K") });
    this.#_pdf.fontSize(11);
    this.#_pdf.text(slug + " - TV_4K", BORDER, BORDER);
    this.#_pdf.image(filename.replace("%SIZE%", "TV_4K"), BORDER, BORDER + 12, {
      width: WIDTH - 2 * BORDER,
    });

    // TV WQHD
    await this.#_page.setViewport(TV_WQHD);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "TV_WQHD"),
    });
    this.#_pdf.text(slug + " - TV_WQHD", BORDER, HEIGHT / 2);
    this.#_pdf.image(
      filename.replace("%SIZE%", "TV_WQHD"),
      BORDER,
      HEIGHT / 2 + 12,
      {
        width: WIDTH - 2 * BORDER,
      }
    );

    this.#_pdf
      .fontSize(11)
      .text(
        `© (copyright) Helmut Haase 2022 - ${new Date().getFullYear()} • SEAS Kirchengemeinde UG (haftungsbeschränkt)`,
        BORDER,
        HEIGHT - 150
      );

    this.#_pdf.addPage();

    // TV FHD
    await this.#_page.setViewport(TV_FHD);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "TV_FHD"),
    });
    this.#_pdf.text(slug + " - TV_FHD", BORDER, BORDER);
    this.#_pdf.image(
      filename.replace("%SIZE%", "TV_FHD"),
      BORDER,
      BORDER + 12,
      {
        width: WIDTH - 2 * BORDER,
      }
    );

    // TV HD
    await this.#_page.setViewport(TV_HD);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "TV_HD"),
    });
    this.#_pdf.text(slug + " - TV_HD", BORDER, HEIGHT / 2 - 12);
    this.#_pdf.image(filename.replace("%SIZE%", "TV_HD"), BORDER, HEIGHT / 2, {
      width: WIDTH - 2 * BORDER,
    });

    this.#_pdf
      .fontSize(11)
      .text(
        `© (copyright) Helmut Haase 2022 - ${new Date().getFullYear()} • SEAS Kirchengemeinde UG (haftungsbeschränkt)`,
        BORDER,
        HEIGHT - 135
      );

    this.#_pdf.addPage();

    // GALAXY_S20
    await this.#_page.setViewport(GALAXY_S20);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "GALAXY_S20"),
    });
    this.#_pdf.text(slug + " - GALAXY_S20", BORDER, BORDER);
    this.#_pdf.image(
      filename.replace("%SIZE%", "GALAXY_S20"),
      BORDER,
      BORDER + 12,
      {
        height: HEIGHT / 3 - BORDER,
      }
    );

    // IPHONE_11
    await this.#_page.setViewport(IPHONE_11);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "IPHONE_11"),
    });
    this.#_pdf.text(slug + " - IPHONE_11", WIDTH / 3, BORDER);
    this.#_pdf.image(
      filename.replace("%SIZE%", "IPHONE_11"),
      WIDTH / 3,
      BORDER + 12,
      {
        height: HEIGHT / 3 - BORDER,
      }
    );

    // IPHONE_13_PRO_MAX
    await this.#_page.setViewport(IPHONE_13_PRO_MAX);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "IPHONE_13_PRO_MAX"),
    });
    this.#_pdf.text(
      slug + " - IPHONE_13_PRO_MAX",
      (WIDTH / 3) * 2 - 20,
      BORDER
    );
    this.#_pdf.image(
      filename.replace("%SIZE%", "IPHONE_13_PRO_MAX"),
      (WIDTH / 3) * 2,
      BORDER + 12,
      {
        height: HEIGHT / 3 - BORDER,
      }
    );

    // IPHONE_SE
    await this.#_page.setViewport(IPHONE_SE);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "IPHONE_SE"),
    });
    this.#_pdf.text(slug + " - IPHONE_SE", BORDER, HEIGHT / 2);
    this.#_pdf.image(
      filename.replace("%SIZE%", "IPHONE_SE"),
      BORDER,
      HEIGHT / 2 + 12,
      {
        height: HEIGHT / 3 - BORDER,
      }
    );

    // GALAXY_S5
    await this.#_page.setViewport(GALAXY_S5);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "GALAXY_S5"),
    });
    this.#_pdf.text(slug + " - GALAXY_S5", WIDTH / 3, HEIGHT / 2);
    this.#_pdf.image(
      filename.replace("%SIZE%", "GALAXY_S5"),
      WIDTH / 3,
      HEIGHT / 2 + 12,
      {
        height: HEIGHT / 3 - BORDER,
      }
    );

    // PIXEL_2
    await this.#_page.setViewport(PIXEL_2);
    await this.#_page.screenshot({
      path: filename.replace("%SIZE%", "PIXEL_2"),
    });
    this.#_pdf.text(slug + " - PIXEL_2", (WIDTH / 3) * 2 - 20, HEIGHT / 2);
    this.#_pdf.image(
      filename.replace("%SIZE%", "PIXEL_2"),
      (WIDTH / 3) * 2,
      HEIGHT / 2 + 12,
      {
        height: HEIGHT / 3 - BORDER,
      }
    );

    this.#_pdf
      .fontSize(11)
      .text(
        `© (copyright) Helmut Haase 2022 - ${new Date().getFullYear()} • SEAS Kirchengemeinde UG (haftungsbeschränkt)`,
        BORDER,
        HEIGHT - 150
      );
  }
}

module.exports = Screenshotter;
