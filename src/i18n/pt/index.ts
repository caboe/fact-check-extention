import type { BaseTranslation } from '../i18n-types'

const pt = {
	introduction: `Esta ferramenta foi desenvolvida para ajudar você a verificar informações na internet de forma mais rápida e avaliar melhor a credibilidade dos textos.</p>
<p>Configure uma GPT que irá realizar a verificação de fatos.</p>
<><strong>Observação importante:</strong> Embora esta extensão seja baseada em IA avançada, ela não é infalível. A inteligência artificial pode, em alguns casos, 'alucinar', ou seja, fornecer informações falsas ou enganosas. Por isso, é importante questionar criticamente os resultados e, em caso de dúvida, fazer pesquisas adicionais, especialmente se os resultados parecerem inesperados ou 'suspeitos.' Sempre veja os resultados da verificação de fatos como um primeiro ponto de referência e não como a verdade definitiva. Use a extensão como um suporte para sua própria análise crítica das informações.`,
	letsGo: 'Vamos lá!',
	markedText: 'Texto marcado ({wordCount:number} palavras)' as `${string}{wordCount}${string}`,
	apiEndpoint: 'Endpoint da API',
	configureApi: 'Configurar',
	factCheck: 'Verificação de fatos',
	response: 'Resposta',
	responseLength:
		'Comprimento da resposta aprox. {responseLength: number} palavras' as `${string}{responseLength}${string}`,
	apiCta: 'Verificar',
	result: 'Resultado',
	checkingProgress: 'Verificando...',
	copy: 'Copiar',
	configuredEndpoints: 'Endpoints configurados',
	newEndpoint: 'Novo endpoint',
	darkMode: 'Dark Mode',
	title: 'Título',
	titelPlaceholder: 'Exemplo: API de verificação de fatos',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'Chave da API',
	apiKeyPlaceholder: 'Sua chave da API',
	cancel: 'Cancelar',
	add: 'Adicionar',
	updateEndpoint: 'Atualizar endpoint',
	noConfiguredEndpoints: 'Nenhum endpoint configurado',
	selectedText: 'Digite o texto diretamente ou selecione na página.',
	notChecked: 'Não verificado',
	enterText: 'Digite o texto aqui.',
	personLabel: 'Responder no estilo desta pessoa (opcional)',
	personPlaceholder: 'Edgar Allan Poe',
	chooseTemplate: 'Escolha um modelo (opcional)',
	choose: 'Escolher ...',
	endpointExists: 'Já existe um endpoint com este nome.',
	saveAnyway: 'Nenhuma chave API fornecida, salvar mesmo assim?',
	fieldsMissing: 'Por favor, preencha todos os campos.',
	copied: 'Resultado copiado para a área de transferência!',
	copyError: 'Erro ao copiar: {error:string}' as `${string}{error}${string}`,
	fillAllFieldsAlert: 'Por favor, preencha todos os campos',
	selectText: 'Selecionar texto',
	resetSelection: 'Reiniciar seleção',
	imageSelected: 'Imagem selecionada',
	selectImage: 'Selecionar imagem',
	pleaseSelectImage: 'Por favor selecione uma imagem.',
	selectTextOrImage: 'Selecionar texto ou imagem',
	canProcessImages: 'Pode processar imagens?',
	noImageEndpoint: 'Nenhum endpoint configurado suporta análise de imagem.',
	configureButton: 'Configurar',
	defaultPerson: 'Cientista crítico',
	useShortRoleLabel:
		'Usar papel de sistema curto. Isso pode ajudar se o contexto do modelo for muito curto, por exemplo, para textos longos enviados para Ollama',
	rolePlacementLabel: 'Papel',
	rolePlacementSystem: 'Mensagem do sistema',
	rolePlacementInline: 'Em linha na mensagem do usuário',
	inlineUserMessage: 'System Prompt em linha (recomendado para Ollama)',
	contextPlaceholder:
		'Fornecer contexto adicional para ajudar na verificação de fatos (ex. período de tempo, localização, alegações específicas para focar)...',
	// Role Configuration
	roleConfiguration: 'Configuração de Papéis',
	basicRoles: 'Papéis Básicos (Somente leitura)',
	customRoles: 'Papéis Personalizados',
	builtIn: 'Integrado',
	createFromThis: 'Criar a partir disto',
	addRole: 'Adicionar Papel',
	addNewRole: 'Adicionar Novo Papel',
	roleName: 'Nome do papel',
	roleDescription: `Descrição do papel e instruções.
Exemplo:

Sua persona é o filósofo Immanuel Kant.
1. Tom: Rigoroso, complexo e moralmente severo. Use estruturas de frases densas do século XVIII.
2. Método: Não apenas verifique os fatos; analise se a afirmação do usuário segue o "Imperativo Categórico" (Lei Universal).
3. Foco: Rejeite falsidades não apenas como incorretas, mas como uma violação da Razão ("Vernunft").`,
	saveRole: 'Salvar',
	cancelRole: 'Cancelar',
	copyRole: 'Copiar',
	noCustomRoles: 'Nenhum papel personalizado criado ainda. Clique em "Adicionar Papel" para criar seu primeiro papel personalizado.',
	deleteRoleConfirm: 'Tem certeza de que deseja excluir este papel?',
	createFromTemplate: 'Criar papel personalizado a partir deste modelo',
	createFromExisting: 'Criar novo papel a partir deste modelo',
	scientistName: 'Cientista',
	satiristName: 'Racionalista Acerbo',
} satisfies BaseTranslation

export default pt
