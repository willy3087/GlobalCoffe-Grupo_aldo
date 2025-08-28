const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputPath = path.resolve(__dirname, "diagrama_completo.svg");
const outputPath = path.resolve(__dirname, "diagrama_completo.png");

async function convertSvgToPng() {
  try {
    const svgBuffer = fs.readFileSync(inputPath);
    await sharp(svgBuffer)
      .png({ quality: 100 })
      .resize(4665) // largura para alta resolução, altura ajusta proporcionalmente
      .toFile(outputPath);
    console.log("Conversão concluída:", outputPath);
  } catch (error) {
    console.error("Erro na conversão:", error);
  }
}

convertSvgToPng();
