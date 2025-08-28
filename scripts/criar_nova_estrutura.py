#!/usr/bin/env python3
"""
Script para criar a nova estrutura de diretórios do GlobalCoffee
Baseado na proposta de reorganização aprovada
"""

import json
import os
from datetime import datetime


def criar_estrutura_diretorios():
    """Cria a nova estrutura de diretórios conforme proposta"""

    # Diretório base para a nova estrutura
    base_dir = "GlobalCoffee_Reorganizado"

    print("=== CRIANDO NOVA ESTRUTURA DE DIRETÓRIOS ===")
    print(f"Diretório base: {base_dir}\n")

    # Estrutura completa conforme proposta
    estrutura = {
        "1-Documentacao-Central": {
            "Visao-Geral": {},
            "Especificacoes": {},
            "Guias": {},
        },
        "2-Documentacao-Tecnica": {
            "Arquitetura": {},
            "APIs": {},
            "Banco-de-Dados": {},
            "Integracao": {},
            "Scripts": {},
        },
        "3-Por-Persona": {
            "Fornecedor": {"Especificacoes": {}, "Fluxos": {}, "Interfaces": {}},
            "Compradores": {"Especificacoes": {}, "Fluxos": {}, "Interfaces": {}},
            "Cooperativa": {"Especificacoes": {}, "Fluxos": {}, "Interfaces": {}},
            "Trader": {"Especificacoes": {}, "Fluxos": {}, "Interfaces": {}},
        },
        "4-Recursos": {
            "Templates": {},
            "Exemplos": {},
            "Referencias": {},
            "Diagramas": {},
            "Apresentacoes": {},
        },
        "archive": {"versoes-antigas": {}, "documentos-obsoletos": {}},
        "temp": {"em-processamento": {}, "rascunhos": {}},
    }

    # Criar diretórios
    diretorios_criados = []

    def criar_diretorios_recursivo(caminho_atual, estrutura_atual):
        """Cria diretórios recursivamente"""
        for nome_dir, subestrutua in estrutura_atual.items():
            caminho_completo = os.path.join(caminho_atual, nome_dir)

            try:
                os.makedirs(caminho_completo, exist_ok=True)
                diretorios_criados.append(caminho_completo)
                print(f"✓ Criado: {caminho_completo}")

                # Criar README.md em cada diretório principal
                if caminho_atual == base_dir:
                    readme_path = os.path.join(caminho_completo, "README.md")
                    criar_readme(readme_path, nome_dir)

                # Recursão para subdiretórios
                if subestrutua:
                    criar_diretorios_recursivo(caminho_completo, subestrutua)

            except Exception as e:
                print(f"✗ Erro ao criar {caminho_completo}: {e}")

    # Criar diretório base
    try:
        os.makedirs(base_dir, exist_ok=True)
        print(f"✓ Diretório base criado: {base_dir}")
    except Exception as e:
        print(f"✗ Erro ao criar diretório base: {e}")
        return False

    # Criar estrutura completa
    criar_diretorios_recursivo(base_dir, estrutura)

    # Criar arquivo de log da estrutura
    log_estrutura = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "base_dir": base_dir,
        "total_diretorios": len(diretorios_criados),
        "diretorios": diretorios_criados,
        "estrutura": estrutura,
    }

    log_path = os.path.join(base_dir, "estrutura_criada.json")
    try:
        with open(log_path, "w", encoding="utf-8") as f:
            json.dump(log_estrutura, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Log da estrutura salvo em: {log_path}")
    except Exception as e:
        print(f"\n✗ Erro ao salvar log: {e}")

    print(f"\n=== RESUMO ===")
    print(f"✓ Total de diretórios criados: {len(diretorios_criados)}")
    print(f"✓ Estrutura base criada em: {base_dir}")

    return base_dir


def criar_readme(caminho, nome_diretorio):
    """Cria arquivo README.md com descrição do diretório"""

    descricoes = {
        "1-Documentacao-Central": """# Documentação Central

Este diretório contém a documentação principal do projeto GlobalCoffee.

## Subdiretórios:
- **Visao-Geral**: Documentos de visão geral, conceitos e introdução ao sistema
- **Especificacoes**: Especificações técnicas e funcionais detalhadas
- **Guias**: Guias de uso, instalação e manutenção
""",
        "2-Documentacao-Tecnica": """# Documentação Técnica

Documentação técnica detalhada para desenvolvedores e equipe técnica.

## Subdiretórios:
- **Arquitetura**: Diagramas e documentos de arquitetura do sistema
- **APIs**: Documentação de APIs e interfaces
- **Banco-de-Dados**: Esquemas, modelos e documentação de banco de dados
- **Integracao**: Documentação de integrações com sistemas externos
- **Scripts**: Documentação e exemplos de scripts utilitários
""",
        "3-Por-Persona": """# Documentação por Persona

Documentação organizada por tipo de usuário do sistema.

## Personas:
- **Fornecedor**: Produtores e fornecedores de café
- **Compradores**: Compradores e importadores
- **Cooperativa**: Gestores e administradores de cooperativas
- **Trader**: Traders e intermediários do mercado

Cada persona possui:
- Especificações específicas
- Fluxos de trabalho
- Interfaces dedicadas
""",
        "4-Recursos": """# Recursos

Recursos auxiliares e materiais de apoio.

## Subdiretórios:
- **Templates**: Modelos e templates reutilizáveis
- **Exemplos**: Exemplos práticos e casos de uso
- **Referencias**: Materiais de referência e links úteis
- **Diagramas**: Diagramas e visualizações
- **Apresentacoes**: Apresentações e materiais de treinamento
""",
        "archive": """# Archive

Diretório de arquivamento para versões antigas e documentos obsoletos.

## Subdiretórios:
- **versoes-antigas**: Versões anteriores de documentos
- **documentos-obsoletos**: Documentos não mais utilizados mas mantidos para referência
""",
        "temp": """# Temporário

Diretório para arquivos temporários e trabalhos em andamento.

## Subdiretórios:
- **em-processamento**: Documentos sendo processados ou migrados
- **rascunhos**: Rascunhos e versões preliminares
""",
    }

    conteudo = descricoes.get(
        nome_diretorio, f"# {nome_diretorio}\n\nDiretório: {nome_diretorio}"
    )

    try:
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(conteudo)
    except Exception as e:
        print(f"  Erro ao criar README em {caminho}: {e}")


def main():
    """Função principal"""
    print("CRIAÇÃO DA NOVA ESTRUTURA - GLOBALCOFFEE")
    print("=========================================\n")

    # Criar estrutura
    nova_estrutura = criar_estrutura_diretorios()

    if nova_estrutura:
        print("\n✓ ESTRUTURA CRIADA COM SUCESSO!")
        print("Próximo passo: executar migração dos arquivos")
    else:
        print("\n✗ ERRO NA CRIAÇÃO DA ESTRUTURA!")


if __name__ == "__main__":
    main()
