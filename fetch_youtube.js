const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function fetchYoutubeHomepage() {
    console.log('Iniciando fetch da página inicial do YouTube...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport e user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('Navegando para YouTube...');
        await page.goto('https://www.youtube.com', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        // Aguardar conteúdo principal carregar
        await page.waitForSelector('ytd-rich-item-renderer', { timeout: 10000 });
        
        console.log('Extraindo informações da página...');
        
        // Extrair dados da página
        const pageData = await page.evaluate(() => {
            const data = {
                title: document.title,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                videos: [],
                trending: [],
                categories: []
            };
            
            // Extrair vídeos recomendados
            const videoElements = document.querySelectorAll('ytd-rich-item-renderer');
            videoElements.forEach((element, index) => {
                if (index < 20) { // Limitar a 20 vídeos
                    const titleElement = element.querySelector('#video-title');
                    const channelElement = element.querySelector('ytd-channel-name a');
                    const viewsElement = element.querySelector('#metadata-line span:first-child');
                    const timeElement = element.querySelector('#metadata-line span:last-child');
                    const thumbnailElement = element.querySelector('img#img');
                    const linkElement = element.querySelector('a#thumbnail');
                    
                    if (titleElement && channelElement) {
                        data.videos.push({
                            title: titleElement.textContent.trim(),
                            channel: channelElement.textContent.trim(),
                            views: viewsElement ? viewsElement.textContent.trim() : 'N/A',
                            uploadTime: timeElement ? timeElement.textContent.trim() : 'N/A',
                            thumbnail: thumbnailElement ? thumbnailElement.src : '',
                            link: linkElement ? 'https://www.youtube.com' + linkElement.getAttribute('href') : ''
                        });
                    }
                }
            });
            
            // Extrair categorias do menu lateral (se disponível)
            const categoryElements = document.querySelectorAll('ytd-guide-entry-renderer');
            categoryElements.forEach((element) => {
                const titleElement = element.querySelector('yt-formatted-string');
                if (titleElement) {
                    const categoryName = titleElement.textContent.trim();
                    if (categoryName && !categoryName.includes('Mais do YouTube')) {
                        data.categories.push(categoryName);
                    }
                }
            });
            
            return data;
        });
        
        // Tirar screenshot
        console.log('Capturando screenshot...');
        await page.screenshot({ 
            path: 'youtube_homepage_screenshot.png',
            fullPage: false
        });
        
        // Salvar dados em JSON
        await fs.writeFile('youtube_homepage_data.json', JSON.stringify(pageData, null, 2));
        
        // Criar relatório em Markdown
        const markdownReport = `# YouTube Homepage Fetch Report

## Informações Gerais
- **URL**: ${pageData.url}
- **Título**: ${pageData.title}
- **Data/Hora do Fetch**: ${pageData.timestamp}
- **Total de Vídeos Capturados**: ${pageData.videos.length}

## Vídeos Recomendados

${pageData.videos.map((video, index) => `
### ${index + 1}. ${video.title}
- **Canal**: ${video.channel}
- **Visualizações**: ${video.views}
- **Publicado**: ${video.uploadTime}
- **Link**: ${video.link}
`).join('\n')}

## Categorias Disponíveis
${pageData.categories.length > 0 ? pageData.categories.map(cat => `- ${cat}`).join('\n') : 'Nenhuma categoria capturada'}

## Arquivos Gerados
- \`youtube_homepage_data.json\` - Dados estruturados em JSON
- \`youtube_homepage_screenshot.png\` - Screenshot da página
- \`youtube_homepage_report.md\` - Este relatório
`;
        
        await fs.writeFile('youtube_homepage_report.md', markdownReport);
        
        console.log('\n✅ Fetch concluído com sucesso!');
        console.log('📁 Arquivos gerados:');
        console.log('   - youtube_homepage_data.json');
        console.log('   - youtube_homepage_screenshot.png');
        console.log('   - youtube_homepage_report.md');
        
        return pageData;
        
    } catch (error) {
        console.error('❌ Erro durante o fetch:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    fetchYoutubeHomepage()
        .then(data => {
            console.log(`\n📊 Resumo: ${data.videos.length} vídeos capturados`);
            process.exit(0);
        })
        .catch(error => {
            console.error('Erro fatal:', error);
            process.exit(1);
        });
}

module.exports = fetchYoutubeHomepage;