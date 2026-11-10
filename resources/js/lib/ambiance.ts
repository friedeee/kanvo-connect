/** Photos d’ambiance (Wikimedia Commons, licences libres). Ce ne sont pas des produits vendus sur Kanvô. */
export const AMBIANCE = {
    metier: {
        file: 'metier',
        caption: 'Métier à tisser le kenté',
        author: 'daSupremo',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Kente_weaving_06.jpg',
    },
    navettes: {
        file: 'navettes',
        caption: 'Navettes et fils de tissage',
        author: 'Warmglow',
        license: 'CC0',
        source: 'https://commons.wikimedia.org/wiki/File:Traditional_kente_weaving.jpg',
    },
    tisserand: {
        file: 'tisserand',
        caption: 'Un tisserand au travail',
        author: 'Kwameghana',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Front_view_of_kente_weaver.jpg',
    },
    bandes: {
        file: 'bandes',
        caption: 'Bandes de kenté, Tafi (Volta, Ghana)',
        author: 'Warmglow',
        license: 'CC0',
        source: 'https://commons.wikimedia.org/wiki/File:Kente_patterns,_Tafi,_Volta_region.jpg',
    },
    etals: {
        file: 'etals',
        caption: 'Étoffes tissées, Tafi (Volta, Ghana)',
        author: 'Warmglow',
        license: 'CC0',
        source: 'https://commons.wikimedia.org/wiki/File:Different_Kente_cloth,_Tafi,_Volta_region.jpg',
    },
    'kente-ewe': {
        file: 'kente-ewe',
        caption: 'Kenté ewe, Ghana',
        author: 'ZSM',
        license: 'CC BY-SA 3.0',
        source: 'https://commons.wikimedia.org/wiki/File:Ewe_kente_stripes,_Ghana.jpg',
    },
    'bandes-tafi': {
        file: 'bandes-tafi',
        caption: 'Bandes tissées, Tafi (Volta, Ghana)',
        author: 'Amoaniwaa',
        license: 'CC0',
        source: 'https://commons.wikimedia.org/wiki/File:Kente_Tafi_(Ewe)_20.jpg',
    },
    indigo: {
        file: 'indigo',
        caption: 'Rouleaux de bandes tissées, pays dogon (Mali)',
        author: 'OBERSON',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Pays_Dogon_(9).JPG',
    },
    'bandes-tafi-2': {
        file: 'bandes-tafi-2',
        caption: 'Bandes tissées, Tafi (Volta, Ghana)',
        author: 'Amoaniwaa',
        license: 'CC0',
        source: 'https://commons.wikimedia.org/wiki/File:Kente_Tafi_(Ewe)_11.jpg',
    },
    appliques: {
        file: 'appliques',
        caption: 'Tissus appliqués d’Abomey (Bénin)',
        author: 'Ji-Elle',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Abomey-Tissus_appliqu%C3%A9s.jpg',
    },
    'souvenirs-abomey': {
        file: 'souvenirs-abomey',
        caption: 'Échoppes d’artisans, Abomey (Bénin)',
        author: 'Ji-Elle',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Abomey-Vente_de_souvenirs_(2).jpg',
    },
    ouidah: {
        file: 'ouidah',
        caption: 'Vente de textiles, Ouidah (Bénin)',
        author: 'Ji-Elle',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Ouidah-Vente_de_textiles.jpg',
    },
    coton: {
        file: 'coton',
        caption: 'Filage du coton à la main',
        author: 'Mariam SAVADOGO',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Enfilement_du_coton_04.jpg',
    },
    teinture: {
        file: 'teinture',
        caption: 'Teinture à l’indigo, Kano (Nigeria)',
        author: 'Shots by abdul',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Kofar_mata_dye_pit_1.jpg',
    },
    'pagne-tisse': {
        file: 'pagne-tisse',
        caption: 'Pagne tissé artisanal (Sénégal)',
        author: 'CelmaKoumba',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Pagne_tiss%C3%A9_artisanal_-_Toubab_Dialaw.jpg',
    },
    fils: {
        file: 'fils',
        caption: 'Fils de couleur',
        author: 'TripleMagenta',
        license: 'CC BY-SA 4.0',
        source: 'https://commons.wikimedia.org/wiki/File:Colorful_Yarn_at_Textile_Museum_Tilburg.jpg',
    },
    'kente-volta': {
        file: 'kente-volta',
        caption: 'Kenté traditionnel de la Volta (Ghana)',
        author: 'Warmglow',
        license: 'CC0',
        source: 'https://commons.wikimedia.org/wiki/File:Traditional_Kente_of_Volta_region.jpg',
    },
    'kente-ewe-2': {
        file: 'kente-ewe-2',
        caption: 'Kenté ewe, Ghana',
        author: 'ZSM',
        license: 'CC BY-SA 3.0',
        source: 'https://commons.wikimedia.org/wiki/File:Ewe_kente_2,_Ghana.JPG',
    },
} as const;

export type AmbianceName = keyof typeof AMBIANCE;

export const ambianceUrl = (name: AmbianceName, small = false) =>
    `/images/ambiance/${name}${small ? '-500' : ''}.jpg`;
