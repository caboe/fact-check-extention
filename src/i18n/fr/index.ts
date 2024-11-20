import type { Translation } from '../i18n-types';

const fr = {
	markedText: 'Texte marqué ({wordCount:number} mots)' as `${string}{wordCount}${string}`,
	apiEndpoint: 'Point de terminaison API',
	configureApi: 'Configurer',
	factCheck: 'Vérification des faits',
	response: 'Réponse',
	responseLength:
		'Longueur de la réponse env. {responseLength: number} mots' as `${string}{responseLength}${string}`,
	apiCta: 'Vérifier',
	result: 'Résultat',
	checkingProgress: 'Vérification en cours...',
	copy: 'Copier',
	configuredEndpoints: 'Points de terminaison configurés',
	newEndpoint: 'Nouveau point de terminaison',
	title: 'Titre',
	titelPlaceholder: 'Exemple : API de vérification des faits',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'Clé API',
	apiKeyPlaceholder: 'Votre clé API',
	cancel: 'Annuler',
	add: 'Ajouter',
	noConfiguredEndpoints: "Aucun point de terminaison ajouté jusqu'à présent",
	editText: 'Modifier le texte ici...',
	notChecked: 'Non vérifié',
	enterText: 'Entrez le texte ici.',
	characterLabel: 'ERépondre dans le style de cette personne (facultatif)',
	characterPlaceholder: 'Edgar Allan Poe',
	chooseTemplate: 'Choisissez un modèle (facultatif)',
	choose: 'Choisir ...'
} satisfies Translation;

export default fr;
