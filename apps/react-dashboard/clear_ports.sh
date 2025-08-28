#!/bin/bash

# Script de Liberação de Portas para Projeto React
# DevOps Automation Tool - Port Management
# ================================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Portas padrão do projeto
PORTS=(3000 3001 8080)

# Função para imprimir cabeçalho
print_header() {
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     🚀 DevOps Port Manager - Liberação de Portas     ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Data/Hora:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${YELLOW}Sistema:${NC} $(uname -s) $(uname -m)"
    echo ""
}

# Função para verificar e liberar porta
check_and_kill_port() {
    local port=$1
    local processes=$(lsof -ti :$port 2>/dev/null)
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📍 Verificando porta $port...${NC}"
    
    if [ -z "$processes" ]; then
        echo -e "  ${GREEN}✅ Porta $port está livre!${NC}"
        return 0
    fi
    
    echo -e "  ${RED}⚠️  Porta $port em uso!${NC}"
    
    # Obter informações detalhadas do processo
    for pid in $processes; do
        if [ -n "$pid" ]; then
            # Tentar obter nome do processo
            proc_name=$(ps -p $pid -o comm= 2>/dev/null || echo "Unknown")
            proc_cmd=$(ps -p $pid -o command= 2>/dev/null | head -c 100 || echo "Unknown command")
            
            echo -e "  ${YELLOW}├─ PID:${NC} $pid"
            echo -e "  ${YELLOW}├─ Processo:${NC} $proc_name"
            echo -e "  ${YELLOW}└─ Comando:${NC} $proc_cmd"
            
            # Tentar finalizar o processo gentilmente primeiro
            echo -e "  ${YELLOW}🔄 Finalizando processo $pid...${NC}"
            
            # Primeiro tenta SIGTERM (finalização gentil)
            if kill -TERM $pid 2>/dev/null; then
                sleep 1
                # Verifica se o processo ainda existe
                if ! kill -0 $pid 2>/dev/null; then
                    echo -e "  ${GREEN}✅ Processo $pid finalizado com sucesso (SIGTERM)${NC}"
                else
                    # Se ainda existe, força com SIGKILL
                    if kill -KILL $pid 2>/dev/null; then
                        echo -e "  ${YELLOW}⚡ Processo $pid forçado a parar (SIGKILL)${NC}"
                    else
                        echo -e "  ${RED}❌ Erro ao finalizar processo $pid${NC}"
                    fi
                fi
            else
                echo -e "  ${RED}❌ Sem permissão para finalizar processo $pid${NC}"
                echo -e "  ${YELLOW}💡 Tente executar com sudo se necessário${NC}"
            fi
        fi
    done
    
    # Verificar se a porta foi liberada
    sleep 1
    if [ -z "$(lsof -ti :$port 2>/dev/null)" ]; then
        echo -e "  ${GREEN}✅ Porta $port liberada com sucesso!${NC}"
        return 0
    else
        echo -e "  ${RED}⚠️  Porta $port ainda pode estar em uso${NC}"
        return 1
    fi
}

# Função para gerar relatório
generate_report() {
    local freed_ports=()
    local failed_ports=()
    
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                  📊 RELATÓRIO FINAL                   ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Verificar status final de cada porta
    for port in "${PORTS[@]}"; do
        if [ -z "$(lsof -ti :$port 2>/dev/null)" ]; then
            freed_ports+=($port)
            echo -e "  ${GREEN}✅ Porta $port: LIVRE${NC}"
        else
            failed_ports+=($port)
            echo -e "  ${RED}❌ Porta $port: AINDA EM USO${NC}"
        fi
    done
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Resumo
    echo -e "${YELLOW}📈 Resumo da Operação:${NC}"
    echo -e "  • Portas verificadas: ${#PORTS[@]}"
    echo -e "  • Portas liberadas: ${GREEN}${#freed_ports[@]}${NC}"
    echo -e "  • Portas com falha: ${RED}${#failed_ports[@]}${NC}"
    
    if [ ${#failed_ports[@]} -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}⚠️  Atenção:${NC}"
        echo -e "  Algumas portas não puderam ser liberadas."
        echo -e "  Execute o script com ${YELLOW}sudo${NC} se necessário:"
        echo -e "  ${BLUE}sudo bash clear_ports.sh${NC}"
    else
        echo ""
        echo -e "${GREEN}🎉 Sucesso!${NC} Todas as portas estão livres."
        echo -e "  Você pode iniciar seu projeto React agora."
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Operação concluída em:${NC} $(date '+%H:%M:%S')"
    echo ""
}

# Função principal
main() {
    print_header
    
    echo -e "${YELLOW}🔍 Iniciando verificação e liberação de portas...${NC}"
    echo ""
    
    # Processar cada porta
    for port in "${PORTS[@]}"; do
        check_and_kill_port $port
        echo ""
    done
    
    # Gerar relatório final
    generate_report
}

# Executar script
main