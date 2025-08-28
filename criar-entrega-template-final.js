import { WordMCP } from "word-mcp-server-client";
import fs from "fs";
import path from "path";

async function createDocument() {
  const client = new WordMCP();

  // Load the template
  const templatePath = path.resolve("./template.docx");
  await client.openDocument(templatePath);

  // Read the consolidated content file
  const contentPath = path.resolve(
    "./Documentacao_Consolidada_Alertas_Climaticos_Simplificados.md"
  );
  const content = fs.readFileSync(contentPath, "utf-8");

  // Split content into lines
  const lines = content.split(/\r?\n/);

  // Helper functions to detect markdown structure
  function isTitle(line) {
    return /^##\s/.test(line);
  }
  function isSubtitle(line) {
    return /^###\s/.test(line);
  }
  function isBullet(line) {
    return /^-\s/.test(line);
  }
  function isCodeBlockStart(line) {
    return /^```/.test(line);
  }

  let inCodeBlock = false;

  for (const line of lines) {
    if (isCodeBlockStart(line)) {
      inCodeBlock = !inCodeBlock;
      continue; // skip code block lines
    }
    if (inCodeBlock) continue; // skip code block content

    if (isTitle(line)) {
      const text = line.replace(/^##\s/, "").trim();
      await client.add_heading({
        filename: "template.docx",
        text,
        level: 2,
      });
    } else if (isSubtitle(line)) {
      const text = line.replace(/^###\s/, "").trim();
      await client.add_heading({
        filename: "template.docx",
        text,
        level: 3,
      });
    } else if (isBullet(line)) {
      const text = line.replace(/^- /, "").trim();
      await client.add_paragraph({
        filename: "template.docx",
        text: `• ${text}`,
      });
    } else {
      const text = line.trim();
      if (text.length > 0) {
        await client.add_paragraph({
          filename: "template.docx",
          text,
        });
      }
    }
  }

  // Save the final document with a new name
  await client.copy_document({
    source_filename: "template.docx",
    destination_filename: "entrega sprint 4 template.docx",
  });

  console.log("Documento de entrega criado com sucesso.");
}

createDocument().catch(console.error);
