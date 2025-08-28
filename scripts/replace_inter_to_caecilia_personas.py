from docx import Document
from docx.oxml.ns import qn


def replace_inter_to_caecilia(doc_path):
    doc = Document(doc_path)
    changed = False
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            font_name = run.font.name
            if font_name and font_name.lower() == "inter":
                run.font.name = "Caecilia LT Std"
                r = run._element
                r.rPr.rFonts.set(qn("w:eastAsia"), "Caecilia LT Std")
                changed = True
    if changed:
        doc.save(doc_path)
        print("Document saved with font changes.")
    else:
        print("No 'Inter' fonts found to replace.")


if __name__ == "__main__":
    replace_inter_to_caecilia("Personas/Personas Produtor de Café.docx")
