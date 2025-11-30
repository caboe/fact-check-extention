import type { BaseTranslation } from '../i18n-types'

const fr = {
	introduction: `Cet outil est conçu pour vous aider à vérifier plus rapidement les informations sur le web et à mieux évaluer la crédibilité des textes.</p>
	<p>Configurez une GPT qui effectuera la vérification des faits.</p>
	<p><strong>Remarque importante :</strong> Bien que cette extension repose sur une IA avancée, elle n’est pas infaillible. L’intelligence artificielle peut parfois 'halluciner', c’est-à-dire fournir des informations fausses ou trompeuses. Il est donc important de remettre en question les résultats de manière critique et, en cas de doute, d’effectuer des recherches supplémentaires, surtout si les résultats semblent inattendus ou 'suspects.' Considérez toujours les résultats de la vérification des faits comme un premier point de référence et non comme la vérité absolue. Utilisez cette extension comme un soutien pour votre propre analyse critique des informations.</p>`,
	letsGo: 'Allons-y !',
	markedText: 'Texte marqué ({wordCount:number} mots)' as `${string}{wordCount}${string}`,
	apiEndpoint: 'Point de terminaison API',
	configureApi: 'Modèle',
	factCheck: 'Vérification des faits',
	response: 'Réponse',
	responseLength:
		'Longueur de la réponse env. {responseLength: number} mots' as `${string}{responseLength}${string}`,
	apiCta: 'Vérifier',
	result: 'Résultat',
	checkingProgress: 'Chargement...',
	thinking: 'Réfléchit...',
	finished: 'Terminé',
	copy: 'Copier',
	configuredEndpoints: 'Points de terminaison configurés',
	newEndpoint: 'Nouveau point de terminaison',
	darkMode: 'Dark Mode',
	title: 'Titre',
	titelPlaceholder: 'Exemple : API de vérification des faits',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'Clé API',
	apiKeyPlaceholder: 'Votre clé API',
	cancel: 'Annuler',
	add: 'Ajouter',
	updateEndpoint: 'Mettre à jour le point de terminaison',
	noConfiguredEndpoints: "Aucun point de terminaison ajouté jusqu'à présent",
	selectedText: 'Entrez le texte directement ou sélectionnez sur la page.',
	notChecked: 'Non vérifié',
	enterText: 'Entrez le texte ici.',
	personLabel: 'ERépondre dans le style de cette personne (facultatif)',
	personPlaceholder: 'Edgar Allan Poe',
	chooseTemplate: 'Choisissez un modèle (facultatif)',
	choose: 'Choisir ...',
	endpointExists: 'Un point de terminaison avec ce nom existe déjà.',
	saveAnyway: 'Aucune clé API fournie, enregistrer quand même ?',
	fieldsMissing: 'Veuillez remplir tous les champs.',
	copied: 'Résultat copié dans le presse-papiers !',
	copyError: 'Erreur lors de la copie : {error:string}' as `${string}{error}${string}`,
	fillAllFieldsAlert: 'Veuillez remplir tous les champs',
	selectText: 'Sélectionner le texte',
	resetSelection: 'Réinitialiser la sélection',
	imageSelected: 'Image sélectionnée',
	selectImage: 'Sélectionner une image',
	pleaseSelectImage: 'Veuillez sélectionner une image.',
	selectTextOrImage: 'Sélectionner du texte ou une image',
	canProcessImages: 'Peut traiter les images ?',
	noImageEndpoint: "Aucun point de terminaison configuré ne prend en charge l'analyse d'images.",
	configureButton: 'Modèle',
	defaultPerson: 'Scientifique critique',
	useShortRoleLabel:
		'Utiliser un rôle système court. Cela pourrait aider si le contexte du modèle est trop court, par exemple pour les textes longs envoyés à Ollama',
	rolePlacementLabel: 'Rôle',
	rolePlacementSystem: 'Message système',
	rolePlacementInline: 'En ligne dans le message utilisateur',
	inlineUserMessage:
		'System Prompt en ligne (recommandé pour les LLM locaux sur Ollama ou LM Studio)',
	contextPlaceholder:
		'Fournir un contexte supplémentaire pour aider à la vérification des faits (par ex. période, lieu, affirmations spécifiques à examiner)...',
	// Role Configuration
	roleConfiguration: 'Configuration des Rôles',
	basicRoles: 'Rôles de Base (Lecture seule)',
	customRoles: 'Rôles Personnalisés',
	builtIn: 'Intégré',
	createFromThis: 'Créer à partir de ceci',
	addRole: 'Ajouter un Rôle',
	addNewRole: 'Ajouter un Nouveau Rôle',
	roleName: 'Nom du rôle',
	roleDescription: `Description du rôle et instructions.
Exemple :

Votre personnage est le philosophe Emmanuel Kant.
1. Ton : Rigoureux, complexe et moralement sévère. Utilisez des structures de phrases denses du XVIIIe siècle.
2. Méthode : Ne vous contentez pas de vérifier les faits ; analysez si l'affirmation de l'utilisateur suit l'« Impératif Catégorique » (Loi Universelle).
3. Focus : Rejetez les faussetés non seulement comme incorrectes, mais comme une violation de la Raison (« Vernunft »).`,
	saveRole: 'Enregistrer',
	cancelRole: 'Annuler',
	copyRole: 'Copier',
	noCustomRoles:
		'Aucun rôle personnalisé créé pour le moment. Cliquez sur "Ajouter un Rôle" pour créer votre premier rôle personnalisé.',
	deleteRoleConfirm: 'Êtes-vous sûr de vouloir supprimer ce rôle ?',
	createFromTemplate: 'Créer un rôle personnalisé à partir de ce modèle',
	createFromExisting: 'Créer un nouveau rôle à partir de ce modèle',
	scientistName: 'Scientifique',
	satiristName: 'Rationaliste Acerbe',
} satisfies BaseTranslation

export default fr
