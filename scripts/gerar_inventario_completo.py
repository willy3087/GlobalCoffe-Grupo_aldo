import json
import os
from datetime import datetime

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
REORGANIZED_DIR = os.path.join(BASE_DIR, "GlobalCoffee_Reorganizado")
TRANSCRICOES_DIR = os.path.join(BASE_DIR, "Trancrições")


def list_files_recursive(base_path, base_dir):
    file_list = []
    for root, dirs, files in os.walk(base_path):
        for name in files:
            full_path = os.path.join(root, name)
            rel_path = os.path.relpath(full_path, base_dir)
            file_list.append(rel_path.replace(os.sep, "/"))
        for name in dirs:
            full_path = os.path.join(root, name)
            rel_path = os.path.relpath(full_path, base_dir)
            file_list.append(rel_path.replace(os.sep, "/") + "/")
    return file_list


def processar_transcricoes():
    """Processa a pasta de transcrições e retorna informações detalhadas"""
    transcricoes_info = {
        "pasta_principal": "Trancrições",
        "data_processamento": datetime.now().isoformat(),
        "arquivos": [],
        "total_arquivos": 0,
        "tipos_arquivo": {}
    }
    
    if not os.path.exists(TRANSCRICOES_DIR):
        transcricoes_info["erro"] = "Pasta de transcrições não encontrada"
        return transcricoes_info
    
    for root, dirs, files in os.walk(TRANSCRICOES_DIR):
        for arquivo in files:
            caminho_completo = os.path.join(root, arquivo)
            caminho_relativo = os.path.relpath(caminho_completo, BASE_DIR)
            
            # Obter informações do arquivo
            try:
                stat_info = os.stat(caminho_completo)
                extensao = os.path.splitext(arquivo)[1].lower()
                
                info_arquivo = {
                    "nome": arquivo,
                    "caminho": caminho_relativo.replace(os.sep, "/"),
                    "extensao": extensao,
                    "tamanho_bytes": stat_info.st_size,
                    "tamanho_mb": round(stat_info.st_size / (1024 * 1024), 2),
                    "data_modificacao": datetime.fromtimestamp(stat_info.st_mtime).isoformat(),
                    "pasta_pai": os.path.basename(root) if root != TRANSCRICOES_DIR else "raiz"
                }
                
                transcricoes_info["arquivos"].append(info_arquivo)
                
                # Contar tipos de arquivo
                if extensao in transcricoes_info["tipos_arquivo"]:
                    transcricoes_info["tipos_arquivo"][extensao] += 1
                else:
                    transcricoes_info["tipos_arquivo"][extensao] = 1
                    
            except OSError as e:
                print(f"Erro ao processar arquivo {arquivo}: {e}")
    
    transcricoes_info["total_arquivos"] = len(transcricoes_info["arquivos"])
    return transcricoes_info


def main():
    print("🚀 Iniciando geração do inventário completo...")
    
    # Listar estrutura original (arquivos fora de GlobalCoffee_Reorganizado)
    print("📁 Processando arquivos originais...")
    original_files = []
    for item in os.listdir(BASE_DIR):
        item_path = os.path.join(BASE_DIR, item)
        if item != "GlobalCoffee_Reorganizado":
            original_files.extend(list_files_recursive(item_path, BASE_DIR))

    # Listar estrutura reorganizada (arquivos dentro de GlobalCoffee_Reorganizado)
    print("📂 Processando arquivos reorganizados...")
    reorganized_files = list_files_recursive(REORGANIZED_DIR, BASE_DIR)
    
    # Processar transcrições
    print("🎤 Processando transcrições...")
    transcricoes_info = processar_transcricoes()
    
    # Criar inventário completo com todas as informações
    inventario_completo = {
        "metadata": {
            "data_geracao": datetime.now().isoformat(),
            "versao_script": "2.0",
            "descricao": "Inventário completo do projeto GlobalCoffee incluindo transcrições"
        },
        "estrutura_original": {
            "total_arquivos": len(original_files),
            "arquivos": sorted(original_files)
        },
        "estrutura_reorganizada": {
            "total_arquivos": len(reorganized_files),
            "arquivos": sorted(reorganized_files)
        },
        "transcricoes": transcricoes_info,
        "resumo": {
            "total_arquivos_originais": len(original_files),
            "total_arquivos_reorganizados": len(reorganized_files),
            "total_transcricoes": transcricoes_info.get("total_arquivos", 0),
            "tipos_transcricoes": transcricoes_info.get("tipos_arquivo", {})
        }
    }

    # Salvar inventários em JSON
    with open(
        os.path.join(BASE_DIR, "inventario_original.json"), "w", encoding="utf-8"
    ) as f:
        json.dump(sorted(original_files), f, indent=2, ensure_ascii=False)

    with open(
        os.path.join(BASE_DIR, "inventario_reorganizado.json"), "w", encoding="utf-8"
    ) as f:
        json.dump(sorted(reorganized_files), f, indent=2, ensure_ascii=False)
        
    # Salvar inventário completo com transcrições
    with open(
        os.path.join(BASE_DIR, "inventario_completo_com_transcricoes.json"), "w", encoding="utf-8"
    ) as f:
        json.dump(inventario_completo, f, indent=2, ensure_ascii=False)

    print("\n✅ Inventários gerados com sucesso!")
    print(f"📄 inventario_original.json ({len(original_files)} arquivos)")
    print(f"📄 inventario_reorganizado.json ({len(reorganized_files)} arquivos)")
    print(f"📄 inventario_completo_com_transcricoes.json (inventário detalhado)")
    print(f"🎤 Transcrições processadas: {transcricoes_info.get('total_arquivos', 0)} arquivos")
    
    if transcricoes_info.get('tipos_arquivo'):
        print("\n📊 Tipos de arquivo de transcrição encontrados:")
        for ext, count in transcricoes_info['tipos_arquivo'].items():
            print(f"   {ext}: {count} arquivo(s)")


if __name__ == "__main__":
    main()
