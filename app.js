
/* Tournée V7 — géocodage + ordre par distance à la mairie
   - Géocode "Mairie <Ville>" (cache local)
   - Géocode chaque adresse à l'ajout / modification
   - Bouton "Optimiser" : géocode les manquantes (avec biais autour de la mairie) + trie
*/
const INITIAL_DATA = {"Torreilles": [{"street": "2 pl Jules ferr", "postcode": "66100", "city": "Torreilles", "done": false}, {"street": "1 bis avenue des Pyrénées", "postcode": "66440", "city": "Torreilles", "done": false}, {"street": "2 AVENUE DU LANGUEDOC", "postcode": "66440", "city": "Torreilles", "done": false}, {"street": "3 bis rue george sand", "postcode": "66440", "city": "Torreilles", "done": false}, {"street": "Boulevard de la Plage", "postcode": "66440", "city": "Torreilles", "done": false}, {"street": "Camping les Tropiques", "postcode": "66440", "city": "Torreilles", "done": false}, {"street": "D7-4 village marin catalan", "postcode": "66440", "city": "Torreilles", "done": false}, {"street": "Les Dunes", "postcode": "66440", "city": "Torreilles", "done": false}, {"street": "Rue Blaise Pascal", "postcode": "66440", "city": "Torreilles", "done": false}], "Perpignan": [{"street": "817  boulevard Marius Berlier", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "141bis avenue maréchal joffre", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 bis rue du figuier", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 rue henri fantin latour", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "13 Rue de Cadaques", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "18 Avenue De Prades Bat B Appt B16", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Cours palmarole", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "21 Rue Grande la Monnaie", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "25 rue Nicolas poussin", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "280 CHEMIN DU MAS DUCP", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 rue anny de pous", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "38bis rue jean alcover", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue Antoine de Condorcet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "41 rue han coll", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Rue Pierre de Montreuil", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 rue Jean baptiste chardin", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "69 rue Alexandre Ansaldi", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "7 rue Raymond Pitet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 Rue Saint-François de Paule", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 Rue Santiago Russinol", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 rue Charles guerhardt", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "17 rue Henri de Turenne", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "24 chemin de saint roch", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "4 RUE DES TRABUCAYRES", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "41 BD JOHN FITZGERALD KENNEDY", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "02 rue fabriques d'en nabot", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 Av. du Général de Gaulle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 Rue Claude Clodion", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 Rue François Delcos", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 Rue Simone Gay", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 Rue des Glaieuls appartement 122 3e", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 avenue du docteur torreill", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 bis place Justin bardou job", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 impasse marivaux", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 rue Alain Lesage", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 rue Henri verneuil", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 rue des commeres", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 rue des œillets", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "10 Bd du Roussillon", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "10 Rue Louis de Bonnefoy", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "10 rue grande la Réal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "10 rue honoré de balzac", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "10 résidence des 4 cazals", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "109 Rue Jean Bullant", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1098 avenue eole tecnosud 2", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "11 Av. Marcelin Albert", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "11 Av. de Grande Bretagne", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "11 Avenue Ribere", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "11 rue de la tour de la massane", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 Rue Adolphe Monticelli", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 Rue Claude Bernard", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 Rue Grande la Réal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 Rue Madame de Staël", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 Rue Noël Coypel", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 Rue Pompeu Fabra", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 rue Alphonse Simon", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "12 rue du fer à cheval", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "13 Rue Paul Riquet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "13 Rue Petite la Monnaie", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "14 Chem. du Sacré Cœur", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "14 Rue Gabriel Fauré", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "14 Rue Henri Fantin Latour", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "14 Rue de Valencia", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "14 impasse Alphonse Daudet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "140 Av. du Palais des Expositions", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "146 avenue maréchal Joffre", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "15 All. de Bacchus", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "15 Av. Marcel Aime", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "15 Rue General Legrand", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "15 Rue du Général Legrand", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "15 rue Jacques Mach", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "16 Rue Benoît Fourneyron", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "16 Rue Ernest Hemingway", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "16 Rue Jean de la Fontaine", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "16 Rue Stendhal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "16 rue hyacinte rigaud", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "17 Rue Marc Seguin", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "17 rue Floréal St assicle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "17 rue Luc de vauvenargues app 104", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "171 rond point Albert Donnezan, bâtiment C, résidence ligne et pure", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "18 Rue Grande la Monnaie", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "18 boulevard Georges Clémenceau", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "18 rue Léo Delibes", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "183 avenue de maréchal Joffre", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "19 Rue Aristide Maillol", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "19 Rue Sébastien Vauban", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "19 rue Honoré de Balzac", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "193 avenue Abbé Pierre Perpignan", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1avenue Gilbert Brutus", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1rue louis Delfau APPT C", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Bd Georges Clemenceau", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Bis Rue Porte D’assaut", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Cr Lazare Escarguel", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue Jean de la Fontaine", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue Jules Dumont d'Urville", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue Louis le Vau", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue Pascal Marie Agasse", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue Prte d'Assaut", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue Zenobe Gramme", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue des Frères Rosny", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 Rue du Lieutenant Farriol", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 bis rue porte d'assaut", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 boulevard Clemenceau", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 rue général labedoyer", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 rue marché au bestiaux", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "20 Rue Pascal Marie Agasse", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "20 espace Méditerrané", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "20 rue René leriche", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "200 Cami Joan Biosca", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "21 Avenue Joffre", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "21 Rue des Augustins", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "21 Rue des Jeunes Années", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "22 Rue Petite la Réal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "23 rue Jean Michel Chevotet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "23 rue Vincente blasco ibanez", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "23 rue des vignes", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "24 Av. Emile Roudayre", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "24 Cours Lazare Escarguel", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "24 Rue Theodore Chasseriau", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "24 Rue de Cerdagne", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "24 avenue de cerdagne", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "24 rue Valentin magnan", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "25 Carrer Alexandre Josep Oliva", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "25 quai Vauban", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "25 rue de Paris", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "26 Rue de la Tour de la Massane", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "26 Rue des Trois Journées", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "26 avenue Alfred sauvy (cité universitaire côté pente)", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "26 rue Joseph cabrit", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "27 Rue Georges Bizet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "29 rue de Venise", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "29 rue pascal marie agasse", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 Frédéric Bartholdi", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 Rue Henri Bataille", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 Rue Jean Payra", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 Rue Jean Philippe Rameau", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 Rue Jordi Carbonell I Tries", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 Rue des Augustins", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 et 5 rue Paul MORAND", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 impasse de la houle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 rue Luc Dagobert", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "3 rue bonaventura Carlos Aribaud", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "300 Avenue charles deperet Bat C-st 001", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "308 Chem. du Mas Bresson", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "32 Boulevard John-Fitzgerald KENNEDY", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "32 Rue Jacques Trefouel", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "32 place hyacinthe rigaud", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "33 Rue des Amandiers", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "34 avenue général leclerc", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "35 Rue Grande la Réal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "35 rue Alfred Bachelet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "350 Chemin de Château Roussillon", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "358 Chem. du Mas Ducup", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "36 Rue Charles Gerhardt", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "37 Rue Grande la Réal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "38 Rue Jean Alcover", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 Imp. de Setcases", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 Rue Eugène Flachat", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 Rue Paul Séjourné", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 Rue Sainte-Magdeleine", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 impasse du setcas", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 impasse du setcasse", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 impasse du setecass", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue Gustave effel", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue Robert Planquette", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue Yves Allégret", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue de Latour bas Elne", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue gustave eiffel", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue neuve", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "40 Av. des Eaux Vives", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "40 rue cabrit", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "40,  Rue Louis Blériot", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "41 Rambla de l'Occitanie", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "41 boulevard John Fitzgerald Kennedy", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "44 avenue du palais des expositions", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "44 rue André Chouraqui appartement 4811", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "45 Rue Auguste Mariette", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "47 Rue de l'Emporda", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "47 rue rené Antoine de Réaumur", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 Pl. Alain Gerbault", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 Rue Alain Gerbault", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 Rue Michel de Montaigne", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 Rue des Tuileries", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 avenue du parc des expositions", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 rue Paul Morand Perpignan", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 rue de la révolution française", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 rue des sérénade", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "5 rue du Tuileries", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "51 Avenue du Palais des Expositions", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "52 Bis Boulevard Aristide Briand", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "56 boulevard Aristide Briand", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "57 av du général de Gaulle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "59 Rue Alexandre Ansaldi", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Av. Dr Jean Louis Torreilles", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Av. Rosette Blanc", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Bd du Roussillon", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Impasse Ducup de Saint-Paul", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Rie Pierre de Montreuil", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Rue De La Corse Résidence Anatole France", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Rue Jean-Baptiste Chardin", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Rue Stendhal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Rue du Cygne", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 Rue du Puyvalador", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 avenue docteur Jean Louis torreille", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 impasse ducup", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "6 rue petite la real", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "61 Rue Jean Baptiste Lulli", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "61 rue jean batiste lulli", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "64 avenue Jean Giono", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "66 avenue du champ de mars", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "67 All. des Cyprès", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "7 Rue Mercè Rodoreda", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "7 Rue de la Main de Fer", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "7 rue de Venise", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "7 rue de leglise la real", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "71 Rue Joan Maragall", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "73 avenue du docteur Albert Schweitzer", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 Rue Jules Romains", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 Rue de la Cloche d'Or", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 Rue du Chantier", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 Rue Élie Delcros", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 avenue de Grande Bretagne, Perpignan, France", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 avenue joe rosenthal", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8 rue des rouges gorges", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "8, impasse des amandiers", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "807 Chem. du Soleil Roy", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "807 chemin de soleil roi", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "85 Chem. de la Poudrière", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 Rue Edouard Bourdet", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 Rue Jean Racine", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 boulevard kenedy Perpignan", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 jean baptiste greuse", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 rue Henry Aragon Bat D apt 133", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 rue Henry Aragon Bat D", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "9 rue commandant Ernest soubielle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "91 rue Pascal marie grasse", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "92 Av. Commandant Ernest Soubielle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "955 Av. Julien Panchot", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "97 Av. de Prades", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "99 avenue docteur Albert Schweitzer", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Appart'City Confort Perpignan Centre Gare - Appart Hôtel", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Avenue docteur Albert Schweitzer", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Clinique du roussillon", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "HLM LOPOFA", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Hôtel Kyriad sud", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Hôtel Suite Novotel Perpignan", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Ibis Styles Perpignan Centre Gare", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Impasse René col", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Mas codine Chemin du Mas Codineine", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Mas miraflors, Lafage domaine", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Residence les péchés", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Rue Jean François de la Pérouse", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Rue Robert Planquette", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Rue de la Poissonnerie", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Rue de la Pérouse bat I", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Rue de l’horloge", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Résidence le goya 1 rue auguste caffe", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Résidence ligne et pure", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "Salle des fêtes", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "1 Av. de Banyuls-Sur-Mer", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "1 Rue de la Preste", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "1 rue des Ardennes", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "10 Rambla de l'occitanie", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "10 Rue Gustave Roussy", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "10 Rue Paul Claudel", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "10 Rue du Vilar", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "14 Sq. Maillol", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "15 rue de taulis", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "16 Rambla de l'Occitanieaa", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "16 avenue du tech", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "2 Av. du Cap Béar", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "2 Rue François Broussais", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "2 rue des terrasses", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "20 rue René Leriche", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "21 Bd John Fitzgérald Kennedy", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "21 boulevard JF Kennedy", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "23 Av. Paul Alduy", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "24 Chem. de Saint-Roch", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "25 Rue de Taulis", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "29 Rue Grande la Monnaie", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "29 avenue Paul Alduy", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "3 Rdpt du Parc des Sports", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "3 Rue Paul Morand", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "3 Rue de Corneilla del Vercol", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "35 Rue de Taulis", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "4 Av. Robert Emmanuel Brousse", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "4 Avenue d'Amélie les Bains", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "4 Rue Neuve", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "4 rue des Ardennes Perpignan", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "41 rue de taulis", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "43 rue des ménestrels", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "44 Rue Andre Chouraqui", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "5 Pl. Charles Hermite", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "5 Rue Jeanne Jugan Bat B appt 1213", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "5 rue notre dame du Coral", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "56 boulevard Aristide Briand Perpignan", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "6 Av. de la Côté Radieuse", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "6 rue du pas du loup", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "63 Chem. de la Passio Vella", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "64 Av. Georges Guynemer", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "8 Avenue Pierre Cambres", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "8 Rue des Dragons", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "8 boulevard henri Poincaré", "postcode": "66100", "city": "Perpignan", "done": false}, {"street": "1 allée jose maria de heredia", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "2 rue abbe albert cazes", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "21 esplanade méditerranée", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "28 rue des metezeau", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "4 rue la petite real", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "61 avenue du comdant soubielle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "61 avenue du commandant Ernest Soubielle", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "7 rue charles de montesquieu", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "7 rue de vienne", "postcode": "66000", "city": "Perpignan", "done": false}, {"street": "chemin de saint roch", "postcode": "66100", "city": "Perpignan", "done": false}], "66250": [{"street": "26 Rue Louis David", "postcode": "66250", "city": "66250", "done": false}], "Saint-Laurent-de-la-Salanque": [{"street": "3 RUE JEAN PHILIPPE RAMEAU", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "21 rue Offenbach", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "3 rue maurice ravel", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "5 Impasse Jules Michelet", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "5 rue de la fontaine", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "5 Impasse Jules Michelet", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "11 bis rue malakoff", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "20 rue Jean Mermoz", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "26 Rue Louis David", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "3 rue arnau de villanova", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "5 rue de la tour d’Auvergne", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "8 avenue de la côte vermeille", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "3 rue docteur Amédée Cadène", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "5 rue de rivoli", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "3 Imp. Jean Philippe Rameau", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "34 Rue Diderot", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "5 Rue de la Tour d'Auvergne", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "7 Rue Danton", "postcode": "66250", "city": "Saint-Laurent-de-la-Salanque", "done": false}, {"street": "18 rue duquesne", "postcode": "66000", "city": "Saint-Laurent-de-la-Salanque", "done": false}], "Argelès-sur-Mer": [{"street": "14 rue Paul Claudel", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "58 Rue Jean Moulin", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "Camping le pearl argeles", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "10 rue Jean Jacques rousseau", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "10 rue de la concorde", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "2 rue André malraux", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "25 avenue Molière", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "6 rue Claude salvy", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "755 avenue du tech", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "78 bis avenue du 8 mai 1945", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "Rue des jacobins", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "Fran prix", "postcode": "66750", "city": "Argelès-sur-Mer", "done": false}, {"street": "11 rue Bernard berenger", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "Route de Collioure", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "5 impasse Edmond brazes", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "10 Rue du Vercors", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "12 Rue de Bel air", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "2556 Rte de Collioure,camping la coste rouge", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "5 Rue Frédéric Mistral", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "5 Rue Simona Gay", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "5 Rue des Timoniers", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "5 bis rue Frédéric Mistral", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "9 Imp. des Huppes", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "9 Pl. Raimond de Tatzó", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "Camping L'Hippocampe", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "Camping La Sirène", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}, {"street": "Camping Le Roussillonnais", "postcode": "66700", "city": "Argelès-sur-Mer", "done": false}], "Alenya": [{"street": "16 avenue de perpignan", "postcode": "66200", "city": "Alenya", "done": false}, {"street": "Mas Blanc Mas BGS D39 route de Théza", "postcode": "66200", "city": "Alenya", "done": false}], "Baho": [{"street": "17 RUE DU PARDAL", "postcode": "66540", "city": "Baho", "done": false}, {"street": "16 Rue Neuve", "postcode": "66540", "city": "Baho", "done": false}, {"street": "17 Rue des Eaux Vives", "postcode": "66540", "city": "Baho", "done": false}, {"street": "17 rue des eaux vives baho", "postcode": "66540", "city": "Baho", "done": false}, {"street": "56 avenue des Pyrénées", "postcode": "66540", "city": "Baho", "done": false}], "Bages": [{"street": "2 rue André Chénier", "postcode": "66670", "city": "Bages", "done": false}, {"street": "7 Rue François Arago", "postcode": "66670", "city": "Bages", "done": false}], "Baixas": [{"street": "2 impasse du bail", "postcode": "66390", "city": "Baixas", "done": false}, {"street": "47 Rue Dom. Brial", "postcode": "66390", "city": "Baixas", "done": false}], "Banyuls Dels Aspres": [{"street": "4 rue des Alberes", "postcode": "66300", "city": "Banyuls Dels Aspres", "done": false}, {"street": "3 Rue du Canigou", "postcode": "66300", "city": "Banyuls Dels Aspres", "done": false}], "Le Barcarès": [{"street": "Résidence Marina Soleil Bleu", "postcode": "66350", "city": "Le Barcarès", "done": false}, {"street": "5avéue des disses", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "Naia Village", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "Place de la republique", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "Camping presqu'île du Barcarès", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "10 Rue du Mas de la Grêle", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "111 boulevard du 14 juillet", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "12 Quai des Pyrénées", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "2 Imp. des Petits Loups", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "3 Av. du Racou residence les camelias apt 39", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "3 Av. du Racou", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "36 Rue des Lamparos", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "5 Av. Dominica", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "5 Av. des Dosses", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "Impasse des Berges de l'Agly", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "Résidence l'Hacienda", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "The Originals City, Relax Hôtel - Avenue de Thalassa", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "Quai des tourettes", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "Route de saint Laurent", "postcode": "66420", "city": "Le Barcarès", "done": false}, {"street": "9 avenue de la grande plage Apt E12 résidence les Marines", "postcode": "66420", "city": "Le Barcarès", "done": false}], "Beauvais": [{"street": "19 Rue Claudie Haignere", "postcode": "66530", "city": "Beauvais", "done": false}], "Bompas": [{"street": "13 Rue de Paradis", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "18 rue de Bretagne", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "2 Rue St Etienne", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "2 rue Saint Etienne", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "24 avenue du haut vernet", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "25 av de la tet", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "27 rue marechal foch", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "4 avenue des olivier", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "4 avenue des oliviers", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "5 rue Henri Salvador", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "50 Avenue de la Salanque", "postcode": "66430", "city": "Bompas", "done": false}, {"street": "1150 chemin de charlemagne", "postcode": "66430", "city": "Bompas", "done": false}], "Brouilla": [{"street": "4 rue de la tramontane", "postcode": "66200", "city": "Brouilla", "done": false}], "Cabestany": [{"street": "17 rue du Muscat", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "1Allée du comité de baixas", "postcode": "66000", "city": "Cabestany", "done": false}, {"street": "1 Rue du Comité de Baixas", "postcode": "66100", "city": "Cabestany", "done": false}, {"street": "1Allée du comité de baixas", "postcode": "66100", "city": "Cabestany", "done": false}, {"street": "12 bis Cr Raymond de Miraval", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "14 rue des géraniums", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "15 Rue Fernand Grenier", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "17 Rue du Comité de Baixa , bat b", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "17 Rue du Comité de Baixas , bat b", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "17 allée du comité de Baixas", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "1Allée du comité de baixas", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "23 rue edouart vaillant", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "27 avenue de Provence", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "3 Rue Georges Clemenceau", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "38 Rue Fernand Grenier", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "9 Rue du 17ème Régiment d'Infanterie", "postcode": "66330", "city": "Cabestany", "done": false}, {"street": "Espace Nelson Mandela - Complexe sportif la Germanor", "postcode": "66330", "city": "Cabestany", "done": false}], "Canet En Roussillon": [{"street": "8 avenue des haut de Canet appartement 8 bat 1 résidence la figarasse", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "1 rue de la liberté", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "141 avenue de haut de canet", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "142 avenue des hauts de canet Malibu village bâtiment sierra", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "16 avenue guy drut clap cine", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "3 rue d’Italie", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "34 boulevards tixador", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "34bis avenue des floralies", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "48 avenue des coteaux", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "72 Avenue des Côteaux", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "Avenue les hauts de canet", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "6 avenue Sauvy", "postcode": "66240", "city": "Canet En Roussillon", "done": false}, {"street": "1 Rue du Danemark et de Suisse", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "1 Rue Île de France", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "104 Prom. de la Côte Vermeille", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "11 Imp. Hyacinthe Rigaud", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "12 Rue Déodat de Sévérac", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "14 Rue du Pressoir", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "140 avenue des hauts de canet", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "15 Rue des Roses", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "18 Imp. du Lion", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "25 boulevard de la jetee", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "28 Av. de Catalogne", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "3 Av. de Toulouse", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "31 Av. de Capestang", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "41 Prom. de la Côte Vermeille", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "46 Rue de la Marinade", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "Avenue de Saint-Nazaire", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "Malibu Village 141 avenue des hauts de canet", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "Mar Estang - Camping Siblu", "postcode": "66140", "city": "Canet En Roussillon", "done": false}, {"street": "ibis Styles Perpignan Canet-en-Roussillon", "postcode": "66140", "city": "Canet En Roussillon", "done": false}], "Claira": [{"street": "8 rue Maréchal Joffre", "postcode": "66530", "city": "Claira", "done": false}, {"street": "14 Rue Charles Trenet", "postcode": "66530", "city": "Claira", "done": false}, {"street": "14 rue saint narcisses", "postcode": "66530", "city": "Claira", "done": false}, {"street": "19 Rue Claudie Haigneré", "postcode": "66530", "city": "Claira", "done": false}, {"street": "21 Rue Hélène Boucher", "postcode": "66530", "city": "Claira", "done": false}, {"street": "22 Rue de l'Anguille", "postcode": "66530", "city": "Claira", "done": false}, {"street": "38 Chemin du Mas Bordas maison 16e", "postcode": "66530", "city": "Claira", "done": false}, {"street": "38 chemin du Mas bordas", "postcode": "66530", "city": "Claira", "done": false}, {"street": "38 chemin du mas bordas maison 16 E", "postcode": "66530", "city": "Claira", "done": false}, {"street": "9 Rue St Maurice", "postcode": "66530", "city": "Claira", "done": false}, {"street": "9 rue Saint Maurice", "postcode": "66530", "city": "Claira", "done": false}, {"street": "Chemin du Mas Rovira la torre sud", "postcode": "66530", "city": "Claira", "done": false}], "Corneilla Del Vercol": [{"street": "3 rue des lauriers", "postcode": "66200", "city": "Corneilla Del Vercol", "done": false}, {"street": "8 allée du Canigou", "postcode": "66200", "city": "Corneilla Del Vercol", "done": false}, {"street": "4 rue Simone de Beauvoir", "postcode": "66200", "city": "Corneilla Del Vercol", "done": false}, {"street": "Mas de l'Aire", "postcode": "66200", "city": "Corneilla Del Vercol", "done": false}], "Canet": [{"street": "Résidence copacobana", "postcode": "66000", "city": "Canet", "done": false}, {"street": "25 boulevard de la jetee  bat A appt 15", "postcode": "66140", "city": "Canet", "done": false}, {"street": "Avenue du capitaine Delestrain", "postcode": "66140", "city": "Canet", "done": false}, {"street": "Résidence copacobana", "postcode": "66200", "city": "Canet", "done": false}], "Canet En Roussilon": [{"street": "14 Rue du Pressoir", "postcode": "66140", "city": "Canet En Roussilon", "done": false}], "Canet Plage": [{"street": "1 rue du Danemark résidence Cariocas bâtiment b", "postcode": "66140", "city": "Canet Plage", "done": false}], "Canhoes": [{"street": "3 rue des mimosas", "postcode": "66680", "city": "Canhoes", "done": false}], "Cannet Roussillon": [{"street": "46 rue de la marinade", "postcode": "66140", "city": "Cannet Roussillon", "done": false}], "Canohes": [{"street": "1 rue Éliane Thibault comelade appartement 125", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "1 rue Éliane Thibault comelade", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "2 rue des vignes", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "5ter rue de la pourtalade", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "8 rue edmond brazes", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "13 Rue Auguste Estrade", "postcode": "66000", "city": "Canohes", "done": false}, {"street": "1 Rue Salvador Dali", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "10 Rue de la Poste", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "10 Rue du 11 Novembre", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "12 Rue Pompeu Fabra", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "2 Imp. Joseph Sebastia Pons", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "8 Av. el Crusat", "postcode": "66680", "city": "Canohes", "done": false}, {"street": "Le Mas Saint Antoine", "postcode": "66680", "city": "Canohes", "done": false}], "Collioure": [{"street": "2 rue du puit saint Dominique", "postcode": "66190", "city": "Collioure", "done": false}, {"street": "Place Jean Jaurès", "postcode": "66190", "city": "Collioure", "done": false}], "Corneilla La Riviere": [{"street": "113 Nord Route nationale", "postcode": "66550", "city": "Corneilla La Riviere", "done": false}, {"street": "113 route nationale", "postcode": "66550", "city": "Corneilla La Riviere", "done": false}], "Elne": [{"street": "1 Rue Josep de la Trinxeria", "postcode": "66200", "city": "Elne", "done": false}, {"street": "10 Rue de la Chicane", "postcode": "66200", "city": "Elne", "done": false}, {"street": "10 Rue de la Gendarmerie", "postcode": "66200", "city": "Elne", "done": false}, {"street": "16 Rue Joseph Planes", "postcode": "66200", "city": "Elne", "done": false}, {"street": "16 rue Georges Brassens", "postcode": "66200", "city": "Elne", "done": false}, {"street": "2 Rue du colonel arnaud beltram", "postcode": "66200", "city": "Elne", "done": false}, {"street": "28 Rue de la Gangue", "postcode": "66200", "city": "Elne", "done": false}, {"street": "3 Blvd du Passage de la Baneta", "postcode": "66200", "city": "Elne", "done": false}, {"street": "35 rue rosa paks", "postcode": "66200", "city": "Elne", "done": false}, {"street": "35 rue rosa parks", "postcode": "66200", "city": "Elne", "done": false}, {"street": "4 rue du conflent", "postcode": "66200", "city": "Elne", "done": false}, {"street": "6 Rue du Moulin", "postcode": "66200", "city": "Elne", "done": false}, {"street": "8 route national", "postcode": "66200", "city": "Elne", "done": false}, {"street": "Cedric", "postcode": "66200", "city": "Elne", "done": false}, {"street": "Mas le palol", "postcode": "66200", "city": "Elne", "done": false}], "Espira De L Agly": [{"street": "11 rue du quatorze juillet", "postcode": "66600", "city": "Espira De L Agly", "done": false}], "Espira De L'agly": [{"street": "3bis rue pasteur impasse rouget de l'Isle", "postcode": "66600", "city": "Espira De L'agly", "done": false}, {"street": "11 Rue du Quatorze Juillet", "postcode": "66600", "city": "Espira De L'agly", "done": false}, {"street": "4 Rue Ull de la Mola", "postcode": "66600", "city": "Espira De L'agly", "done": false}, {"street": "6 Rue du Dr Coste", "postcode": "66600", "city": "Espira De L'agly", "done": false}], "Fourques": [{"street": "5 Carrer Gran", "postcode": "66300", "city": "Fourques", "done": false}], "Le Soler": [{"street": "13 RUE MARECHAL JOFFRE", "postcode": "66170", "city": "Le Soler", "done": false}, {"street": "13 RUE MARECHAL JOFFRE", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "8 rue Albert bausil", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "13 Rue du Maréchal Joffre", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "15 Rue Léon Blum", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "2 rue des Genévriers", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "35 Rue du Conflent", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "4 Rue Joan Cayrol", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "Rue de l'Abbé Pierre", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "23 rue des ormes", "postcode": "66270", "city": "Le Soler", "done": false}, {"street": "61 avenue Jean Jaurès", "postcode": "66270", "city": "Le Soler", "done": false}], "Latour Bas Elne": [{"street": "10 Rue de la poste", "postcode": "66200", "city": "Latour Bas Elne", "done": false}, {"street": "1 rue de la tramontane", "postcode": "66200", "city": "Latour Bas Elne", "done": false}, {"street": "18 rue du Grenache", "postcode": "66200", "city": "Latour Bas Elne", "done": false}, {"street": "30 Rue de la tramontane", "postcode": "66200", "city": "Latour Bas Elne", "done": false}, {"street": "1 Rue du Carignan", "postcode": "66200", "city": "Latour Bas Elne", "done": false}, {"street": "17 Rue Saint-Pierre", "postcode": "66200", "city": "Latour Bas Elne", "done": false}, {"street": "22 Av. de Saint-Cyprien", "postcode": "66200", "city": "Latour Bas Elne", "done": false}], "Le Havre": [{"street": "85 Rue du Maréchal Joffre", "postcode": "66000", "city": "Le Havre", "done": false}], "Llupia": [{"street": "4 rue de la têt bat A1", "postcode": "66300", "city": "Llupia", "done": false}], "Marseille": [{"street": "Cours Lazare escarguel", "postcode": "66000", "city": "Marseille", "done": false}], "Millas": [{"street": "26 Carrer del Rec", "postcode": "66170", "city": "Millas", "done": false}, {"street": "3 rue jean bourrat", "postcode": "66170", "city": "Millas", "done": false}, {"street": "64 Av. Jean Jaurès", "postcode": "66170", "city": "Millas", "done": false}], "Montescot": [{"street": "Parking Intermarché", "postcode": "66200", "city": "Montescot", "done": false}], "Pia": [{"street": "3 rue des oranger", "postcode": "66380", "city": "Pia", "done": false}, {"street": "4 rue Louise Michel", "postcode": "66380", "city": "Pia", "done": false}, {"street": "1 bis chemin des vignes", "postcode": "66380", "city": "Pia", "done": false}, {"street": "1 impasse des capucines", "postcode": "66380", "city": "Pia", "done": false}, {"street": "1 rue des iris", "postcode": "66380", "city": "Pia", "done": false}, {"street": "1 rue iris", "postcode": "66380", "city": "Pia", "done": false}, {"street": "13 c  rue. Du Muscat ressidence l aramon", "postcode": "66380", "city": "Pia", "done": false}, {"street": "16 RUE du serpolet", "postcode": "66380", "city": "Pia", "done": false}, {"street": "2 Rue Joseph Sébastien Pons", "postcode": "66380", "city": "Pia", "done": false}, {"street": "2 Rue des Pins", "postcode": "66380", "city": "Pia", "done": false}, {"street": "20 Chem. des Charettes", "postcode": "66380", "city": "Pia", "done": false}, {"street": "20 Rue de la Llabanere", "postcode": "66380", "city": "Pia", "done": false}, {"street": "25 Rue du Chenin Blanc", "postcode": "66380", "city": "Pia", "done": false}, {"street": "25 rue du clos des palmiers", "postcode": "66380", "city": "Pia", "done": false}, {"street": "30 Av. du Stade", "postcode": "66380", "city": "Pia", "done": false}, {"street": "32 Rte de Perpignan", "postcode": "66380", "city": "Pia", "done": false}, {"street": "42 chemin de l'étang long", "postcode": "66380", "city": "Pia", "done": false}, {"street": "5 rue de gentianes", "postcode": "66380", "city": "Pia", "done": false}, {"street": "6 rue costabonne", "postcode": "66380", "city": "Pia", "done": false}, {"street": "61 Rue du Clos des Palmiers", "postcode": "66380", "city": "Pia", "done": false}, {"street": "7 Rue Des Cormorans", "postcode": "66380", "city": "Pia", "done": false}, {"street": "8 rue des citronniers", "postcode": "66380", "city": "Pia", "done": false}, {"street": "90 Chem. des Vignes", "postcode": "66380", "city": "Pia", "done": false}, {"street": "Espace sant jordi", "postcode": "66380", "city": "Pia", "done": false}, {"street": "Lidl", "postcode": "66380", "city": "Pia", "done": false}], "Ponteilla": [{"street": "2 rue des fauvettes", "postcode": "66300", "city": "Ponteilla", "done": false}], "Port Vendres": [{"street": "5 Boulevard Du 8 Mai 1945", "postcode": "66660", "city": "Port Vendres", "done": false}, {"street": "5 Bd du Huit Mai 1945", "postcode": "66660", "city": "Port Vendres", "done": false}], ")": [{"street": "58 rue Maurice Barres", "postcode": "66000", "city": ")", "done": false}], "Peyrestortes": [{"street": "3 place de la République", "postcode": "66600", "city": "Peyrestortes", "done": false}, {"street": "Mairie de Peyrestorte", "postcode": "66600", "city": "Peyrestortes", "done": false}, {"street": "Rue Louis arago", "postcode": "66600", "city": "Peyrestortes", "done": false}, {"street": "Mairie", "postcode": "66600", "city": "Peyrestortes", "done": false}], "Peyristorte": [{"street": "Poste", "postcode": "66100", "city": "Peyristorte", "done": false}], "Pezilla La Riviere": [{"street": "4 Rue du 11 Novembre 1918", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}, {"street": "4 rue 11 novenMère", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}, {"street": "26 rue des aires", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}, {"street": "11 Rue Portal d'Amont", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}, {"street": "15 Rue Portal d'Amont", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}, {"street": "17 Rue Paul Astor", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}, {"street": "25 Rue de l'Égalité", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}, {"street": "5 Rdpt des Kiwis", "postcode": "66370", "city": "Pezilla La Riviere", "done": false}], "Pollestres": [{"street": "1 Rue prairial", "postcode": "66000", "city": "Pollestres", "done": false}, {"street": "4 place de l eglise", "postcode": "66000", "city": "Pollestres", "done": false}, {"street": "16 Cité le Moulin", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "16 avenue de Canohes", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "2 Av. Laure Manaudou", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "2 avenue laure manaudou résidence", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "4 place de l eglise", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "4 place de l'église", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "4 place de la eglise", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "7 allée Felicia ballanger", "postcode": "66450", "city": "Pollestres", "done": false}, {"street": "Rue prairial, 1", "postcode": "66450", "city": "Pollestres", "done": false}], "Rivesaltes": [{"street": "24 rue Michel boher", "postcode": "66000", "city": "Rivesaltes", "done": false}, {"street": "10 Rue Danton", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "13 Av. Gambetta", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "18 Imp. de Bruxelles", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "19 Av. Louis Blanc", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "19 Av. de la Mourere", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "2 rue de l Orphéon", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "2 rue de la république", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "21 Rue de Romani", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "21 avenue de romani", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "27 Rue Jean Jaurès", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "27 avenue Louis Blanc", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "3 rue Ambroise Paré", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "4 rue Edgard Quinet", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "41 Rue du 4 Septembre", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "42 Rue Van Gogh", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "42 rue de la république", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "7 Imp. de Bruxelles", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "7 avenue Alfred sauvy", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "7 avenue de romani", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "8 rue marceau, Réz de chaussee", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "9 Av. Louis Blanc", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "Ancien chemin de pia", "postcode": "66600", "city": "Rivesaltes", "done": false}, {"street": "Mairie de Rivesaltes", "postcode": "66600", "city": "Rivesaltes", "done": false}], "Saint Cyprien": [{"street": "Rue Verdi résidence Pierres de jade", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Résidence port cypriano", "postcode": "66530", "city": "Saint Cyprien", "done": false}, {"street": "7impasse jean bordes", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Bd desnoyer", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "10 rue condorcet", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "14 quai Arthur rimbaud", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "22 rue lautréamont", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "4 rue gaston chereau résidence les oliviers", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Le golf de saint cyprien", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Rue Gaston chéreau", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Résidence du Golf", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "15 Rue du docteur Schweitzer", "postcode": "66200", "city": "Saint Cyprien", "done": false}, {"street": "1 Rue Pierre Mac Orlan", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "12 Rue Sainte-Beuve", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "13 Rue Henry Bordeaux", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "15 Bd François Desnoyer", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "2 Imp. Paul Pégar", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "28 Av. Armand Lanoux", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "30 Pl. Henri Bergson", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "5 Rue Eugène Delacroix", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "7 Imp. Jean Bordes", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "75 Bd François Desnoyer", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "8 rue de Condorcet ibis résidence", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Copropriété Cap Marine", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Impasse Edgar Varèse", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Les Bulles de Mer", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Rue Gaston Cherau", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "Résidence Les Lamparos, 47 rue henry bordeaux", "postcode": "66750", "city": "Saint Cyprien", "done": false}, {"street": "214 Rue de suede", "postcode": "66570", "city": "Saint Cyprien", "done": false}], "St Cyprien": [{"street": "27 avenue francois desnoyer", "postcode": "66750", "city": "St Cyprien", "done": false}, {"street": "15 rue vaugelas", "postcode": "66750", "city": "St Cyprien", "done": false}, {"street": "Rue Verdi Résidence Pierre de Jade", "postcode": "66750", "city": "St Cyprien", "done": false}, {"street": "10 Rue Guillaume Appolinaire", "postcode": "66750", "city": "St Cyprien", "done": false}, {"street": "10 rue condorcet", "postcode": "66750", "city": "St Cyprien", "done": false}, {"street": "39 rue docteure schweitzer", "postcode": "66750", "city": "St Cyprien", "done": false}, {"street": "39 rue docteur Schweitzer", "postcode": "66750", "city": "St Cyprien", "done": false}], "St Esteve": [{"street": "42 MAS COT", "postcode": "66240", "city": "St Esteve", "done": false}, {"street": "31 rue François Mitterrand", "postcode": "66240", "city": "St Esteve", "done": false}], "St Feliu D Avall": [{"street": "6 bis rue de l'agly", "postcode": "66170", "city": "St Feliu D Avall", "done": false}], "Sainte Marie La Mer": [{"street": "LOT LE BAOU, 7 RUE DES TROUVERES", "postcode": "66470", "city": "Sainte Marie La Mer", "done": false}, {"street": "1 rue des Corbières", "postcode": "66470", "city": "Sainte Marie La Mer", "done": false}, {"street": "3 bis rue derrière la muraille", "postcode": "66470", "city": "Sainte Marie La Mer", "done": false}, {"street": "13 résidence les ondines", "postcode": "66470", "city": "Sainte Marie La Mer", "done": false}, {"street": "Camping de la plage", "postcode": "66470", "city": "Sainte Marie La Mer", "done": false}], "Saint Esteve": [{"street": "15 rue olympe de gouges", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "28 bis avenue du général de Gaulle. Résidence les Terrasses del Rey. Bât A1. Appartement 32", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "31 rue François Mitterrand", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "38 avéue gilbert brutus", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "42 rue du fournas", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "1 Rue de la Sardane", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "10 Rue de Champagne", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "14 Rte de Perpignan", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "20 Rue de Sydney", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "3 Pl. Pierre de Coubertin", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "5 Rue du Pla Guillem", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "55 Bd du Canigou", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "Collège Le Ribéral", "postcode": "66240", "city": "Saint Esteve", "done": false}, {"street": "Résidence Le Domaine D'Aguzan", "postcode": "66240", "city": "Saint Esteve", "done": false}], "Saint Cyprien Plage": [{"street": "2 rue jean Sébastien Bach", "postcode": "66750", "city": "Saint Cyprien Plage", "done": false}], "Saint Feliu D Avall": [{"street": "7 bis impasse de la côte", "postcode": "66170", "city": "Saint Feliu D Avall", "done": false}, {"street": "7 rue de la côte", "postcode": "66170", "city": "Saint Feliu D Avall", "done": false}], "Saint Hippolyte": [{"street": "3 avenue Jeanne d'arc", "postcode": "66510", "city": "Saint Hippolyte", "done": false}, {"street": "12 Rue du 14 Juillet", "postcode": "66510", "city": "Saint Hippolyte", "done": false}], "Saint Nazaire": [{"street": "1 rue du littoral", "postcode": "66570", "city": "Saint Nazaire", "done": false}, {"street": "12 Rue de l'Alicante", "postcode": "66570", "city": "Saint Nazaire", "done": false}], "Saint Andre": [{"street": "7 Impasse du Conflent", "postcode": "66690", "city": "Saint Andre", "done": false}], "Saint Feliu D'avall": [{"street": "11 rue du presbytère", "postcode": "66170", "city": "Saint Feliu D'avall", "done": false}, {"street": "6 BIS RUE DE L'AGLY", "postcode": "66170", "city": "Saint Feliu D'avall", "done": false}], "Sainte-Marie-la-Mer": [{"street": "1 Rue Pasteur", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}, {"street": "17 Rue des Chênes", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}, {"street": "19 Rue des Villas", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}, {"street": "21 Rue des Bougainvilliers", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}, {"street": "36 Rés les Sablettes", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}, {"street": "Avenue de las Illas", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}, {"street": "Camping Municipal de la Plage - Sainte Marie la Mer", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}, {"street": "Rue de l'Étoile de Mer", "postcode": "66470", "city": "Sainte-Marie-la-Mer", "done": false}], "Saleilles": [{"street": "2 Av. Arthur Conte", "postcode": "66280", "city": "Saleilles", "done": false}, {"street": "3 rue de la serdagne", "postcode": "66280", "city": "Saleilles", "done": false}, {"street": "6 Av. Gino Massarotto", "postcode": "66280", "city": "Saleilles", "done": false}], "St Marie La Mer": [{"street": "13 résidence les ondines", "postcode": "66470", "city": "St Marie La Mer", "done": false}], "Toulouges": [{"street": "44 b Rue de gerone RES Le Pret Catalan 2 BAT B APT 13", "postcode": "66350", "city": "Toulouges", "done": false}, {"street": "6 rue Mère Térésa Résidence frida kahlo", "postcode": "66350", "city": "Toulouges", "done": false}, {"street": "1 Pl. de la République", "postcode": "66350", "city": "Toulouges", "done": false}, {"street": "3 Rue du Beffroi", "postcode": "66350", "city": "Toulouges", "done": false}, {"street": "3 eue du beffroi", "postcode": "66350", "city": "Toulouges", "done": false}, {"street": "8 Rue du Beffroi", "postcode": "66350", "city": "Toulouges", "done": false}, {"street": "Mas Baillarou", "postcode": "66350", "city": "Toulouges", "done": false}, {"street": "Mas baillairo", "postcode": "66350", "city": "Toulouges", "done": false}], "Trouillas": [{"street": "15 rue du jasmin", "postcode": "66300", "city": "Trouillas", "done": false}, {"street": "2 Rue du Pou de la Pigne", "postcode": "66300", "city": "Trouillas", "done": false}, {"street": "19 rue d alger", "postcode": "66300", "city": "Trouillas", "done": false}], "Theza": [{"street": "1 boulevard de l'oratori", "postcode": "66200", "city": "Theza", "done": false}, {"street": "7 rue des palmiers", "postcode": "66200", "city": "Theza", "done": false}, {"street": "11 Rue des Ormes", "postcode": "66200", "city": "Theza", "done": false}], "Thuir": [{"street": "11 Rue Albert Bausil", "postcode": "66300", "city": "Thuir", "done": false}, {"street": "3 Rue du Bélier", "postcode": "66300", "city": "Thuir", "done": false}, {"street": "36 Rue Marcel Pagnol", "postcode": "66300", "city": "Thuir", "done": false}, {"street": "4 impasse Anatole France", "postcode": "66300", "city": "Thuir", "done": false}, {"street": "6 rue de la Cellera", "postcode": "66300", "city": "Thuir", "done": false}, {"street": "7 avenue des sports", "postcode": "66300", "city": "Thuir", "done": false}, {"street": "Mas Ripoll", "postcode": "66300", "city": "Thuir", "done": false}, {"street": "Résidence la canteranne avenue du Roussillon", "postcode": "66300", "city": "Thuir", "done": false}], "Toreilles": [{"street": "1 bis avenue des Pyrénées", "postcode": "66440", "city": "Toreilles", "done": false}, {"street": "12 lotissement les patios", "postcode": "66440", "city": "Toreilles", "done": false}, {"street": "12 rue du canigou", "postcode": "66440", "city": "Toreilles", "done": false}], "Tresserre": [{"street": "7 Rue du Canigou", "postcode": "66300", "city": "Tresserre", "done": false}], "Villelongue-de-la-Salanque": [{"street": "12 rue du fer à cheval,", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "18 rue saint Lucie", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "11 rue", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "Rue durera cheval", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "4 avenue du littoral", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "Mas gual", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "Rue du fer à cheval", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "14 avenue Perpignan", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "15 Rue des Chardonnerets", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}, {"street": "58 Av. du Littoral", "postcode": "66410", "city": "Villelongue-de-la-Salanque", "done": false}], "Villeneuve La Riviere": [{"street": "4 rue neuve", "postcode": "66000", "city": "Villeneuve La Riviere", "done": false}], "Villeneuve De La Raho": [{"street": "1 bis Mas saint paul chemin du mas auriol", "postcode": "66180", "city": "Villeneuve De La Raho", "done": false}, {"street": "Route de bages", "postcode": "66000", "city": "Villeneuve De La Raho", "done": false}, {"street": "5 Rue des Mimosas", "postcode": "66180", "city": "Villeneuve De La Raho", "done": false}, {"street": "3 Place De La Couloumine", "postcode": "66180", "city": "Villeneuve De La Raho", "done": false}, {"street": "8 Av. Salvador Dali", "postcode": "66180", "city": "Villeneuve De La Raho", "done": false}, {"street": "Chemin de las Serres", "postcode": "66180", "city": "Villeneuve De La Raho", "done": false}], "Vingrau": [{"street": "20 rue rameau", "postcode": "66600", "city": "Vingrau", "done": false}], "Cases De Pene": [{"street": "6 traverse de Baixas", "postcode": "66600", "city": "Cases De Pene", "done": false}]};

const LS_KEY = "tournee_v7_data";
const LS_MAIRIES = "tournee_v7_mairies";
const LS_LAST_CITY = "tournee_v7_last_city";

const citySelect = document.getElementById("citySelect");
const addrList = document.getElementById("addrList");
const statusEl = document.getElementById("status");
const cityMeta = document.getElementById("cityMeta");
const btnOptimize = document.getElementById("btnOptimize");
const btnAdd = document.getElementById("btnAdd");

// modal
const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");
const modalSave = document.getElementById("modalSave");
const modalCity = document.getElementById("modalCity");
const modalStreet = document.getElementById("modalStreet");
const modalPostcode = document.getElementById("modalPostcode");

let data = loadData();
let editContext = null; // {city, id}

registerSW();

function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
}

function loadData(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw) return sanitizeData(JSON.parse(raw));
  }catch(e){}
  // deep copy
  return sanitizeData(JSON.parse(JSON.stringify(INITIAL_DATA)));
}
function saveData(){
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function loadMairies(){
  try{
    return JSON.parse(localStorage.getItem(LS_MAIRIES) || "{}");
  }catch(e){ return {}; }
}
function saveMairies(m){ localStorage.setItem(LS_MAIRIES, JSON.stringify(m)); }

function setStatus(msg, isError=false){
  statusEl.textContent = msg || "";
  statusEl.style.color = isError ? "var(--bad)" : "var(--muted)";
}

function stripAccents(s){
  return (s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"");
}

function normSpaces(s){ return (s||"").replace(/\s+/g," ").trim(); }

function normCommune(name){
  const raw = String(name||"");
  const low = normSpaces(stripAccents(raw.toLowerCase()
    .replace(/\bfrance\b/g,"")
    .replace(/\b66\b/g,"")
  ));

  // Exclusions (hors zone / incohérent)
  if(low.includes("marseille")) return "__DROP__";
  if(low.includes("le havre") || low==="havre") return "__DROP__";
  if(low.includes("beauvais")) return "__DROP__";
  if(low.includes("vingrau")) return "__DROP__";

  // Canonicalisations
  if(low.includes("argeles")) return "Argelès-sur-Mer";
  if(low.includes("torreil")) return "Torreilles";
  if(low.includes("villelongue")) return "Villelongue-de-la-Salanque";
  if(low.includes("sainte marie") || low.includes("ste marie")) return "Sainte-Marie-la-Mer";
  if(low.includes("perpignan")) return "Perpignan";
  if(low.includes("peyrestort") || low.includes("peyris")) return "Peyrestortes";
  if(low.includes("laurent") && low.includes("salanque")) return "Saint-Laurent-de-la-Salanque";

  // Canet variants: canet / canet plage / canet en rous(s)illon
  if(low.includes("canet")) return "Canet-en-Roussillon";

  // Espira de l'Agly variants
  if(low.includes("espira") && low.includes("agly")) return "Espira-de-l'Agly";
  if(low.includes("espira") && (low.includes("l agly") || low.includes("lagly"))) return "Espira-de-l'Agly";

  // Saint-Cyprien variants
  if(low.includes("saint cyprien") || low.includes("st cyprien")) return "Saint-Cyprien";

  // Saint-Féliu d'Avall variants (typos)
  if(low.includes("feliu") || low.includes("felyu")) return "Saint-Féliu-d'Avall";

  // Default: cleaned original (capitalisation kept roughly)
  return raw.trim() || "";
}

function normStreet(s){
  let x = stripAccents(String(s||"").toLowerCase());
  x = x.replace(/[,.;]/g," ");
  x = x.replace(/\b(france)\b/g,"");
  x = x.replace(/\bavenue\b/g,"av").replace(/\bboulevard\b/g,"bd").replace(/\bplace\b/g,"pl");
  x = normSpaces(x);
  return x;
}

function sanitizeData(input){
  // 1) Flatten and normalize entries
  const flat = [];
  for(const [cityKey, arr] of Object.entries(input||{})){
    const canonKey = normCommune(cityKey);
    if(!canonKey || canonKey==="__DROP__") continue;
    for(const a of (arr||[])){
      const street = String(a.street||"").trim();
      const postcode = String(a.postcode||"").trim();
      let city = normCommune(a.city || canonKey) || canonKey;
      if(!city || city==="__DROP__") continue;

      // Exclusions by postcode / department constraints
      if(postcode === "66250") continue; // demandé : exclure 66250
      if(postcode && !/^66\d{3}$/.test(postcode)) continue;

      flat.push({
        street,
        postcode,
        city,
        done: !!a.done,
        lat: (a.lat!=null ? Number(a.lat) : null),
        lon: (a.lon!=null ? Number(a.lon) : null)
      });
    }
  }

  // 2) Infer dominant city per postcode (to fix mismatches like "66530 Beauvais")
  const pcCount = {};
  for(const a of flat){
    if(!a.postcode) continue;
    const pc = a.postcode;
    pcCount[pc] ||= {};
    pcCount[pc][a.city] = (pcCount[pc][a.city]||0) + 1;
  }
  const dominantCityByPc = {};
  for(const [pc, counts] of Object.entries(pcCount)){
    let bestCity = null, best = -1;
    for(const [c, n] of Object.entries(counts)){
      if(n>best){ best=n; bestCity=c; }
    }
    if(bestCity) dominantCityByPc[pc] = bestCity;
  }

  // 3) Apply postcode->city correction
  for(const a of flat){
    if(a.postcode && dominantCityByPc[a.postcode]){
      a.city = dominantCityByPc[a.postcode];
    }
  }

  // 4) Rebuild buckets + strong dedupe (street+postcode+city)
  const out = {};
  const seen = new Set();
  for(const a of flat){
    const key = `${normStreet(a.street)}|${a.postcode}|${stripAccents(a.city.toLowerCase())}`;
    if(seen.has(key)) continue;
    seen.add(key);
    out[a.city] ||= [];
    out[a.city].push(a);
  }

  // 5) Remove any garbage city keys that look like postcodes
  for(const k of Object.keys(out)){
    if(/^\d{5}$/.test(k)) delete out[k];
  }
  return out;
}

function addrKey(a){
  const city = stripAccents(normCommune(a.city).toLowerCase());
  const pc = String(a.postcode||"").trim();
  const st = normStreet(a.street);
  return `${st}|${pc}|${city}`;
}

function genId(){
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getCities(){
  return Object.keys(data).sort((a,b)=>a.localeCompare(b,"fr"));
}

function fillCitySelect(){
  const cities = getCities();
  citySelect.innerHTML = "";
  modalCity.innerHTML = "";
  for(const c of cities){
    const opt1 = document.createElement("option");
    opt1.value = c; opt1.textContent = c;
    citySelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = c; opt2.textContent = c;
    modalCity.appendChild(opt2);
  }
  const last = localStorage.getItem(LS_LAST_CITY);
  if(last && cities.includes(last)) citySelect.value = last;
}

function haversineKm(lat1, lon1, lat2, lon2){
  const R = 6371;
  const toRad = d => d*Math.PI/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function nominatimSearch(params){
  const url = new URL("https://nominatim.openstreetmap.org/search");
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v);
  // Nominatim asks for a valid User-Agent; browser sets one, but we add accept-language.
  const res = await fetch(url.toString(), {
    headers: {
      "Accept":"application/json",
      "Accept-Language":"fr"
    }
  });
  if(!res.ok) throw new Error("Erreur réseau Nominatim");
  return await res.json();
}

function guessPostcodeForCity(city){
  try{
    const canon = normCommune(city);
    const arr = data[canon] || data[city] || [];
    const counts = {};
    for(const a of arr){
      if(a.postcode && /^66\d{3}$/.test(a.postcode) && a.postcode !== "66250"){
        counts[a.postcode] = (counts[a.postcode]||0) + 1;
      }
    }
    let bestPc=null, best=-1;
    for(const [pc,n] of Object.entries(counts)){
      if(n>best){ best=n; bestPc=pc; }
    }
    return bestPc;
  }catch(e){ return null; }
}
async function getMairie(city){
  const mairies = loadMairies();
  const key = stripAccents(city.toLowerCase());
  if(mairies[key]) return mairies[key];

  // 🔧 Fix ciblé : Bompas
  // Nominatim peut échouer sur "Mairie Bompas" selon les hints/typos ; on force une requête + précise
  // et on garde un fallback de coordonnées si jamais l'API renvoie 0 résultat.
  if(key === "bompas"){
    // Si déjà en cache (au cas où la clé diffère dans le stockage), on retente aussi avec une clé canonique.
    if(mairies["bompas"]) return mairies["bompas"];
    try{
      setStatus(`Géocodage de la mairie de ${city}…`);
      const resultsBompas = await nominatimSearch({
        q: "Mairie de Bompas, 12 avenue de la Salanque, 66430 Bompas, France",
        format:"jsonv2",
        addressdetails:"1",
        limit:"1",
        countrycodes:"fr"
      });
      if(resultsBompas.length){
        const r = resultsBompas[0];
        const mairie = {
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          display: r.display_name || "Mairie de Bompas"
        };
        mairies["bompas"] = mairie;
        mairies[key] = mairie;
        saveMairies(mairies);
        return mairie;
      }
    }catch(_){}
    // Fallback coordonnées (si Nominatim ne répond pas / 0 résultat)
    const mairie = { lat: 42.730316, lon: 2.935614, display: "Mairie de Bompas (fallback)" };
    mairies["bompas"] = mairie;
    mairies[key] = mairie;
    saveMairies(mairies);
    return mairie;
  }


  setStatus(`Géocodage de la mairie de ${city}…`);
  const pcHint = guessPostcodeForCity(city);
  const base = city.match(/^\d{5}$/) ? String(city) : `${city}${pcHint?` ${pcHint}`:""}`;
  const q = `Mairie ${base}, Pyrénées-Orientales, France`;
  const results = await nominatimSearch({
    q,
    format:"jsonv2",
    addressdetails:"1",
    limit:"1",
    countrycodes:"fr"
  });
  if(!results.length) throw new Error("Mairie introuvable");
  const r = results[0];
  const mairie = {
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    display: r.display_name || `Mairie ${city}`
  };
  mairies[key] = mairie;
  saveMairies(mairies);
  return mairie;
}

function isInPO(address){
  // Vérification département : code postal 66 + "Pyrénées-Orientales" si disponible
  const pc = (address.postcode||"").trim();
  if(!pc.startsWith("66")) return false;
  const txt = stripAccents(JSON.stringify(address).toLowerCase());
  if(txt.includes("pyrenees-orientales") || txt.includes("pyrenees orientales")) return true;
  // si l'API ne donne pas le département, on accepte quand même si CP 66
  return true;
}

async function geocodeAddress(street, city, postcodeOpt){
  const mairie = await getMairie(city);
  // Bias: viewbox around mairie (~25km)
  const delta = 0.22; // degrees ~ 20-25km
  const left = (mairie.lon - delta).toFixed(6);
  const right = (mairie.lon + delta).toFixed(6);
  const top = (mairie.lat + delta).toFixed(6);
  const bottom = (mairie.lat - delta).toFixed(6);

  const pcPart = postcodeOpt ? ` ${postcodeOpt}` : "";
  const q = `${street},${pcPart} ${city}, France`;

  const results = await nominatimSearch({
    q,
    format:"jsonv2",
    addressdetails:"1",
    limit:"3",
    countrycodes:"fr",
    viewbox:`${left},${top},${right},${bottom}`,
    bounded:"1"
  });
  if(!results.length) return null;

  // Pick best: in PO and close to mairie
  let best = null;
  let bestScore = Infinity;

  for(const r of results){
    const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
    const dist = haversineKm(mairie.lat, mairie.lon, lat, lon);
    const addr = r.address || {};
    const pc = (addr.postcode||"").trim();
    const okDept = isInPO(addr);
    if(!okDept) continue;
    // If selected city is a real commune (not just postcode), ensure it's not wildly different
    // We accept if within 20km of mairie.
    if(dist > 20) continue;

    const score = dist; // simplest
    if(score < bestScore){
      bestScore = score;
      best = {
        lat, lon,
        postcode: pc || (postcodeOpt||""),
        display: r.display_name || "",
        address: addr
      };
    }
  }
  return best;
}

function ensureIds(){
  for(const city of Object.keys(data)){
    data[city] = data[city].map(a=>({
      id: a.id || genId(),
      street: a.street,
      postcode: String(a.postcode||"").replace(/\.0$/,""),
      city,
      lat: a.lat ?? null,
      lon: a.lon ?? null,
      done: !!a.done
    }));
  }
}

function dedupeCity(city){
  const arr = data[city] || [];
  const map = new Map();
  for(const a of arr){
    const key = addrKey(a);
    if(!map.has(key)) map.set(key,a);
  }
  data[city] = Array.from(map.values());
}

function currentCity(){ return citySelect.value; }

function getCityList(city){ return data[city] || []; }

function formatLine(a){
  const pc = a.postcode ? String(a.postcode).trim() : "";
  const city = a.city || "";
  return `${a.street}, ${pc} ${city}`.replace(/\s+/g," ").trim();
}

function wazeUrl(a){
  const q = encodeURIComponent(formatLine(a));
  // deep link first
  return {
    deep: `waze://?q=${q}&navigate=yes`,
    web: `https://waze.com/ul?q=${q}&navigate=yes`
  };
}

function render(){
  const city = currentCity();
  localStorage.setItem(LS_LAST_CITY, city);

  const arr = [...getCityList(city)];
  const total = arr.length;
  const done = arr.filter(a=>a.done).length;

  cityMeta.textContent = `${city} • ${done} / ${total} faits`;

  // sort: by distance to mairie if coords exist, else keep insertion
  arr.sort((a,b)=>{
    const da = (a._dist ?? Infinity);
    const db = (b._dist ?? Infinity);
    if(da !== db) return da - db;
    return (a.street||"").localeCompare(b.street||"","fr");
  });

  addrList.innerHTML = "";
  arr.forEach((a, idx)=>{
    const li = document.createElement("li");
    li.className = "addr";

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = String(idx+1);

    const main = document.createElement("div");
    main.className = "addrmain tapzone";

    const l1 = document.createElement("div");
    l1.className = "line1";
    l1.textContent = a.street;

    const l2 = document.createElement("div");
    l2.className = "line2";
    const b1 = document.createElement("span");
    b1.className = "badge";
    b1.textContent = `${a.postcode} • ${a.city}`;
    const b2 = document.createElement("span");
    b2.className = "badge ok";
    b2.textContent = a.done ? "✓ Fait" : "À faire";
    l2.appendChild(b1); l2.appendChild(b2);
    if(typeof a._dist === "number" && isFinite(a._dist)){
      const b3 = document.createElement("span");
      b3.className = "badge";
      b3.textContent = `${a._dist.toFixed(1)} km mairie`;
      l2.appendChild(b3);
    }

    main.appendChild(l1);
    main.appendChild(l2);

    main.addEventListener("click", ()=>{
      // open waze and mark done
      a.done = true;
      saveData();
      render();
      const url = wazeUrl(a);
      // Try deep link; if blocked, user can still have Waze installed
      window.location.href = url.deep;
      setTimeout(()=>{ window.open(url.web, "_blank"); }, 900);
    });

    const actions = document.createElement("div");
    actions.className = "actions";

    const btnEdit = document.createElement("button");
    btnEdit.className = "iconbtn";
    btnEdit.textContent = "✎";
    btnEdit.title = "Modifier";
    btnEdit.addEventListener("click",(e)=>{ e.stopPropagation(); openEdit(city, a.id); });

    const btnDel = document.createElement("button");
    btnDel.className = "iconbtn";
    btnDel.textContent = "🗑";
    btnDel.title = "Supprimer";
    btnDel.addEventListener("click",(e)=>{
      e.stopPropagation();
      if(confirm("Supprimer cette adresse ?")){
        data[city] = data[city].filter(x=>x.id !== a.id);
        saveData();
        render();
      }
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);

    li.appendChild(num);
    li.appendChild(main);
    li.appendChild(actions);
    addrList.appendChild(li);
  });
}

function openModal(mode, preset){
  editContext = preset?.editContext || null;
  modalTitle.textContent = mode === "edit" ? "Modifier une adresse" : "Ajouter une adresse";
  modalCity.value = preset?.city || currentCity();
  modalStreet.value = preset?.street || "";
  modalPostcode.value = preset?.postcode || "";
  modal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
  setTimeout(()=>modalStreet.focus(), 60);
}

function closeModal(){
  modal.classList.add("hidden");
  modalBackdrop.classList.add("hidden");
  editContext = null;
}

async function saveModal(){
  const city = modalCity.value;
  const street = normSpaces(modalStreet.value);
  const pcOpt = normSpaces(modalPostcode.value).replace(/\D/g,"").slice(0,5);

  if(!street){
    setStatus("Adresse manquante.", true);
    return;
  }

  try{
    setStatus("Géocodage de l'adresse…");
    const g = await geocodeAddress(street, city, pcOpt);
    if(!g) {
      setStatus("Adresse introuvable (dans la zone autour de la mairie).", true);
      return;
    }

    const pc = (g.postcode||pcOpt||"").trim();
    if(!pc.startsWith("66")){
      setStatus("Refusé : cette adresse n'est pas dans le département 66.", true);
      return;
    }

    // build object
    const obj = {
      id: editContext?.id || genId(),
      street,
      postcode: pc,
      city,
      lat: g.lat,
      lon: g.lon,
      done: false
    };

    // city list exists
    if(!data[city]) data[city] = [];

    // Dedupe
    const key = addrKey(obj);
    const exists = data[city].some(a=>a.id !== obj.id && addrKey(a) === key);
    if(exists){
      setStatus("Doublon détecté : cette adresse existe déjà.", true);
      return;
    }

    if(editContext){
      data[city] = data[city].map(a=> a.id === obj.id ? {...a, ...obj} : a);
    } else {
      data[city].push(obj);
    }

    dedupeCity(city);
    saveData();

    // Update distances + order
    await applyOrderForCity(city);

    closeModal();
    setStatus("OK ✅");
    fillCitySelect();
    citySelect.value = city;
    render();
  }catch(e){
    setStatus(e.message || "Erreur pendant le géocodage.", true);
  }
}

function openEdit(city, id){
  const a = (data[city]||[]).find(x=>x.id===id);
  if(!a) return;
  openModal("edit", {
    city,
    street: a.street,
    postcode: a.postcode,
    editContext: {city, id}
  });
}

async function applyOrderForCity(city){
  const arr = data[city] || [];
  const mairie = await getMairie(city);
  for(const a of arr){
    if(typeof a.lat === "number" && typeof a.lon === "number"){
      a._dist = haversineKm(mairie.lat, mairie.lon, a.lat, a.lon);
    } else {
      a._dist = Infinity;
    }
  }
  // order by distance to mairie
  arr.sort((a,b)=> (a._dist??Infinity) - (b._dist??Infinity));
  data[city] = arr;
  saveData();
}

async function optimizeCity(){
  const city = currentCity();
  try{
    const mairie = await getMairie(city);
    const arr = data[city] || [];
    let missing = arr.filter(a=>!(typeof a.lat==="number" && typeof a.lon==="number")).length;

    if(missing === 0){
      setStatus("Déjà géocodé. Tri en cours…");
      await applyOrderForCity(city);
      render();
      setStatus("OK ✅");
      return;
    }

    setStatus(`Géocodage manquant : ${missing} adresse(s)…`);
    // rate limit ~1req/s
    for(const a of arr){
      if(typeof a.lat==="number" && typeof a.lon==="number") continue;
      const pcOpt = (a.postcode||"").trim();
      const g = await geocodeAddress(a.street, city, pcOpt);
      if(g){
        a.lat = g.lat; a.lon = g.lon;
        a.postcode = (g.postcode||a.postcode||"").trim();
      }
      missing = arr.filter(x=>!(typeof x.lat==="number" && typeof x.lon==="number")).length;
      setStatus(`Géocodage… restant: ${missing}`);
      saveData();
      await sleep(1100);
    }

    // Remove anything that ended up outside 66
    data[city] = (data[city]||[]).filter(a=>String(a.postcode||"").startsWith("66"));
    dedupeCity(city);
    await applyOrderForCity(city);
    render();
    setStatus("Optimisation terminée ✅");
  }catch(e){
    setStatus(e.message || "Erreur optimisation.", true);
  }
}

function wire(){
  fillCitySelect();
  ensureIds();
  // cleanup: dedupe every city and remove non-66
  for(const city of Object.keys(data)){
    data[city] = (data[city]||[]).filter(a=>String(a.postcode||"").startsWith("66"));
    dedupeCity(city);
  }
  saveData();

  citySelect.addEventListener("change", async ()=>{
    setStatus("");
    try{
      await applyOrderForCity(currentCity());
    }catch(_){}
    render();
  });

  btnOptimize.addEventListener("click", ()=>optimizeCity());
  btnAdd.addEventListener("click", ()=>openModal("add", {city: currentCity()}));

  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  modalSave.addEventListener("click", saveModal);

  // initial render
  applyOrderForCity(currentCity()).then(()=>render()).catch(()=>render());
}

wire();