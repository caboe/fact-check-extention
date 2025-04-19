import type { Translation } from '../i18n-types';

const pt: Translation = {
	general: {
		title: 'Documentação da Extensão Fact Check'
	},
	home: {
		welcome: 'Bem-vindo à Documentação da {name}',
		introduction:
			'Este site fornece documentação completa sobre como instalar, configurar e usar a Extensão Fact Check para Chrome.'
	},
	nav: {
		installation: 'Instalação',
		configuration: 'Configuração',
		usage: 'Uso'
	},
	installation: {
		title: 'Instalação',
		web_store_heading: 'Instalar da Chrome Web Store',
		web_store_intro:
			'A maneira mais fácil de instalar a extensão é diretamente da Chrome Web Store.',
		web_store_link_text: 'Fact Checker GPT Connector na Chrome Web Store',
		developer_mode_heading: 'Instalar no Modo Desenvolvedor (do ZIP)',
		developer_mode_intro:
			'Se você deseja instalar uma versão específica ou contribuir para o desenvolvimento, pode instalar a extensão no modo desenvolvedor do Chrome usando um arquivo ZIP.',
		developer_mode_steps: {
			step1: 'Navegue até o diretório raiz da extensão no seu terminal.',
			step2:
				'Execute o comando de build: `{command}`. Isso gerará um arquivo `{zipFile}` no diretório `dist/`.',
			step3: 'Abra o Chrome e vá para `chrome://extensions/`.',
			step4: 'Habilite o "Modo desenvolvedor" usando o botão no canto superior direito.',
			step5: 'Clique no botão "Carregar sem compactação".',
			step6: 'Navegue até a pasta `dist/` dentro do diretório da extensão e selecione-a.',
			step7: 'A extensão agora deve aparecer na sua lista de extensões instaladas.'
		}
	},
	configuration: {
		title: 'Configuração',
		endpoints_heading: 'Pontos de Extremidade da API',
		endpoints_intro:
			'A extensão requer um ponto de extremidade da API para realizar verificações de fatos. Você pode configurar isso no popup da extensão.',
		endpoints_steps: {
			step1: 'Abra o popup da extensão clicando em seu ícone na barra de ferramentas do Chrome.',
			step2: 'Clique em "Ponto de Extremidade da API".',
			step3: 'Clique no botão "Novo Ponto de Extremidade".',
			step4:
				'Preencha os detalhes do seu ponto de extremidade da API. Você pode escolher um modelo para serviços comuns como Gemini, OpenAI, etc., ou inserir um URL personalizado.',
			step5: 'Insira sua Chave de API, se exigido pelo serviço.',
			step6: 'Clique em "adicionar" para salvar o ponto de extremidade.'
		},
		api_keys_heading: 'Obtendo Chaves de API',
		api_keys_intro:
			'Muitos serviços de API exigem uma chave de API para autenticação. Você precisará obter essa chave do provedor de serviços respectivo.',
		api_keys_advice:
			'Consulte a documentação oficial do serviço de API que você deseja usar para obter instruções sobre como obter uma chave de API.',
		ollama_heading: 'Usando uma Instância Local do Ollama',
		ollama_intro:
			'Você também pode usar uma instância local do Ollama como seu ponto de extremidade de verificação de fatos.',
		ollama_steps: {
			step1: 'Instale o Ollama em seu sistema seguindo a documentação oficial.',
			step2:
				'Uma vez que o Ollama esteja em execução, adicione um novo ponto de extremidade na configuração da extensão.',
			step3:
				'Para a URL, insira o endereço local da sua instância do Ollama, tipicamente `{ollamaUrl}`.',
			step4: 'Selecione o modelo apropriado, se solicitado.',
			step5: 'Salve o ponto de extremidade.'
		}
	},
	usage: {
		title: 'Uso',
		select_text_heading: 'Selecionando Texto',
		select_text_intro:
			'Para verificar fatos em texto, basta selecionar o texto desejado em qualquer página da web.',
		select_image_heading: 'Selecionando Imagens',
		select_image_intro:
			'Para verificar fatos em uma imagem, clique com o botão direito do mouse na imagem e selecione a opção da extensão (se disponível e suportada pelo ponto de extremidade configurado).',
		select_ui_heading: 'Usando o Popup da Extensão',
		select_ui_intro:
			'Alternativamente, você pode abrir o popup da extensão e inserir texto manualmente ou selecionar uma imagem através da interface fornecida.'
	}
};

export default pt;
