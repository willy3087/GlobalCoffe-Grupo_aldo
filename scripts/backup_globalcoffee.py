#!/usr/bin/env python3
"""
Script de Backup Completo - GlobalCoffee
Cria backup completo antes da reorganização de documentos
"""

import hashlib
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path


def calculate_file_hash(filepath):
    """Calcula hash MD5 de um arquivo para verificação de integridade"""
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception as e:
        return f"ERRO: {str(e)}"


def create_backup(source_dir, backup_base_dir="backups"):
    """Cria backup completo com verificação de integridade"""

    # Timestamp para o backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = os.path.join(backup_base_dir, f"backup_globalcoffee_{timestamp}")

    print(f"=== BACKUP GLOBALCOFFEE ===")
    print(f"Timestamp: {timestamp}")
    print(f"Diretório origem: {source_dir}")
    print(f"Diretório destino: {backup_dir}")
    print("")

    # Criar diretório de backup
    try:
        os.makedirs(backup_dir, exist_ok=True)
        print("✓ Diretório de backup criado")
    except Exception as e:
        print(f"✗ Erro ao criar diretório de backup: {e}")
        return False

    # Inventário de arquivos
    inventory = {
        "timestamp": timestamp,
        "source_dir": source_dir,
        "backup_dir": backup_dir,
        "files": [],
        "directories": [],
        "errors": [],
        "statistics": {
            "total_files": 0,
            "total_directories": 0,
            "total_size_bytes": 0,
            "files_by_extension": {},
        },
    }

    # Arquivos e pastas a ignorar
    ignore_patterns = [
        ".DS_Store",
        "__pycache__",
        "*.pyc",
        ".git",
        "node_modules",
        "backups",  # Evitar backup do próprio backup
        "~$*",  # Arquivos temporários do Office
    ]

    def should_ignore(path):
        """Verifica se arquivo/pasta deve ser ignorado"""
        name = os.path.basename(path)
        for pattern in ignore_patterns:
            if pattern.startswith("*") and name.endswith(pattern[1:]):
                return True
            elif pattern == name:
                return True
        return False

    # Copiar estrutura completa
    print("\nCopiando arquivos...")
    files_copied = 0
    dirs_created = 0

    for root, dirs, files in os.walk(source_dir):
        # Filtrar diretórios a ignorar
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]

        # Criar estrutura de diretórios
        rel_path = os.path.relpath(root, source_dir)
        dest_dir = os.path.join(backup_dir, rel_path)

        if rel_path != ".":
            try:
                os.makedirs(dest_dir, exist_ok=True)
                inventory["directories"].append(rel_path)
                dirs_created += 1
            except Exception as e:
                inventory["errors"].append(
                    {"type": "directory", "path": rel_path, "error": str(e)}
                )

        # Copiar arquivos
        for file in files:
            if should_ignore(file):
                continue

            src_file = os.path.join(root, file)
            rel_file_path = os.path.relpath(src_file, source_dir)
            dest_file = os.path.join(backup_dir, rel_file_path)

            try:
                # Copiar arquivo
                shutil.copy2(src_file, dest_file)

                # Calcular hash para verificação
                src_hash = calculate_file_hash(src_file)
                dest_hash = calculate_file_hash(dest_file)

                # Obter informações do arquivo
                file_stat = os.stat(src_file)
                file_size = file_stat.st_size

                # Extensão do arquivo
                _, ext = os.path.splitext(file)
                ext = ext.lower() if ext else "sem_extensao"

                # Adicionar ao inventário
                inventory["files"].append(
                    {
                        "path": rel_file_path,
                        "size": file_size,
                        "extension": ext,
                        "src_hash": src_hash,
                        "dest_hash": dest_hash,
                        "hash_match": src_hash == dest_hash,
                    }
                )

                # Atualizar estatísticas
                inventory["statistics"]["total_size_bytes"] += file_size
                if ext not in inventory["statistics"]["files_by_extension"]:
                    inventory["statistics"]["files_by_extension"][ext] = 0
                inventory["statistics"]["files_by_extension"][ext] += 1

                files_copied += 1

                # Progresso
                if files_copied % 10 == 0:
                    print(f"  {files_copied} arquivos copiados...")

            except Exception as e:
                inventory["errors"].append(
                    {"type": "file", "path": rel_file_path, "error": str(e)}
                )

    # Atualizar estatísticas finais
    inventory["statistics"]["total_files"] = files_copied
    inventory["statistics"]["total_directories"] = dirs_created

    # Salvar inventário
    inventory_path = os.path.join(backup_dir, "inventory.json")
    try:
        with open(inventory_path, "w", encoding="utf-8") as f:
            json.dump(inventory, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Inventário salvo em: {inventory_path}")
    except Exception as e:
        print(f"\n✗ Erro ao salvar inventário: {e}")

    # Criar arquivo de log
    log_path = os.path.join(backup_dir, "backup_log.txt")
    try:
        with open(log_path, "w", encoding="utf-8") as f:
            f.write(f"BACKUP GLOBALCOFFEE - LOG\n")
            f.write(f"========================\n\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write(f"Diretório origem: {source_dir}\n")
            f.write(f"Diretório backup: {backup_dir}\n\n")
            f.write(f"ESTATÍSTICAS:\n")
            f.write(f"- Total de arquivos: {files_copied}\n")
            f.write(f"- Total de diretórios: {dirs_created}\n")
            f.write(
                f"- Tamanho total: {inventory['statistics']['total_size_bytes'] / (1024*1024):.2f} MB\n"
            )
            f.write(f"- Erros encontrados: {len(inventory['errors'])}\n\n")

            if inventory["errors"]:
                f.write("ERROS ENCONTRADOS:\n")
                for error in inventory["errors"]:
                    f.write(f"- [{error['type']}] {error['path']}: {error['error']}\n")

        print(f"✓ Log salvo em: {log_path}")
    except Exception as e:
        print(f"✗ Erro ao salvar log: {e}")

    # Resumo final
    print("\n=== RESUMO DO BACKUP ===")
    print(f"✓ Arquivos copiados: {files_copied}")
    print(f"✓ Diretórios criados: {dirs_created}")
    print(
        f"✓ Tamanho total: {inventory['statistics']['total_size_bytes'] / (1024*1024):.2f} MB"
    )

    if inventory["errors"]:
        print(f"⚠ Erros encontrados: {len(inventory['errors'])}")
        print("  Verifique o arquivo de log para detalhes")

    # Verificar integridade
    print("\nVerificando integridade...")
    integrity_errors = 0
    for file_info in inventory["files"]:
        if not file_info["hash_match"]:
            integrity_errors += 1
            print(f"✗ Hash não corresponde: {file_info['path']}")

    if integrity_errors == 0:
        print("✓ Todos os arquivos foram copiados corretamente!")
    else:
        print(f"✗ {integrity_errors} arquivos com problemas de integridade")

    print(f"\n✓ BACKUP COMPLETO: {backup_dir}")

    return backup_dir if integrity_errors == 0 else None


def main():
    """Função principal"""
    # Diretório atual do projeto
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    print("SISTEMA DE BACKUP - GLOBALCOFFEE")
    print("================================\n")

    # Confirmar com usuário
    print(f"Este script criará um backup completo de: {project_dir}")
    print("O backup será salvo em: ./backups/\n")

    # Verificar se há argumento --auto para pular confirmação
    auto_mode = "--auto" in sys.argv

    if not auto_mode:
        response = input("Deseja continuar? (s/n): ").lower()
        if response != "s":
            print("Backup cancelado.")
            return
    else:
        print("Modo automático ativado - prosseguindo com backup...\n")

    # Executar backup
    backup_path = create_backup(project_dir)

    if backup_path:
        print("\n✓ BACKUP CONCLUÍDO COM SUCESSO!")
        print(f"  Local: {backup_path}")
        print("\nVocê pode agora prosseguir com a reorganização dos documentos.")
    else:
        print("\n✗ BACKUP FALHOU! Não prossiga com a reorganização.")
        sys.exit(1)


if __name__ == "__main__":
    main()
