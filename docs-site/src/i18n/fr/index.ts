import type { Translation } from '../i18n-types';

const fr: Translation = {
	general: {
		title: "Documentation de l'Extension Fact Check"
	},
	home: {
		welcome: 'Bienvenue dans la documentation de {name}',
		introduction:
			"Ce site web fournit une documentation complète sur l'installation, la configuration et l'utilisation de l'Extension Fact Check pour Chrome."
	},
	nav: {
		installation: 'Installation',
		configuration: 'Configuration',
		usage: 'Utilisation'
	},
	installation: {
		title: 'Installation',
		web_store_heading: 'Installer depuis le Chrome Web Store',
		web_store_intro:
			"Le moyen le plus simple d'installer l'extension est directement depuis le Chrome Web Store.",
		web_store_link_text: 'Fact Checker GPT Connector sur le Chrome Web Store',
		developer_mode_heading: 'Installer en mode développeur (depuis ZIP)',
		developer_mode_intro:
			"Si vous souhaitez installer une version spécifique ou contribuer au développement, vous pouvez installer l'extension en mode développeur de Chrome à l'aide d'un fichier ZIP.",
		developer_mode_steps: {
			step1: "Naviguez vers le répertoire racine de l'extension dans votre terminal.",
			step2:
				'Exécutez la commande de build : `{command}`. Cela générera un fichier `{zipFile}` dans le répertoire `dist/`.',
			step3: 'Ouvrez Chrome et allez à `chrome://extensions/`.',
			step4: 'Activez le "Mode développeur" à l\'aide du bouton en haut à droite.',
			step5: 'Cliquez sur le bouton "Charger l\'extension non empaquetée".',
			step6:
				"Naviguez vers le dossier `dist/` dans le répertoire de l'extension et sélectionnez-le.",
			step7: "L'extension devrait maintenant apparaître dans votre liste d'extensions installées."
		}
	},
	configuration: {
		title: 'Configuration',
		endpoints_heading: 'Points de terminaison API',
		endpoints_intro:
			"L'extension nécessite un point de terminaison API pour effectuer des vérifications de faits. Vous pouvez configurer cela dans le popup de l'extension.",
		endpoints_steps: {
			step1:
				"Ouvrez le popup de l'extension en cliquant sur son icône dans la barre d'outils de Chrome.",
			step2: 'Cliquez sur "Point de terminaison API".',
			step3: 'Cliquez sur le bouton "Nouveau point de terminaison".',
			step4:
				'Remplissez les détails de votre point de terminaison API. Vous pouvez choisir un modèle pour les services courants comme Gemini, OpenAI, etc., ou saisir une URL personnalisée.',
			step5: "Entrez votre clé API si le service l'exige.",
			step6: 'Cliquez sur "ajouter" pour enregistrer le point de terminaison.'
		},
		api_keys_heading: 'Obtention des clés API',
		api_keys_intro:
			"De nombreux services API nécessitent une clé API pour l'authentification. Vous devrez obtenir cette clé auprès du fournisseur de services respectif.",
		api_keys_advice:
			"Veuillez vous référer à la documentation officielle du service API que vous souhaitez utiliser pour obtenir des instructions sur la façon d'obtenir une clé API.",
		ollama_heading: "Utilisation d'une instance Ollama locale",
		ollama_intro:
			'Vous pouvez également utiliser une instance Ollama locale comme point de terminaison de vérification des faits.',
		ollama_steps: {
			step1: 'Installez Ollama sur votre système en suivant la documentation officielle.',
			step2:
				"Une fois qu'Ollama est en cours d'exécution, ajoutez un nouveau point de terminaison dans la configuration de l'extension.",
			step3:
				"Pour l'URL, entrez l'adresse locale de votre instance Ollama, généralement `{ollamaUrl}`.",
			step4: 'Sélectionnez le modèle approprié si vous y êtes invité.',
			step5: 'Enregistrez le point de terminaison.'
		}
	},
	usage: {
		title: 'Utilisation',
		select_text_heading: 'Sélectionner du texte',
		select_text_intro:
			"Pour vérifier des faits dans du texte, sélectionnez simplement le texte souhaité sur n'importe quelle page web.",
		select_image_heading: 'Sélectionner des images',
		select_image_intro:
			"Pour vérifier des faits dans une image, cliquez avec le bouton droit de la souris sur l'image et sélectionnez l'option de l'extension (si disponible et prise en charge par le point de terminaison configuré).",
		select_ui_heading: "Utilisation du popup de l'extension",
		select_ui_intro:
			"Alternativement, vous pouvez ouvrir le popup de l'extension et saisir du texte manuellement ou sélectionner une image via l'interface fournie."
	}
};

export default fr;
