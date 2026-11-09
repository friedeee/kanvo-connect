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
} as const;

export type AmbianceName = keyof typeof AMBIANCE;

export const ambianceUrl = (name: AmbianceName, small = false) =>
    `/images/ambiance/${name}${small ? '-500' : ''}.jpg`;
