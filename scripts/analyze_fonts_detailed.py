from collections import defaultdict

from docx import Document


def analyze_fonts_detailed(doc_path):
    doc = Document(doc_path)
    font_usage = defaultdict(int)
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            font_name = run.font.name
            if font_name:
                font_usage[font_name.lower()] += 1
    return font_usage


if __name__ == "__main__":
    usage = analyze_fonts_detailed("Personas/Personas Produtor de Café.docx")
    for font, count in usage.items():
        print(f"Font: {font}, Count: {count}")
