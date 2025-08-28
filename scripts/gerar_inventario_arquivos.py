import json
import os

# Diretórios base
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ORGANIZED_DIR = os.path.join(BASE_DIR, "GlobalCoffee_Reorganizado")


# Função para listar arquivos recursivamente em um diretório
def list_files_recursive(base_path):
    file_list = []
    for root, dirs, files in os.walk(base_path):
        for name in files:
            full_path = os.path.join(root, name)
            rel_path = os.path.relpath(full_path, BASE_DIR)
            ext = os.path.splitext(name)[1].lower()
            file_list.append(
                {
                    "type": "file",
                    "name": name,
                    "extension": ext,
                    "current_location": rel_path.replace(os.sep, "/"),
                }
            )
        for name in dirs:
            full_path = os.path.join(root, name)
            rel_path = os.path.relpath(full_path, BASE_DIR)
            file_list.append(
                {
                    "type": "directory",
                    "name": name,
                    "extension": "",
                    "current_location": rel_path.replace(os.sep, "/"),
                }
            )
    return file_list


# Função para listar estrutura organizada para mapear destinos
def list_organized_structure():
    organized_paths = []
    for root, dirs, files in os.walk(ORGANIZED_DIR):
        for name in files:
            full_path = os.path.join(root, name)
            rel_path = os.path.relpath(full_path, ORGANIZED_DIR)
            organized_paths.append(rel_path.replace(os.sep, "/"))
        for name in dirs:
            full_path = os.path.join(root, name)
            rel_path = os.path.relpath(full_path, ORGANIZED_DIR)
            organized_paths.append(rel_path.replace(os.sep, "/") + "/")
    return organized_paths


# Função para propor destino baseado na estrutura organizada
def propose_destination(file_info, organized_paths):
    # Exemplo simples: se extensão for .md, destino pode ser 'GlobalCoffee_Reorganizado/1-Documentacao-Central/'
    ext = file_info["extension"]
    name = file_info["name"].lower()

    # Mapeamento básico por extensão
    if ext in [".md", ".txt"]:
        base_dest = "GlobalCoffee_Reorganizado/1-Documentacao-Central/"
    elif ext in [".py", ".js"]:
        base_dest = "GlobalCoffee_Reorganizado/2-Documentacao-Tecnica/Scripts/"
    elif ext in [".docx", ".pptx", ".html", ".css"]:
        base_dest = "GlobalCoffee_Reorganizado/4-Recursos/Apresentacoes/"
    elif ext in [".zip", ".json"]:
        base_dest = "GlobalCoffee_Reorganizado/dados/brutos/"
    else:
        base_dest = "GlobalCoffee_Reorganizado/outros/"

    # Ajuste para arquivos específicos por nome
    if "persona" in name:
        base_dest = "GlobalCoffee_Reorganizado/3-Por-Persona/"

    # Verifica se o destino existe na estrutura organizada
    # Se não existir, mantém base_dest
    # Poderia ser melhorado para mapear subpastas específicas

    return base_dest


def main():
    # Listar arquivos desorganizados (fora de GlobalCoffee_Reorganizado)
    all_files = list_files_recursive(BASE_DIR)
    disorganized_files = [
        f
        for f in all_files
        if not f["current_location"].startswith("GlobalCoffee_Reorganizado/")
    ]

    # Listar estrutura organizada
    organized_paths = list_organized_structure()

    # Criar inventário com destino proposto
    inventory = []
    for f in disorganized_files:
        dest = propose_destination(f, organized_paths)
        inventory.append(
            {
                "type": f["type"],
                "extension": f["extension"],
                "current_location": f["current_location"],
                "proposed_destination": dest,
            }
        )

    # Salvar inventário em JSON
    output_path = os.path.join(BASE_DIR, "inventario_globalcoffee.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(inventory, f, indent=2, ensure_ascii=False)

    print(f"Inventário gerado com {len(inventory)} itens em {output_path}")


if __name__ == "__main__":
    main()
