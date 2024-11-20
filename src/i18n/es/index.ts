import type { Translation } from '../i18n-types';

const es = {
	markedText: 'Texto marcado ({wordCount:number} palabras)' as `${string}{wordCount}${string}`,
	apiEndpoint: 'Punto final de la API',
	configureApi: 'Configurar',
	factCheck: 'Verificación de hechos',
	response: 'Respuesta',
	responseLength:
		'Longitud de la respuesta aprox. {responseLength: number} palabras' as `${string}{responseLength}${string}`,
	apiCta: 'Verificar',
	result: 'Resultado',
	checkingProgress: 'Comprobando...',
	copy: 'Copiar',
	configuredEndpoints: 'Puntos finales configurados',
	newEndpoint: 'Nuevo punto final',
	title: 'Título',
	titelPlaceholder: 'Ejemplo: API de verificación de hechos',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'Clave de API',
	apiKeyPlaceholder: 'Su clave de API',
	cancel: 'Cancelar',
	add: 'Añadir',
	noConfiguredEndpoints: 'No se han añadido puntos finales hasta ahora',
	editText: 'Editar texto aquí...',
	notChecked: 'No verificado',
	enterText: 'Ingrese el texto aquí.',
	characterLabel: 'Responder en el estilo de esta persona (opcional)',
	characterPlaceholder: 'Edgar Allan Poe',
	chooseTemplate: 'Elige una plantilla (opcional)',
	choose: 'Elegir ...'
} satisfies Translation;

export default es;
