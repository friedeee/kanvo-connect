# Kanvô Connect

Marketplace spécialisée dans le pagne tissé béninois. Ce dépôt contient le **squelette technique** du MVP défini dans le cahier des charges fonctionnel v1.0.

Stack : Laravel 13, Inertia 3, React 19 + TypeScript, Tailwind 4, PostgreSQL 16 (Docker).

## Démarrer en local

Prérequis : PHP 8.3, Composer, Node, Docker.

```bash
cp .env.example .env            # puis renseigner DB_PASSWORD
composer install && npm install
php artisan key:generate
docker compose up -d            # PostgreSQL sur 127.0.0.1:5434 (+ base kanvo_test)
php artisan migrate --seed      # données de démonstration fictives
php artisan storage:link
composer run dev                # http://localhost:8010
```

Comptes de démonstration (mot de passe `password`, local uniquement) :

| Rôle               | E-mail              |
| ------------------ | ------------------- |
| Administrateur     | admin@kanvo.test    |
| Vendeur validé     | vendeur@kanvo.test  |
| Vendeur en attente | candidat@kanvo.test |
| Client             | client@kanvo.test   |

## Vérifications

```bash
php artisan test                # PHPUnit sur PostgreSQL (base kanvo_test)
vendor/bin/phpstan analyse
vendor/bin/pint --test
npm run check && npm run types:check
```

## Ce que couvre le squelette

| Domaine          | Contenu                                                                                                                  | Règles du CDC       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| Catalogue public | Accueil, catalogue filtrable (catégorie, couleur, prix, longueur, artisan, disponibilité), fiche produit, profil artisan | § 4.1, CA-01        |
| Vendeurs         | Demande d'inscription, statuts en attente / validé / suspendu / refusé, motif affiché au vendeur                         | § 4.2, RM-01        |
| Produits         | Création, photos (8 max), prix entier en XOF, stock ou délai de fabrication, soumission à validation, désactivation      | § 4.3, RM-02, RM-03 |
| Administration   | Validation et suspension des vendeurs, modération et retrait des produits, catégories, journal des actions               | § 4.7, CA-10        |
| Traçabilité      | Chaque changement de statut est horodaté dans `audit_logs` avec son auteur et son motif                                  | RM-10               |
| Cloisonnement    | Un vendeur ne voit et ne modifie que ses produits (policy côté serveur) ; le téléphone des vendeurs n'est jamais public  | RM-08, RM-13, CA-06 |
| Stock            | Contrainte `CHECK (stock_quantity >= 0)` en base                                                                         | RM-04               |

Choix de conception à connaître :

- **Montants** : entiers en FCFA (`price_xof`), sans décimales.
- **Modification d'un produit publié** : toute modification de contenu le renvoie en validation ; la mise à jour du stock seule ne le fait pas.
- **Couleurs** : liste fermée dans `config/kanvo.php`, pour que le filtre reste fiable.
- **Dimensions** : longueur et largeur en cm (champs structurés) plutôt qu'un texte libre, pour permettre le filtre.

## Paiement : volontairement non intégré

Le cahier des charges (§ 4.5, § 14) interdit de concevoir l'intégration avant la confirmation écrite du prestataire. Le dépôt contient seulement :

- le contrat `App\Payments\PaymentGateway` ;
- un prestataire simulé, `FakePaymentGateway`, refusé en production.

Règle du contrat : une notification du prestataire n'est qu'un signal. Le statut est toujours relu côté serveur avec `fetchTransaction()` avant toute écriture (RM-05, RM-06).

## Pas encore fait

- Panier, commandes, livraison, remboursements (§ 4.4 à 4.6) : ils dépendent du prestataire de paiement.
- Les écrans d'authentification et de paramètres du starter kit sont encore en anglais.
- La modification du contenu d'un produit par l'administrateur (seuls publication, refus et retrait existent).
- Les pages d'information : livraison, retours, CGV, confidentialité (RM-14).
