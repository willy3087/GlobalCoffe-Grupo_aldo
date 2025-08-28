from docx import Document
from docx.oxml.ns import qn


def replace_inter_font(doc_path, new_font):
    doc = Document(doc_path)
    changed = False
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            font_name = run.font.name
            if font_name and "inter" in font_name.lower():
                print(
                    f"Changing font from {font_name} to {new_font} in text: {run.text}"
                )
                run.font.name = new_font
                r = run._element
                r.rPr.rFonts.set(qn("w:eastAsia"), new_font)
                changed = True
    if changed:
        doc.save(doc_path)
        print("Document saved with font changes.")
    else:
        print("No 'Inter' fonts found to replace.")


if __name__ == "__main__":
    replace_inter_font(
        "Personas/Estruturas_de_Personas_updated.docx", "Caecilia LT Std"
    )
