import type { BaseTranslation } from '../i18n-types'

const es = {
	introduction: `Esta herramienta está diseñada para ayudarte a verificar la información en la web de manera más rápida y a evaluar mejor la credibilidad de los textos.</p>
	<p>Configura una GPT que realice la verificación de hechos.</p>
	<p><strong>Nota importante:</strong> Aunque esta extensión se basa en inteligencia artificial avanzada, no es infalible. La inteligencia artificial puede a veces 'alucinar', es decir, proporcionar información falsa o engañosa. Por lo tanto, es importante cuestionar críticamente los resultados y, en caso de duda, realizar investigaciones adicionales, especialmente si los resultados parecen inesperados o 'sospechosos.' Considera siempre los resultados de la verificación de hechos como un primer punto de referencia y no como la verdad definitiva. Utiliza la extensión como un apoyo para tu propio examen crítico de la información.</p>`,
	letsGo: '¡Vamos!',
	markedText: 'Texto marcado ({wordCount:number} palabras)' as `${string}{wordCount}${string}`,
	apiEndpoint: 'Punto final de la API',
	configureApi: 'Modelo',
	factCheck: 'Verificación de hechos',
	response: 'Respuesta',
	responseLength:
		'Longitud de la respuesta aprox. {responseLength: number} palabras' as `${string}{responseLength}${string}`,
	apiCta: 'Verificar',
	result: 'Resultado',
	checkingProgress: 'Cargando...',
	thinking: 'Pensando...',
	finished: 'Terminado',
	copy: 'Copiar',
	configuredEndpoints: 'Puntos finales configurados',
	newEndpoint: 'Nuevo punto final',
	darkMode: 'Dark Mode',
	title: 'Título',
	titelPlaceholder: 'Ejemplo: API de verificación de hechos',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'Clave de API',
	apiKeyPlaceholder: 'Su clave de API',
	cancel: 'Cancelar',
	add: 'Añadir',
	updateEndpoint: 'Actualizar punto final',
	noConfiguredEndpoints: 'No se han añadido puntos finales hasta ahora',
	selectedText: 'Introducir texto directamente o seleccionar en la página.',
	notChecked: 'No verificado',
	enterText: 'Ingrese el texto aquí.',
	personLabel: 'Responder en el estilo de esta persona (opcional)',
	personPlaceholder: 'Edgar Allan Poe',
	chooseTemplate: 'Elige una plantilla (opcional)',
	choose: 'Elegir ...',
	endpointExists: 'Ya existe un endpoint con este nombre.',
	saveAnyway: 'No se proporcionó clave API, ¿guardar de todos modos?',
	fieldsMissing: 'Por favor, complete todos los campos.',
	copied: 'Resultado copiado al portapapeles!',
	copyError: 'Error al copiar: {error:string}' as `${string}{error}${string}`,
	fillAllFieldsAlert: 'Por favor, completa todos los campos',
	selectText: 'Seleccionar texto',
	resetSelection: 'Reiniciar selección',
	imageSelected: 'Imagen seleccionada',
	selectImage: 'Seleccionar imagen',
	pleaseSelectImage: 'Por favor seleccione una imagen.',
	selectTextOrImage: 'Seleccionar texto o imagen',
	canProcessImages: '¿Puede procesar imágenes?',
	noImageEndpoint: 'Ningún endpoint configurado admite el análisis de imágenes.',
	configureButton: 'Modelo',
	defaultPerson: 'Científico crítico',
	useShortRoleLabel:
		'Usar rol de sistema corto. Esto podría ayudar si el contexto del modelo es demasiado corto, por ejemplo, para textos largos enviados a Ollama',
	rolePlacementLabel: 'Rol',
	rolePlacementSystem: 'Mensaje del sistema',
	rolePlacementInline: 'En línea en mensaje de usuario',
	inlineUserMessage: 'System Prompt en línea (recomendado para LLMs locales en Ollama o LM Studio)',
	contextPlaceholder:
		'Proporcionar contexto adicional para ayudar con la verificación de hechos (ej. período de tiempo, ubicación, afirmaciones específicas en las que enfocarse)...',
	// Speech
	speechInput: 'Entrada por voz',
	startRecording: 'Hablar',
	stopRecording: 'Detener',
	loadingModels: 'Cargando modelos',
	transcribing: 'Transcribiendo…',
	transcriptUpdate: 'Actualización del transcrito',
	append: 'Añadir',
	replace: 'Reemplazar',
	// Role Configuration
	roleConfiguration: 'Configuración de Roles',
	basicRoles: 'Roles Básicos (Solo lectura)',
	customRoles: 'Roles Personalizados',
	builtIn: 'Integrado',
	createFromThis: 'Crear desde esto',
	addRole: 'Agregar Rol',
	addNewRole: 'Agregar Nuevo Rol',
	roleName: 'Nombre del rol',
	roleDescription: `Descripción del rol e instrucciones.
Ejemplo:

Tu persona es el filósofo Immanuel Kant.
1. Tono: Riguroso, complejo y moralmente severo. Usa estructuras de oraciones densas del siglo XVIII.
2. Método: No solo verifiques hechos; analiza si la afirmación del usuario sigue el "Imperativo Categórico" (Ley Universal).
3. Enfoque: Rechaza las falsedades no solo como incorrectas, sino como una violación de la Razón ("Vernunft").`,
	saveRole: 'Guardar',
	cancelRole: 'Cancelar',
	copyRole: 'Copiar',
	noCustomRoles:
		'Aún no se han creado roles personalizados. Haga clic en "Agregar Rol" para crear su primer rol personalizado.',
	deleteRoleConfirm: '¿Está seguro de que desea eliminar este rol?',
	createFromTemplate: 'Crear rol personalizado desde esta plantilla',
	createFromExisting: 'Crear nuevo rol desde esta plantilla',
	scientistName: 'Científico',
	satiristName: 'Racionalista Acerbo',
} satisfies BaseTranslation

export default es
