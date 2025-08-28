import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertSvgToPng() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const svgPath = path.resolve(__dirname, "fluxo_sistema.svg");
  const svgUrl = "file://" + svgPath;

  await page.goto(svgUrl);

  // Ajustar viewport para o tamanho do SVG
  const svgElement = await page.$("svg");
  const boundingBox = await svgElement.boundingBox();

  await page.setViewport({
    width: Math.ceil(boundingBox.width),
    height: Math.ceil(boundingBox.height),
    deviceScaleFactor: 6, // para alta resolução maior
  });

  // Capturar screenshot do SVG
  const screenshotBuffer = await svgElement.screenshot({
    omitBackground: false,
  });

  const outputPath = path.resolve(__dirname, "fluxo_sistema_puppeteer.png");
  fs.writeFileSync(outputPath, screenshotBuffer);

  console.log("Conversão com Puppeteer concluída:", outputPath);

  await browser.close();
}

convertSvgToPng().catch(console.error);
