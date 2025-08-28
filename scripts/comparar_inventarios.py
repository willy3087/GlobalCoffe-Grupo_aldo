import json


def load_inventory(path):
    with open(path, "r", encoding="utf-8") as f:
        return set(json.load(f))


def main():
    original = load_inventory("inventario_original.json")
    reorganized = load_inventory("inventario_reorganizado.json")

    lost_files = original - reorganized
    new_files = reorganized - original
    common_files = original & reorganized

    report = {
        "total_original": len(original),
        "total_reorganized": len(reorganized),
        "lost_files_count": len(lost_files),
        "new_files_count": len(new_files),
        "common_files_count": len(common_files),
        "lost_files_sample": list(lost_files)[:10],
        "new_files_sample": list(new_files)[:10],
    }

    with open("relatorio_comparacao.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print("Relatório de comparação gerado: relatorio_comparacao.json")


if __name__ == "__main__":
    main()
