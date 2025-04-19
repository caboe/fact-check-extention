import type { Translation } from '../i18n-types';

const es: Translation = {
	general: {
		title: 'Documentación de la Extensión Fact Check'
	},
	home: {
		welcome: 'Bienvenido a la Documentación de {name}',
		introduction:
			'Este sitio web proporciona documentación completa sobre cómo instalar, configurar y usar la Extensión Fact Check para Chrome.'
	},
	nav: {
		installation: 'Instalación',
		configuration: 'Configuración',
		usage: 'Uso'
	},
	installation: {
		title: 'Instalación',
		web_store_heading: 'Instalar desde Chrome Web Store',
		web_store_intro:
			'La forma más sencilla de instalar la extensión es directamente desde Chrome Web Store.',
		web_store_link_text: 'Fact Checker GPT Connector en Chrome Web Store',
		developer_mode_heading: 'Instalar en Modo Desarrollador (desde ZIP)',
		developer_mode_intro:
			'Si desea instalar una versión específica o contribuir al desarrollo, puede instalar la extensión en el modo desarrollador de Chrome usando un archivo ZIP.',
		developer_mode_steps: {
			step1: 'Navegue al directorio raíz de la extensión en su terminal.',
			step2:
				'Ejecute el comando de compilación: `{command}`. Esto generará un archivo `{zipFile}` en el directorio `dist/`.',
			step3: 'Abra Chrome y vaya a `chrome://extensions/`.',
			step4:
				'Habilite el "Modo desarrollador" usando el interruptor en la esquina superior derecha.',
			step5: 'Haga clic en el botón "Cargar descomprimida".',
			step6: 'Navegue a la carpeta `dist/` dentro del directorio de la extensión y selecciónela.',
			step7: 'La extensión ahora debería aparecer en su lista de extensiones instaladas.'
		}
	},
	configuration: {
		title: 'Configuración',
		endpoints_heading: 'Puntos Finales de API',
		endpoints_intro:
			'La extensión requiere un punto final de API para realizar verificaciones de hechos. Puede configurar esto en el popup de la extensión.',
		endpoints_steps: {
			step1:
				'Abra el popup de la extensión haciendo clic en su icono en la barra de herramientas de Chrome.',
			step2: 'Haga clic en "Punto Final de API".',
			step3: 'Haga clic en el botón "Nuevo Punto Final".',
			step4:
				'Complete los detalles de su punto final de API. Puede elegir una plantilla para servicios comunes como Gemini, OpenAI, etc., o ingresar una URL personalizada.',
			step5: 'Ingrese su Clave de API si el servicio lo requiere.',
			step6: 'Haga clic en "agregar" para guardar el punto final.'
		},
		api_keys_heading: 'Obtención de Claves de API',
		api_keys_intro:
			'Muchos servicios de API requieren una clave de API para la autenticación. Deberá obtener esta clave del proveedor de servicios correspondiente.',
		api_keys_advice:
			'Consulte la documentación oficial del servicio de API que desea utilizar para obtener instrucciones sobre cómo obtener una clave de API.',
		ollama_heading: 'Uso de una Instancia Local de Ollama',
		ollama_intro:
			'También puede usar una instancia local de Ollama como su punto final de verificación de hechos.',
		ollama_steps: {
			step1: 'Instale Ollama en su sistema siguiendo la documentación oficial.',
			step2:
				'Una vez que Ollama esté funcionando, agregue un nuevo punto final en la configuración de la extensión.',
			step3:
				'Para la URL, ingrese la dirección local de su instancia de Ollama, típicamente `{ollamaUrl}`.',
			step4: 'Seleccione el modelo apropiado si se le solicita.',
			step5: 'Guarde el punto final.'
		}
	},
	usage: {
		title: 'Uso',
		select_text_heading: 'Seleccionar Texto',
		select_text_intro:
			'Para verificar hechos en texto, simplemente seleccione el texto deseado en cualquier página web.',
		select_image_heading: 'Seleccionar Imágenes',
		select_image_intro:
			'Para verificar hechos en una imagen, haga clic derecho en la imagen y seleccione la opción de la extensión (si está disponible y es compatible con el punto final configurado).',
		select_ui_heading: 'Uso del Popup de la Extensión',
		select_ui_intro:
			'Alternativamente, puede abrir el popup de la extensión e ingresar texto manualmente o seleccionar una imagen a través de la interfaz proporcionada.'
	}
};

export default es;
