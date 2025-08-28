from docx import Document
from docx.oxml.ns import qn


def replace_inter_font(doc_path, new_font):
    doc = Document(doc_path)
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            if run.font.name and run.font.name.lower() == "inter":
                run.font.name = new_font
                r = run._element
                r.rPr.rFonts.set(qn("w:eastAsia"), new_font)
    doc.save(doc_path)


if __name__ == "__main__":
    replace_inter_font(
        "Personas/Estruturas_de_Personas_updated.docx", "Caecilia LT Std"
    )
