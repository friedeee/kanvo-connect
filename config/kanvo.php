<?php

return [

    /*
    | Couleurs proposées aux vendeurs et utilisées par les filtres du catalogue.
    | Une liste fermée garde les filtres fiables ; elle peut être étendue ici.
    */
    'colors' => [
        'blanc' => 'Blanc',
        'noir' => 'Noir',
        'indigo' => 'Indigo',
        'bleu' => 'Bleu',
        'rouge' => 'Rouge',
        'bordeaux' => 'Bordeaux',
        'jaune' => 'Jaune',
        'or' => 'Or',
        'orange' => 'Orange',
        'vert' => 'Vert',
        'violet' => 'Violet',
        'rose' => 'Rose',
        'marron' => 'Marron',
        'beige' => 'Beige',
        'gris' => 'Gris',
        'multicolore' => 'Multicolore',
    ],

    'max_product_images' => 8,

    /*
    | Numéro WhatsApp de l'équipe Kanvô, au format international (ex. 2290197939315).
    | Les clients y envoient leurs commandes depuis les fiches produit ; l'équipe transmet
    | à l'artisan, dont le téléphone reste privé. Vide : le bouton n'est pas affiché.
    */
    'whatsapp' => env('KANVO_WHATSAPP'),

    /*
    | Prestataire de paiement. Seul le prestataire « fake » existe tant qu'aucun
    | prestataire réel n'a confirmé par écrit son offre (cahier des charges, § 4.5 et § 14).
    */
    'payment' => [
        'driver' => env('PAYMENT_DRIVER', 'fake'),
    ],

];
