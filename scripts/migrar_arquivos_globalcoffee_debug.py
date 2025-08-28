#!/usr/bin/env python3
"""
Script de migração de arquivos do GlobalCoffee com DEBUG detalhado
Versão com logging extensivo para diagnóstico
"""

import hashlib
import json
import os
import shutil
import sys
import traceback
from datetime import datetime

# Nome do arquivo de log de debug
DEBUG_LOG_FILE = "debug_migracao.log"


def log_debug(message, level="INFO"):
    """Registra mensagem no arquivo de log com timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    log_entry = f"[{timestamp}] [{level}] {message}\n"

    # Imprime no console
    print(log_entry.strip())

    # Escreve no arquivo
    try:
        with open(DEBUG_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(log_entry)
    except Exception as e:
        print(f"ERRO ao escrever no log: {e}")


def verificar_ambiente():
    """Verifica o ambiente antes de iniciar a migração"""
    log_debug("=== VERIFICAÇÃO DO AMBIENTE ===")

    # Diretório atual
    log_debug(f"Diretório atual: {os.getcwd()}")

    # Versão do Python
    log_debug(f"Versão do Python: {sys.version}")

    # Arquivo de inventário
    inventario_path = "inventario_globalcoffee.json"
    if os.path.exists(inventario_path):
        log_debug(f"Arquivo de inventário encontrado: {inventario_path}")
        stat = os.stat(inventario_path)
        log_debug(f"  - Tamanho: {stat.st_size} bytes")
        log_debug(f"  - Modificado em: {datetime.fromtimestamp(stat.st_mtime)}")

        # Tenta ler primeiros bytes
        try:
            with open(inventario_path, "rb") as f:
                first_bytes = f.read(100)
                log_debug(f"  - Primeiros 100 bytes: {first_bytes}")
        except Exception as e:
            log_debug(f"  - ERRO ao ler primeiros bytes: {e}", "ERROR")
    else:
        log_debug(f"ARQUIVO DE INVENTÁRIO NÃO ENCONTRADO: {inventario_path}", "ERROR")
        return False

    # Diretório de destino
    destino = "GlobalCoffee_Reorganizado"
    if os.path.exists(destino):
        log_debug(f"Diretório de destino já existe: {destino}")
        # Lista conteúdo
        try:
            conteudo = os.listdir(destino)
            log_debug(f"  - Conteúdo: {len(conteudo)} itens")
            for item in conteudo[:10]:  # Primeiros 10 itens
                log_debug(f"    - {item}")
        except Exception as e:
            log_debug(f"  - ERRO ao listar conteúdo: {e}", "ERROR")
    else:
        log_debug(f"Diretório de destino não existe: {destino}")

    return True


def carregar_inventario():
    """Carrega o inventário de arquivos do GlobalCoffee com DEBUG"""
    inventario_path = "inventario_globalcoffee.json"
    log_debug(f"Tentando carregar inventário de: {inventario_path}")

    try:
        if not os.path.exists(inventario_path):
            log_debug(f"ERRO: Arquivo não existe: {inventario_path}", "ERROR")
            return None

        tamanho = os.path.getsize(inventario_path)
        log_debug(f"Tamanho do arquivo: {tamanho} bytes")

        if tamanho == 0:
            log_debug("ERRO: Arquivo está vazio", "ERROR")
            return None

        with open(inventario_path, "r", encoding="utf-8") as f:
            log_debug("Arquivo aberto com sucesso")

            # Lê conteúdo bruto
            conteudo = f.read()
            log_debug(f"Conteúdo lido: {len(conteudo)} caracteres")

            # Mostra primeiros caracteres
            preview = conteudo[:200].replace("\n", "\\n")
            log_debug(f"Preview do conteúdo: {preview}...")

            # Tenta fazer parse do JSON
            log_debug("Tentando fazer parse do JSON...")
            inventario = json.loads(conteudo)

            log_debug(f"JSON parseado com sucesso! Tipo: {type(inventario)}")

            # Verifica estrutura
            if isinstance(inventario, dict):
                log_debug(f"Chaves no inventário: {list(inventario.keys())}")

                if "arquivos" in inventario:
                    arquivos = inventario["arquivos"]
                    log_debug(
                        f"Lista de arquivos encontrada. Total: {len(arquivos)} arquivos"
                    )

                    if len(arquivos) == 0:
                        log_debug("AVISO: Lista de arquivos está vazia!", "WARNING")
                    else:
                        # Mostra primeiro arquivo como exemplo
                        log_debug("Exemplo do primeiro arquivo:")
                        log_debug(json.dumps(arquivos[0], indent=2))
                else:
                    log_debug(
                        "ERRO: Chave 'arquivos' não encontrada no inventário", "ERROR"
                    )
                    return None
            else:
                log_debug(
                    f"ERRO: Inventário não é um dicionário, é: {type(inventario)}",
                    "ERROR",
                )
                return None

            return inventario

    except json.JSONDecodeError as e:
        log_debug(f"ERRO ao fazer parse do JSON: {e}", "ERROR")
        log_debug(f"Posição do erro: linha {e.lineno}, coluna {e.colno}", "ERROR")
        return None
    except Exception as e:
        log_debug(f"ERRO ao carregar inventário: {type(e).__name__}: {e}", "ERROR")
        log_debug(f"Stack trace:\n{traceback.format_exc()}", "ERROR")
        return None


def calcular_md5(filepath):
    """Calcula o hash MD5 de um arquivo com DEBUG"""
    log_debug(f"Calculando MD5 de: {filepath}", "DEBUG")

    try:
        if not os.path.exists(filepath):
            log_debug(f"Arquivo não existe: {filepath}", "WARNING")
            return None

        tamanho = os.path.getsize(filepath)
        log_debug(f"Tamanho do arquivo: {tamanho} bytes", "DEBUG")

        md5_hash = hashlib.md5()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                md5_hash.update(chunk)

        hash_value = md5_hash.hexdigest()
        log_debug(f"MD5 calculado: {hash_value}", "DEBUG")
        return hash_value

    except Exception as e:
        log_debug(f"ERRO ao calcular MD5 de {filepath}: {e}", "ERROR")
        return None


def mapear_categoria(caminho_original):
    """Mapeia o arquivo para a categoria apropriada com DEBUG"""
    log_debug(f"Mapeando categoria para: {caminho_original}", "DEBUG")

    # Normaliza o caminho
    caminho = caminho_original.lower().replace("\\", "/")

    # Regras de mapeamento baseadas na análise
    if "transcri" in caminho or "transcrições" in caminho:
        categoria = "documentacao/transcricoes"
    elif "dados" in caminho and "brutos" in caminho:
        categoria = "dados/brutos"
    elif "apresenta" in caminho:
        categoria = "documentacao/apresentacoes"
    elif "persona" in caminho:
        categoria = "documentacao/personas"
    elif "diagrama" in caminho:
        categoria = "documentacao/diagramas"
    elif "pesquisa" in caminho and "mercado" in caminho:
        categoria = "documentacao/pesquisa_mercado"
    elif "empresa" in caminho or "contato" in caminho:
        categoria = "documentacao/contatos"
    elif "técnico" in caminho or "tecnico" in caminho:
        categoria = "documentacao/tecnicos"
    elif "particular" in caminho:
        categoria = "documentacao/particular"
    elif any(
        ext in caminho_original.lower() for ext in [".py", ".js", ".html", ".css"]
    ):
        categoria = "codigo"
    elif any(
        ext in caminho_original.lower() for ext in [".md", ".txt", ".doc", ".pdf"]
    ):
        categoria = "documentacao"
    elif any(
        ext in caminho_original.lower()
        for ext in [".jpg", ".png", ".gif", ".mp4", ".avi"]
    ):
        categoria = "midia"
    elif any(ext in caminho_original.lower() for ext in [".xlsx", ".xls", ".csv"]):
        categoria = "dados"
    else:
        categoria = "outros"

    log_debug(f"Categoria mapeada: {categoria}", "DEBUG")
    return categoria


def criar_estrutura_diretorios(base_dir):
    """Cria a estrutura de diretórios para reorganização com DEBUG"""
    log_debug(f"Criando estrutura de diretórios em: {base_dir}")

    estrutura = [
        "documentacao",
        "documentacao/transcricoes",
        "documentacao/apresentacoes",
        "documentacao/personas",
        "documentacao/diagramas",
        "documentacao/pesquisa_mercado",
        "documentacao/contatos",
        "documentacao/tecnicos",
        "documentacao/particular",
        "dados",
        "dados/brutos",
        "codigo",
        "midia",
        "outros",
        "duplicados",
    ]

    for pasta in estrutura:
        caminho_pasta = os.path.join(base_dir, pasta)
        try:
            os.makedirs(caminho_pasta, exist_ok=True)
            log_debug(f"  ✓ Criado: {caminho_pasta}")
        except Exception as e:
            log_debug(f"  ✗ ERRO ao criar {caminho_pasta}: {e}", "ERROR")


def migrar_arquivo(arquivo_info, destino_base, arquivos_processados):
    """Migra um arquivo para o novo local com DEBUG detalhado"""
    caminho_original = arquivo_info["caminho_original"]
    nome = arquivo_info["nome"]
    md5_original = arquivo_info.get("md5", "")

    log_debug(f"\n--- Processando arquivo: {nome} ---")
    log_debug(f"Caminho original: {caminho_original}")
    log_debug(f"MD5 original: {md5_original}")

    try:
        # Verifica se arquivo existe
        if not os.path.exists(caminho_original):
            log_debug(f"Arquivo não encontrado: {caminho_original}", "WARNING")
            return {
                "status": "erro",
                "arquivo": nome,
                "erro": "Arquivo não encontrado",
                "caminho_original": caminho_original,
            }

        # Calcula MD5 atual
        md5_atual = calcular_md5(caminho_original)
        log_debug(f"MD5 atual: {md5_atual}")

        if md5_atual is None:
            log_debug("Não foi possível calcular MD5", "WARNING")
            return {
                "status": "erro",
                "arquivo": nome,
                "erro": "Não foi possível calcular MD5",
                "caminho_original": caminho_original,
            }

        # Verifica se é duplicado
        if md5_atual in arquivos_processados:
            log_debug(f"Arquivo duplicado detectado!", "INFO")
            log_debug(f"Original já processado: {arquivos_processados[md5_atual]}")

            # Move para pasta de duplicados
            pasta_duplicados = os.path.join(destino_base, "duplicados")
            novo_nome = f"{os.path.splitext(nome)[0]}_{md5_atual[:8]}{os.path.splitext(nome)[1]}"
            caminho_destino = os.path.join(pasta_duplicados, novo_nome)

            # Evita sobrescrever
            contador = 1
            while os.path.exists(caminho_destino):
                novo_nome = f"{os.path.splitext(nome)[0]}_{md5_atual[:8]}_{contador}{os.path.splitext(nome)[1]}"
                caminho_destino = os.path.join(pasta_duplicados, novo_nome)
                contador += 1

            log_debug(f"Movendo duplicado para: {caminho_destino}")
            shutil.copy2(caminho_original, caminho_destino)

            return {
                "status": "duplicado",
                "arquivo": nome,
                "caminho_original": caminho_original,
                "caminho_destino": caminho_destino,
                "md5": md5_atual,
                "original_de": arquivos_processados[md5_atual],
            }

        # Mapeia categoria
        categoria = mapear_categoria(caminho_original)
        pasta_destino = os.path.join(destino_base, categoria)

        # Define caminho de destino
        caminho_destino = os.path.join(pasta_destino, nome)

        # Evita sobrescrever
        contador = 1
        nome_base = os.path.splitext(nome)[0]
        extensao = os.path.splitext(nome)[1]
        while os.path.exists(caminho_destino):
            novo_nome = f"{nome_base}_{contador}{extensao}"
            caminho_destino = os.path.join(pasta_destino, novo_nome)
            contador += 1

        log_debug(f"Copiando para: {caminho_destino}")

        # Copia o arquivo
        shutil.copy2(caminho_original, caminho_destino)

        # Verifica integridade
        md5_destino = calcular_md5(caminho_destino)
        if md5_destino != md5_atual:
            log_debug("ERRO: MD5 não corresponde após cópia!", "ERROR")
            return {
                "status": "erro",
                "arquivo": nome,
                "erro": "Falha na verificação de integridade",
                "caminho_original": caminho_original,
                "md5_esperado": md5_atual,
                "md5_obtido": md5_destino,
            }

        # Registra arquivo processado
        arquivos_processados[md5_atual] = caminho_destino

        log_debug("Arquivo migrado com sucesso!", "SUCCESS")

        return {
            "status": "sucesso",
            "arquivo": nome,
            "caminho_original": caminho_original,
            "caminho_destino": caminho_destino,
            "categoria": categoria,
            "md5": md5_atual,
            "md5_verificado": md5_destino == md5_atual,
        }

    except Exception as e:
        log_debug(f"ERRO ao migrar arquivo: {type(e).__name__}: {e}", "ERROR")
        log_debug(f"Stack trace:\n{traceback.format_exc()}", "ERROR")
        return {
            "status": "erro",
            "arquivo": nome,
            "erro": str(e),
            "caminho_original": caminho_original,
        }


def gerar_relatorio(resultados, tempo_total):
    """Gera relatórios da migração com DEBUG"""
    log_debug("\n=== GERANDO RELATÓRIOS ===")

    # Estatísticas
    total_arquivos = len(resultados)
    sucesso = sum(1 for r in resultados if r["status"] == "sucesso")
    duplicados = sum(1 for r in resultados if r["status"] == "duplicado")
    erros = sum(1 for r in resultados if r["status"] == "erro")

    log_debug(f"Total de arquivos: {total_arquivos}")
    log_debug(f"Sucesso: {sucesso}")
    log_debug(f"Duplicados: {duplicados}")
    log_debug(f"Erros: {erros}")

    # Relatório JSON
    relatorio_json = {
        "data_migracao": datetime.now().isoformat(),
        "tempo_total_segundos": tempo_total,
        "estatisticas": {
            "total_arquivos": total_arquivos,
            "sucesso": sucesso,
            "duplicados": duplicados,
            "erros": erros,
        },
        "resultados": resultados,
    }

    try:
        with open("relatorio_migracao.json", "w", encoding="utf-8") as f:
            json.dump(relatorio_json, f, indent=2, ensure_ascii=False)
        log_debug("✓ Relatório JSON gerado: relatorio_migracao.json")
    except Exception as e:
        log_debug(f"✗ ERRO ao gerar relatório JSON: {e}", "ERROR")

    # Relatório Markdown
    try:
        with open("RELATORIO-MIGRACAO-GLOBALCOFFEE.md", "w", encoding="utf-8") as f:
            f.write(f"# Relatório de Migração - GlobalCoffee\n\n")
            f.write(
                f"**Data da migração:** {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n"
            )
            f.write(f"**Tempo total:** {tempo_total:.2f} segundos\n\n")

            f.write(f"## Resumo\n\n")
            f.write(f"- **Total de arquivos processados:** {total_arquivos}\n")
            f.write(f"- **Migrados com sucesso:** {sucesso}\n")
            f.write(f"- **Duplicados encontrados:** {duplicados}\n")
            f.write(f"- **Erros:** {erros}\n\n")

            if erros > 0:
                f.write(f"## Arquivos com Erro\n\n")
                for r in resultados:
                    if r["status"] == "erro":
                        f.write(f"- **{r['arquivo']}**\n")
                        f.write(f"  - Erro: {r['erro']}\n")
                        f.write(f"  - Caminho: {r['caminho_original']}\n\n")

            if duplicados > 0:
                f.write(f"## Arquivos Duplicados\n\n")
                for r in resultados:
                    if r["status"] == "duplicado":
                        f.write(f"- **{r['arquivo']}**\n")
                        f.write(f"  - MD5: {r['md5']}\n")
                        f.write(f"  - Original: {r['original_de']}\n\n")

        log_debug("✓ Relatório Markdown gerado: RELATORIO-MIGRACAO-GLOBALCOFFEE.md")
    except Exception as e:
        log_debug(f"✗ ERRO ao gerar relatório Markdown: {e}", "ERROR")


def main():
    """Função principal com DEBUG extensivo"""
    tempo_inicio = datetime.now()

    try:
        # Limpa log anterior
        if os.path.exists(DEBUG_LOG_FILE):
            os.remove(DEBUG_LOG_FILE)

        log_debug("=== INICIANDO SCRIPT DE MIGRAÇÃO COM DEBUG ===")
        log_debug(f"Horário de início: {tempo_inicio}")

        # Verifica ambiente
        if not verificar_ambiente():
            log_debug("Falha na verificação do ambiente. Abortando.", "ERROR")
            return

        # Carrega inventário
        inventario = carregar_inventario()
        if not inventario:
            log_debug("Falha ao carregar inventário. Abortando.", "ERROR")
            return

        # Extrai lista de arquivos
        arquivos = inventario.get("arquivos", [])
        if not arquivos:
            log_debug("Nenhum arquivo encontrado no inventário. Abortando.", "ERROR")
            return

        log_debug(f"\nTotal de arquivos a processar: {len(arquivos)}")

        # Cria estrutura de diretórios
        destino_base = "GlobalCoffee_Reorganizado"
        criar_estrutura_diretorios(destino_base)

        # Processa arquivos
        log_debug("\n=== INICIANDO MIGRAÇÃO DOS ARQUIVOS ===")
        resultados = []
        arquivos_processados = {}  # MD5 -> caminho destino

        for i, arquivo in enumerate(arquivos, 1):
            log_debug(f"\nProcessando arquivo {i}/{len(arquivos)}")
            resultado = migrar_arquivo(arquivo, destino_base, arquivos_processados)
            resultados.append(resultado)

        # Calcula tempo total
        tempo_fim = datetime.now()
        tempo_total = (tempo_fim - tempo_inicio).total_seconds()

        log_debug(f"\n=== MIGRAÇÃO CONCLUÍDA ===")
        log_debug(f"Tempo total: {tempo_total:.2f} segundos")

        # Gera relatórios
        gerar_relatorio(resultados, tempo_total)

        log_debug("\n=== SCRIPT FINALIZADO COM SUCESSO ===")

    except Exception as e:
        log_debug(f"\n=== ERRO FATAL NO SCRIPT ===", "ERROR")
        log_debug(f"Tipo: {type(e).__name__}", "ERROR")
        log_debug(f"Mensagem: {e}", "ERROR")
        log_debug(f"Stack trace:\n{traceback.format_exc()}", "ERROR")


if __name__ == "__main__":
    main()
