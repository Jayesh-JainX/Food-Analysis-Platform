export type Medicine = {
	name: string;
	dosage?: string;
	notes?: string;
	otc?: boolean;
};

export type AyurvedicRemedy = {
	name: string;
	brand?: string;
	dosage?: string;
	notes?: string;
};

export type Disease = {
	id: string;
	name: string;
	synonyms?: string[];
	tags?: string[];
	symptoms: string[];
	description?: string;
	image: string;
	allopathic: Medicine[];
	ayurvedic: AyurvedicRemedy[];
	lifestyle?: string[];
};

// Comprehensive diseases data with Indian focus and extensive global coverage
export const diseases: Disease[] = [
    // Respiratory Diseases
	{
		id: "common-cold",
		name: "Common Cold",
        synonyms: ["viral rhinitis", "upper respiratory infection", "sardi", "jukaam", "nazla", "thanda", "cold", "flu"],
        tags: ["respiratory", "viral", "seasonal", "contagious", "common", "upper-respiratory", "acute"],
        symptoms: ["runny nose", "nasal congestion", "sneezing", "sore throat", "cough", "mild fever", "headache", "body ache", "fatigue", "watery eyes", "post nasal drip"],
		description: "A viral infection of the upper respiratory tract causing sneezing, sore throat, and congestion.",
		image: "../diseases/common-cold.jpg",
		allopathic: [
			{ name: "Paracetamol 500 mg", dosage: "1 tab every 6-8 hours as needed", notes: "Fever, sore throat relief", otc: true },
			{ name: "Cetirizine 10 mg", dosage: "1 tab at night", notes: "Runny nose/sneezing", otc: true },
			{ name: "Dextromethorphan syrup", dosage: "10 ml up to 3x/day", notes: "Dry cough", otc: true },
			{ name: "Phenylephrine drops", dosage: "2-3 drops/nostril 3-4x/day", notes: "Nasal decongestant", otc: true },
		],
		ayurvedic: [
			{ name: "Chyawanprash", dosage: "1-2 tsp daily", notes: "Immunity support" },
			{ name: "Sitopaladi churna", dosage: "1-2 g with honey, 2x/day", notes: "Cough and congestion" },
			{ name: "Talisadi churna", dosage: "1-2 g with warm water", notes: "Respiratory support" },
            { name: "Tulsi tea", dosage: "2-3 cups daily", notes: "Natural immunity booster" },
		],
        lifestyle: ["Rest", "Warm fluids", "Steam inhalation", "Gargle with salt water", "Avoid cold foods"],
	},
	{
		id: "seasonal-allergy",
		name: "Allergic Rhinitis",
        synonyms: ["hay fever", "seasonal allergy", "pollen allergy", "nasal allergy", "allergi", "dhool ki allergy"],
        tags: ["allergy", "seasonal", "respiratory", "chronic", "immunological", "environmental"],
        symptoms: ["sneezing", "itchy eyes", "runny nose", "nasal congestion", "watery eyes", "post-nasal drip", "itchy nose", "scratchy throat"],
        description: "Allergy-driven inflammation of the nasal passages and eyes caused by environmental allergens.",
		image: "../diseases/Allergic.png",
		allopathic: [
			{ name: "Levocetirizine 5 mg", dosage: "1 tab at night", notes: "Antihistamine", otc: true },
			{ name: "Fluticasone nasal spray", dosage: "1-2 sprays/nostril daily", notes: "Nasal steroid" },
			{ name: "Olopatadine eye drops", dosage: "1 drop/eye 2x/day", notes: "Eye allergy relief", otc: true },
            { name: "Montelukast 10 mg", dosage: "1 tab at night", notes: "Leukotriene receptor antagonist" },
		],
		ayurvedic: [
			{ name: "Trikatu churna", dosage: "1 g with honey after meals", notes: "Kapha balancing" },
			{ name: "Anu taila (nasya)", dosage: "2-3 drops/nostril in morning", notes: "Consult practitioner" },
			{ name: "Haridra (Turmeric) powder", dosage: "1/2 tsp with warm milk", notes: "Anti-inflammatory" },
            { name: "Neti pot with saline", dosage: "Daily morning", notes: "Nasal cleansing" },
        ],
        lifestyle: ["Avoid allergens", "Saline nasal rinse", "Keep windows closed during pollen season", "Air purifier"],
    },
    {
        id: "asthma",
        name: "Bronchial Asthma",
        synonyms: ["asthma", "swash rog", "breathing problem", "dama", "sans ki bimari", "wheezing"],
        tags: ["respiratory", "chronic", "inflammatory", "trigger-based", "allergic", "bronchial", "obstructive"],
        symptoms: ["wheezing", "shortness of breath", "chest tightness", "coughing", "rapid breathing", "difficulty speaking", "fatigue", "anxiety"],
        description: "Chronic inflammatory airway disease causing reversible airway obstruction and breathing difficulty.",
        image: "../diseases/Bronchial_Asthma.png",
        allopathic: [
            { name: "Salbutamol inhaler", dosage: "2 puffs as needed", notes: "Bronchodilator rescue inhaler" },
            { name: "Budesonide inhaler", dosage: "2 puffs twice daily", notes: "Inhaled steroid controller" },
            { name: "Montelukast 10 mg", dosage: "1 tab at night", notes: "Leukotriene modifier" },
            { name: "Formoterol + Budesonide", dosage: "As prescribed", notes: "Combination inhaler" },
        ],
        ayurvedic: [
            { name: "Vasaka (Adhatoda vasica)", dosage: "As per label", notes: "Natural bronchodilator" },
            { name: "Kantakari (Solanum xanthocarpum)", dosage: "As per label", notes: "Respiratory support" },
            { name: "Talisadi churna", dosage: "1-2 g with honey", notes: "Respiratory health" },
            { name: "Bharangi (Clerodendrum serratum)", dosage: "As per label", notes: "Anti-asthmatic" },
        ],
        lifestyle: ["Avoid triggers", "Regular medication", "Peak flow monitoring", "Action plan", "Breathing exercises"],
    },
    {
        id: "pneumonia",
        name: "Pneumonia",
        synonyms: ["lung infection", "chest infection", "swash rog", "phephdon ki sujan", "pneumonia"],
        tags: ["respiratory", "infectious", "serious", "bacterial", "viral", "lower-respiratory", "acute"],
        symptoms: ["cough with phlegm", "fever", "difficulty breathing", "chest pain", "fatigue", "sweating", "chills", "blue lips"],
        description: "Infection of the air sacs in the lungs, causing inflammation and fluid buildup.",
        image: "../diseases/Pneumonia.jpeg",
        allopathic: [
            { name: "Amoxicillin 500 mg", dosage: "1 tab 3x daily for 7-10 days", notes: "First-line antibiotic" },
            { name: "Azithromycin 500 mg", dosage: "1 tab daily for 5 days", notes: "Atypical pneumonia" },
            { name: "Paracetamol 500 mg", dosage: "For fever", notes: "Symptom relief", otc: true },
            { name: "Oxygen therapy", dosage: "As needed", notes: "Severe cases" },
        ],
        ayurvedic: [
            { name: "Vasaka (Adhatoda vasica)", dosage: "As per label", notes: "Respiratory support" },
            { name: "Kantakari (Solanum xanthocarpum)", dosage: "As per label", notes: "Cough relief" },
            { name: "Talisadi churna", dosage: "1-2 g with honey", notes: "Respiratory health" },
            { name: "Pippali (Piper longum)", dosage: "As per label", notes: "Lung strengthening" },
        ],
        lifestyle: ["Rest", "Hydration", "Steam inhalation", "Complete antibiotic course", "Pneumonia vaccination"],
    },
    {
        id: "tuberculosis",
        name: "Tuberculosis (TB)",
        synonyms: ["TB", "consumption", "rajayakshma", "kshay rog", "tuberculosis", "phephdon ka infection"],
        tags: ["respiratory", "bacterial", "infectious", "serious", "chronic", "communicable", "mycobacterial"],
        symptoms: ["persistent cough", "blood in sputum", "chest pain", "weight loss", "night sweats", "fatigue", "loss of appetite", "low-grade fever"],
        description: "A serious bacterial infection primarily affecting the lungs, caused by Mycobacterium tuberculosis.",
        image: "../diseases/Tuberculosis.jpg",
        allopathic: [
            { name: "Rifampicin 600 mg", dosage: "1 tab daily empty stomach", notes: "First-line anti-TB drug" },
            { name: "Isoniazid 300 mg", dosage: "1 tab daily", notes: "First-line anti-TB drug" },
            { name: "Pyrazinamide 1500 mg", dosage: "As prescribed", notes: "First-line anti-TB drug" },
            { name: "Ethambutol 800 mg", dosage: "As prescribed", notes: "Fourth first-line drug" },
        ],
        ayurvedic: [
            { name: "Vasaka (Adhatoda vasica)", dosage: "As per label", notes: "Respiratory support" },
            { name: "Kantakari (Solanum xanthocarpum)", dosage: "As per label", notes: "Cough relief" },
            { name: "Talisadi churna", dosage: "1-2 g with honey", notes: "Respiratory health" },
            { name: "Bala (Sida cordifolia)", dosage: "As per label", notes: "Strength building" },
        ],
        lifestyle: ["Complete DOTS treatment", "Nutritious diet", "Rest", "Avoid smoking", "Isolation until non-infectious"],
    },
    {
        id: "bronchitis",
        name: "Bronchitis",
        synonyms: ["chest congestion", "bronchi infection", "swash nali ki sujan", "khansi", "chronic cough"],
        tags: ["respiratory", "inflammatory", "acute", "chronic", "bronchial", "cough"],
        symptoms: ["persistent cough", "mucus production", "chest discomfort", "shortness of breath", "fatigue", "low-grade fever", "wheezing"],
        description: "Inflammation of the bronchial tubes causing persistent cough and mucus production.",
        image: "../diseases/Bronchitis.png",
        allopathic: [
            { name: "Salbutamol syrup", dosage: "5-10 ml 3x daily", notes: "Bronchodilator" },
            { name: "Ambroxol 30 mg", dosage: "1 tab 3x daily", notes: "Mucolytic" },
            { name: "Dextromethorphan", dosage: "10-15 ml 3x daily", notes: "Cough suppressant", otc: true },
            { name: "Prednisolone", dosage: "As prescribed", notes: "For severe cases" },
        ],
        ayurvedic: [
            { name: "Sitopaladi churna", dosage: "1-2 g with honey", notes: "Cough relief" },
            { name: "Vasaka (Adhatoda vasica)", dosage: "As per label", notes: "Expectorant" },
            { name: "Tulsi + Honey", dosage: "1 tsp 3x daily", notes: "Natural cough relief" },
            { name: "Mulethi (Glycyrrhiza glabra)", dosage: "As per label", notes: "Throat soothing" },
        ],
        lifestyle: ["Avoid smoking", "Steam inhalation", "Warm fluids", "Rest", "Humidifier use"],
    },

    // Gastrointestinal Diseases
	{
		id: "acid-reflux",
        name: "Gastroesophageal Reflux Disease (GERD)",
        synonyms: ["acid reflux", "heartburn", "acidity", "pet mein jalan", "seene mein jalan", "khatta paani", "amla pitta"],
        tags: ["digestive", "chronic", "lifestyle-related", "gastric", "esophageal", "acid-related"],
        symptoms: ["heartburn", "acidic taste", "burping", "upper abdominal pain", "chest discomfort", "regurgitation", "difficulty swallowing", "chronic cough"],
		description: "Stomach acid flowing back into the esophagus causing heartburn and discomfort.",
		image: "../diseases/Acid_Reflux.jpg",
		allopathic: [
            { name: "Pantoprazole 40 mg", dosage: "1 tab before breakfast for 2-4 weeks", notes: "Proton pump inhibitor" },
            { name: "Antacid gel (Aluminium/Magnesium)", dosage: "10-15 ml after meals", notes: "Immediate relief", otc: true },
            { name: "Ranitidine 150 mg", dosage: "1 tab twice daily", notes: "H2 receptor blocker", otc: true },
            { name: "Domperidone 10 mg", dosage: "1 tab before meals", notes: "Prokinetic agent" },
		],
		ayurvedic: [
			{ name: "Avipattikar churna", dosage: "1-2 g with warm water before meals", notes: "Pitta balancing" },
            { name: "Amla (Amalaki)", dosage: "1-2 caps daily", notes: "Natural antacid" },
			{ name: "Shatavari powder", dosage: "1-2 g with milk", notes: "Cooling effect" },
            { name: "Yashtimadhu (Licorice)", dosage: "1/2 tsp with honey", notes: "Esophageal healing" },
        ],
        lifestyle: ["Small frequent meals", "Avoid spicy/fried foods", "Don't lie down after meals", "Elevate head while sleeping", "Weight management"],
    },
    {
        id: "gastritis",
        name: "Gastritis",
        synonyms: ["stomach inflammation", "gastric problem", "amla pitta", "pet ki sujan", "stomach ulcer", "pet mein jalan"],
        tags: ["digestive", "inflammatory", "acute", "chronic", "gastric", "stomach", "acid-related"],
        symptoms: ["stomach pain", "nausea", "vomiting", "bloating", "loss of appetite", "burning sensation", "indigestion", "belching"],
        description: "Inflammation of the stomach lining, often caused by H. pylori infection, medication, or lifestyle factors.",
        image: "../diseases/Gastritis.jpg",
		allopathic: [
            { name: "Pantoprazole 40 mg", dosage: "1 tab daily before breakfast", notes: "PPI for acid reduction" },
            { name: "Ranitidine 150 mg", dosage: "1 tab twice daily", notes: "H2 blocker", otc: true },
            { name: "Antacid gel", dosage: "10-15 ml after meals", notes: "Symptom relief", otc: true },
            { name: "Sucralfate 1g", dosage: "1 tab 4x daily", notes: "Mucosal protection" },
		],
		ayurvedic: [
            { name: "Amla (Emblica officinalis)", dosage: "1-2 caps daily", notes: "Stomach soothing" },
            { name: "Shatavari powder", dosage: "1-2 g with milk", notes: "Cooling effect" },
            { name: "Yashtimadhu powder", dosage: "1/2 tsp with honey", notes: "Anti-inflammatory" },
            { name: "Kamadudha ras", dosage: "1 tab twice daily", notes: "Pitta pacifying" },
        ],
        lifestyle: ["Avoid spicy foods", "Small frequent meals", "Stress management", "Avoid NSAIDs", "Quit smoking"],
    },
    {
        id: "peptic-ulcer",
        name: "Peptic Ulcer Disease",
        synonyms: ["stomach ulcer", "duodenal ulcer", "gastric ulcer", "pet mein zakham", "amaashay vraṇa"],
        tags: ["digestive", "ulcerative", "chronic", "bacterial", "acid-related", "gastric", "duodenal"],
        symptoms: ["burning stomach pain", "bloating", "nausea", "loss of appetite", "weight loss", "dark stools", "vomiting blood"],
        description: "Open sores in the stomach lining or duodenum, often caused by H. pylori bacteria or NSAIDs.",
        image: "../diseases/Peptic_Ulcer_Disease.jpg",
        allopathic: [
            { name: "Triple therapy (PPI+Antibiotics)", dosage: "As prescribed for 14 days", notes: "H. pylori eradication" },
            { name: "Omeprazole 40 mg", dosage: "1 tab twice daily", notes: "Acid suppression" },
            { name: "Clarithromycin 500 mg", dosage: "1 tab twice daily", notes: "Antibiotic" },
            { name: "Amoxicillin 1000 mg", dosage: "1 tab twice daily", notes: "Antibiotic" },
        ],
        ayurvedic: [
            { name: "Yashtimadhu (Licorice)", dosage: "As per label", notes: "Ulcer healing" },
            { name: "Shatavari", dosage: "1-2 g with milk", notes: "Mucosal protection" },
            { name: "Amla juice", dosage: "30 ml twice daily", notes: "Natural healing" },
            { name: "Sutshekhar ras", dosage: "1 tab twice daily", notes: "Ayurvedic formulation" },
        ],
        lifestyle: ["Avoid NSAIDs", "Stress reduction", "Regular meals", "Avoid alcohol", "Complete H. pylori treatment"],
    },
    {
        id: "irritable-bowel-syndrome",
        name: "Irritable Bowel Syndrome (IBS)",
        synonyms: ["IBS", "spastic colon", "aanth ki bimari", "pechish", "pet ki gas"],
        tags: ["digestive", "functional", "chronic", "bowel", "stress-related", "abdominal"],
        symptoms: ["abdominal pain", "bloating", "gas", "diarrhea", "constipation", "mucus in stool", "cramping", "urgency"],
        description: "A functional bowel disorder causing abdominal pain and changes in bowel movements.",
        image: "../diseases/Irritable_bowel_syndrome.jpg",
        allopathic: [
            { name: "Mebeverine 135 mg", dosage: "1 tab 3x daily", notes: "Antispasmodic" },
            { name: "Loperamide 2 mg", dosage: "As needed for diarrhea", notes: "Anti-diarrheal", otc: true },
            { name: "Psyllium husk", dosage: "1 tsp with water", notes: "Fiber supplement", otc: true },
            { name: "Probiotics", dosage: "As per label", notes: "Gut health", otc: true },
        ],
        ayurvedic: [
            { name: "Hingvastak churna", dosage: "1-2 g after meals", notes: "Digestive support" },
            { name: "Triphala churna", dosage: "1-2 g at bedtime", notes: "Bowel regulation" },
            { name: "Kutaj (Holarrhena antidysenterica)", dosage: "As per label", notes: "Diarrhea control" },
            { name: "Bilva (Aegle marmelos)", dosage: "As per label", notes: "Digestive health" },
        ],
        lifestyle: ["FODMAP diet", "Stress management", "Regular exercise", "Adequate fiber", "Avoid triggers"],
    },
    {
        id: "constipation",
        name: "Constipation",
        synonyms: ["bowel problem", "kabj", "malabandh", "pet saaf nahi hona", "hard stool"],
        tags: ["digestive", "common", "lifestyle-related", "dietary", "bowel", "chronic"],
        symptoms: ["infrequent bowel movements", "hard stools", "straining", "bloating", "abdominal discomfort", "incomplete evacuation"],
        description: "Difficulty in passing stools, often due to low fiber diet, dehydration, or lack of physical activity.",
        image: "../diseases/Constipation.png",
        allopathic: [
            { name: "Bisacodyl 5 mg", dosage: "1 tab at bedtime", notes: "Stimulant laxative", otc: true },
            { name: "Lactulose syrup", dosage: "15-30 ml daily", notes: "Osmotic laxative", otc: true },
            { name: "Psyllium husk", dosage: "1-2 tsp with water", notes: "Bulk-forming laxative", otc: true },
            { name: "Polyethylene glycol", dosage: "1 sachet daily", notes: "Osmotic laxative", otc: true },
        ],
        ayurvedic: [
            { name: "Triphala churna", dosage: "1-2 g with warm water at bedtime", notes: "Gentle laxative" },
            { name: "Haritaki powder", dosage: "1/2 tsp with warm water", notes: "Bowel regulator" },
            { name: "Isabgol (Psyllium)", dosage: "1-2 tsp with water", notes: "Natural fiber" },
            { name: "Eranda taila (Castor oil)", dosage: "1-2 tsp as needed", notes: "Strong laxative" },
        ],
        lifestyle: ["High fiber diet", "Adequate hydration", "Regular exercise", "Establish bathroom routine", "Avoid processed foods"],
    },
    {
        id: "diarrhea",
        name: "Diarrhea",
        synonyms: ["loose motions", "atisar", "pechish", "paani paani tatti", "loose stool"],
        tags: ["digestive", "acute", "infectious", "dehydration-risk", "bowel", "fluid-loss"],
        symptoms: ["watery stools", "frequent bowel movements", "abdominal cramps", "nausea", "dehydration", "urgency", "fever"],
        description: "Frequent, loose, watery stools often caused by infection, food poisoning, or dietary changes.",
        image: "../diseases/Diarrhea.jpg",
        allopathic: [
            { name: "ORS solution", dosage: "200-400 ml after each loose motion", notes: "Rehydration", otc: true },
            { name: "Loperamide 2 mg", dosage: "1 tab after each loose motion, max 8 tabs/day", notes: "Anti-diarrheal", otc: true },
            { name: "Metronidazole 400 mg", dosage: "1 tab 3x daily for 5-7 days", notes: "For bacterial/protozoal cause" },
            { name: "Zinc sulfate 20 mg", dosage: "1 tab daily for 10-14 days", notes: "Especially in children", otc: true },
        ],
        ayurvedic: [
            { name: "Kutaj (Holarrhena antidysenterica)", dosage: "As per label", notes: "Natural anti-diarrheal" },
            { name: "Bilva (Aegle marmelos)", dosage: "As per label", notes: "Digestive support" },
            { name: "Pomegranate peel powder", dosage: "1/2 tsp with buttermilk", notes: "Astringent effect" },
            { name: "Dadim (Pomegranate)", dosage: "Fresh juice 100ml", notes: "Electrolyte replacement" },
        ],
        lifestyle: ["BRAT diet", "Adequate hydration", "Rest", "Good hygiene", "Avoid dairy initially"],
    },
    {
        id: "hepatitis",
        name: "Hepatitis",
        synonyms: ["liver inflammation", "jaundice", "kamala", "yakrit shoth", "liver infection"],
        tags: ["liver", "infectious", "inflammatory", "viral", "serious", "hepatic"],
        symptoms: ["yellow skin and eyes", "dark urine", "pale stools", "fatigue", "abdominal pain", "nausea", "loss of appetite"],
        description: "Inflammation of the liver, commonly caused by viral infections (Hepatitis A, B, C).",
        image: "../diseases/hepatitis.jpg",
        allopathic: [
            { name: "Hepatitis B vaccine", dosage: "3-dose series", notes: "Prevention" },
            { name: "Tenofovir", dosage: "As prescribed", notes: "Hepatitis B treatment" },
            { name: "Sofosbuvir", dosage: "As prescribed", notes: "Hepatitis C treatment" },
            { name: "Supportive care", dosage: "Rest and nutrition", notes: "Hepatitis A" },
        ],
        ayurvedic: [
            { name: "Kutki (Picrorhiza kurroa)", dosage: "As per label", notes: "Liver protection" },
            { name: "Bhumyamalaki (Phyllanthus niruri)", dosage: "As per label", notes: "Hepatoprotective" },
            { name: "Kalmegh (Andrographis paniculata)", dosage: "As per label", notes: "Liver detox" },
            { name: "Arogyavardhini vati", dosage: "1-2 tabs twice daily", notes: "Liver support" },
        ],
        lifestyle: ["Avoid alcohol", "Low-fat diet", "Rest", "Hygiene", "Vaccination"],
    },

    // Cardiovascular Diseases
	{
		id: "hypertension",
		name: "Hypertension",
        synonyms: ["high blood pressure", "BP", "rakta chapa", "blood pressure", "high BP", "ucch raktchap"],
        tags: ["cardiovascular", "chronic", "serious", "silent-killer", "cardiac", "vascular", "systemic"],
        symptoms: ["headache", "dizziness", "blurred vision", "often asymptomatic", "chest pain", "shortness of breath", "nosebleeds"],
        description: "Persistently elevated blood pressure that can damage blood vessels and organs.",
		image: "../diseases/Hypertension.png",
		allopathic: [
			{ name: "Amlodipine 5 mg", dosage: "1 tab daily", notes: "Calcium channel blocker" },
            { name: "Telmisartan 40 mg", dosage: "1 tab daily", notes: "ARB" },
			{ name: "Atenolol 50 mg", dosage: "1 tab daily", notes: "Beta blocker" },
            { name: "Hydrochlorothiazide 25 mg", dosage: "1 tab daily", notes: "Diuretic" },
		],
		ayurvedic: [
            { name: "Sarpagandha (Rauwolfia serpentina)", dosage: "As per practitioner", notes: "Natural hypotensive" },
			{ name: "Arjuna (Terminalia arjuna)", dosage: "As per label", notes: "Cardiac support" },
			{ name: "Jatamansi powder", dosage: "1/2 tsp with warm water", notes: "Stress reduction" },
            { name: "Punarnava (Boerhavia diffusa)", dosage: "As per label", notes: "Diuretic effect" },
        ],
        lifestyle: ["Low sodium diet", "Regular exercise", "Stress management", "Weight control", "Limit alcohol"],
    },
    {
        id: "coronary-artery-disease",
        name: "Coronary Artery Disease",
        synonyms: ["heart disease", "CAD", "angina", "hridaya rog", "chest pain", "heart attack risk"],
        tags: ["cardiovascular", "chronic", "serious", "arterial", "ischemic", "cardiac", "atherosclerotic"],
        symptoms: ["chest pain", "shortness of breath", "fatigue", "sweating", "nausea", "jaw pain", "arm pain"],
        description: "Narrowing of coronary arteries due to plaque buildup, reducing blood flow to the heart.",
        image: "../diseases/coronary-artery-disease.png",
        allopathic: [
            { name: "Aspirin 75 mg", dosage: "1 tab daily", notes: "Antiplatelet therapy" },
            { name: "Atorvastatin 40 mg", dosage: "1 tab at bedtime", notes: "Statin for cholesterol" },
            { name: "Metoprolol 50 mg", dosage: "1 tab twice daily", notes: "Beta blocker" },
            { name: "Nitroglycerin", dosage: "As needed for chest pain", notes: "Sublingual for angina" },
        ],
        ayurvedic: [
            { name: "Arjuna (Terminalia arjuna)", dosage: "As per label", notes: "Cardioprotective" },
            { name: "Guggulu (Commiphora mukul)", dosage: "As per label", notes: "Cholesterol management" },
            { name: "Pushkarmool (Inula racemosa)", dosage: "As per label", notes: "Heart tonic" },
            { name: "Hridayarnava ras", dosage: "1 tab twice daily", notes: "Cardiac support" },
        ],
        lifestyle: ["Heart-healthy diet", "Regular exercise", "Smoking cessation", "Stress management", "Weight control"],
    },
    {
        id: "heart-failure",
        name: "Congestive Heart Failure",
        synonyms: ["heart failure", "CHF", "cardiac failure", "hriday ashakata", "heart weakness"],
        tags: ["cardiovascular", "chronic", "serious", "cardiac", "pump-failure", "fluid-retention"],
        symptoms: ["shortness of breath", "fatigue", "swelling in legs", "rapid heartbeat", "persistent cough", "weight gain"],
        description: "Condition where the heart cannot pump blood effectively, leading to fluid buildup.",
        image: "../diseases/heart-failure.jpg",
        allopathic: [
            { name: "Furosemide 40 mg", dosage: "1 tab daily", notes: "Diuretic" },
            { name: "Ramipril 5 mg", dosage: "1 tab daily", notes: "ACE inhibitor" },
            { name: "Bisoprolol 2.5 mg", dosage: "1 tab daily", notes: "Beta blocker" },
            { name: "Spironolactone 25 mg", dosage: "1 tab daily", notes: "Aldosterone antagonist" },
        ],
        ayurvedic: [
            { name: "Arjuna (Terminalia arjuna)", dosage: "As per label", notes: "Heart strengthening" },
            { name: "Punarnava (Boerhavia diffusa)", dosage: "As per label", notes: "Reduces fluid retention" },
            { name: "Dashmoolarishta", dosage: "15-30 ml twice daily", notes: "Heart tonic" },
            { name: "Abhraka bhasma", dosage: "As per practitioner", notes: "Cardiac rejuvenation" },
        ],
        lifestyle: ["Fluid restriction", "Low sodium diet", "Daily weight monitoring", "Medication compliance", "Regular follow-up"],
    },

    // Endocrine Disorders
    {
        id: "type-2-diabetes",
        name: "Type 2 Diabetes Mellitus",
        synonyms: ["diabetes", "sugar disease", "madhumeha", "diabetes mellitus", "blood sugar", "chini ki bimari"],
        tags: ["metabolic", "chronic", "lifestyle-related", "serious", "endocrine", "insulin-resistance"],
        symptoms: ["increased thirst", "frequent urination", "fatigue", "blurred vision", "slow healing", "weight loss", "tingling in hands/feet"],
        description: "A metabolic disorder characterized by insulin resistance and elevated blood glucose levels.",
        image: "../diseases/Diabetes.png",
        allopathic: [
            { name: "Metformin 500 mg", dosage: "1 tab twice daily with meals", notes: "First-line treatment" },
            { name: "Glimepiride 1 mg", dosage: "1 tab before breakfast", notes: "Sulfonylurea" },
            { name: "Sitagliptin 100 mg", dosage: "1 tab daily", notes: "DPP-4 inhibitor" },
            { name: "Insulin (if needed)", dosage: "As prescribed", notes: "Advanced cases" },
        ],
        ayurvedic: [
            { name: "Gudmar (Gymnema sylvestre)", dosage: "As per label", notes: "Natural sugar destroyer" },
            { name: "Karela (Bitter gourd) extract", dosage: "As per label", notes: "Blood sugar control" },
            { name: "Jamun seed powder", dosage: "1/2 tsp with water twice daily", notes: "Glucose management" },
            { name: "Vijaysar (Pterocarpus marsupium)", dosage: "As per label", notes: "Beta cell regeneration" },
        ],
        lifestyle: ["Low glycemic diet", "Regular exercise", "Weight management", "Blood sugar monitoring", "Foot care"],
    },
    {
        id: "thyroid-disorders",
        name: "Thyroid Disorders",
        synonyms: ["hypothyroid", "hyperthyroid", "thyroid", "galganda", "ghengha rog", "thyroid gland problem"],
        tags: ["endocrine", "metabolic", "chronic", "hormonal", "thyroidal", "autoimmune"],
        symptoms: ["weight changes", "fatigue", "hair loss", "mood changes", "irregular heartbeat", "temperature sensitivity"],
        description: "Disorders affecting thyroid gland function, including hypothyroidism and hyperthyroidism.",
        image: "../diseases/thyroid-disorders.png",
        allopathic: [
            { name: "Levothyroxine", dosage: "As per TSH levels", notes: "Hypothyroidism treatment" },
            { name: "Carbimazole", dosage: "As prescribed", notes: "Hyperthyroidism treatment" },
            { name: "Propranolol", dosage: "40 mg twice daily", notes: "Symptom control in hyperthyroidism" },
            { name: "Radioiodine therapy", dosage: "As prescribed", notes: "Hyperthyroidism treatment" },
        ],
        ayurvedic: [
            { name: "Kanchanar Guggulu", dosage: "2 tabs twice daily", notes: "Thyroid support" },
            { name: "Shilajit", dosage: "As per label", notes: "Metabolic support" },
            { name: "Ashwagandha", dosage: "1-2 g daily", notes: "Adaptogenic support" },
            { name: "Varuna (Crataeva nurvala)", dosage: "As per label", notes: "Glandular health" },
        ],
        lifestyle: ["Regular monitoring", "Iodine-appropriate diet", "Stress management", "Regular exercise", "Medication compliance"],
    },

    // Neurological Disorders
	{
		id: "migraine",
		name: "Migraine",
        synonyms: ["severe headache", "aadha shirshool", "migraine headache", "sar dard", "half head pain"],
        tags: ["neurological", "chronic", "painful", "trigger-based", "headache", "vascular"],
        symptoms: ["severe headache", "nausea", "vomiting", "light sensitivity", "sound sensitivity", "aura", "visual disturbances"],
        description: "Recurring severe headaches often accompanied by nausea and sensitivity to light and sound.",
		image: "../diseases/Migraine.png",
		allopathic: [
            { name: "Sumatriptan 50 mg", dosage: "1 tab at headache onset", notes: "Triptan for acute treatment" },
			{ name: "Ibuprofen 400 mg", dosage: "1-2 tabs as needed", notes: "Pain relief", otc: true },
			{ name: "Domperidone 10 mg", dosage: "1 tab for nausea", notes: "Anti-emetic" },
            { name: "Propranolol 40 mg", dosage: "1 tab twice daily", notes: "Prophylaxis" },
		],
		ayurvedic: [
            { name: "Brahmi (Bacopa monnieri)", dosage: "As per label", notes: "Neurological support" },
            { name: "Shankhpushpi powder", dosage: "1-2 g with milk", notes: "Brain tonic" },
			{ name: "Jatamansi oil", dosage: "Apply on forehead", notes: "External application" },
            { name: "Saraswatarishta", dosage: "15-30 ml twice daily", notes: "Neurological tonic" },
        ],
        lifestyle: ["Identify triggers", "Regular sleep schedule", "Stress management", "Hydration", "Dark quiet room during attack"],
    },
    {
        id: "epilepsy",
        name: "Epilepsy",
        synonyms: ["seizure disorder", "apasmara", "mirgi", "fits", "convulsions"],
        tags: ["neurological", "chronic", "serious", "seizure", "brain-disorder", "convulsive"],
        symptoms: ["seizures", "loss of consciousness", "muscle rigidity", "tongue biting", "confusion", "memory loss"],
        description: "A neurological disorder characterized by recurrent seizures due to abnormal brain activity.",
        image: "../diseases/epilepsy.png",
		allopathic: [
            { name: "Phenytoin 100 mg", dosage: "1 tab 3x daily", notes: "First-line anticonvulsant" },
            { name: "Carbamazepine 200 mg", dosage: "1 tab twice daily", notes: "Partial seizures" },
            { name: "Valproic acid 500 mg", dosage: "As prescribed", notes: "Generalized seizures" },
            { name: "Levetiracetam 500 mg", dosage: "1 tab twice daily", notes: "Modern anticonvulsant" },
		],
		ayurvedic: [
            { name: "Brahmi (Bacopa monnieri)", dosage: "As per label", notes: "Neuroprotective" },
            { name: "Mandukaparni (Centella asiatica)", dosage: "As per label", notes: "Brain tonic" },
            { name: "Saraswatarishta", dosage: "15-30 ml twice daily", notes: "Neurological support" },
            { name: "Medhya rasayana", dosage: "As per practitioner", notes: "Brain rejuvenation" },
        ],
        lifestyle: ["Medication compliance", "Avoid triggers", "Adequate sleep", "Stress management", "Safety precautions"],
    },
    {
        id: "alzheimers-disease",
        name: "Alzheimer's Disease",
        synonyms: ["dementia", "memory loss", "smriti nash", "bhoolne ki bimari", "alzheimer"],
        tags: ["neurological", "degenerative", "progressive", "dementia", "memory", "cognitive"],
        symptoms: ["memory loss", "confusion", "disorientation", "mood changes", "difficulty speaking", "behavioral changes"],
        description: "A progressive neurodegenerative disorder causing memory loss and cognitive decline.",
        image: "../diseases/alzheimers-disease.png",
        allopathic: [
            { name: "Donepezil 5 mg", dosage: "1 tab daily", notes: "Cholinesterase inhibitor" },
            { name: "Memantine 10 mg", dosage: "1 tab twice daily", notes: "NMDA antagonist" },
            { name: "Rivastigmine", dosage: "As prescribed", notes: "Cholinesterase inhibitor" },
            { name: "Supportive care", dosage: "Ongoing", notes: "Behavioral management" },
        ],
        ayurvedic: [
            { name: "Brahmi (Bacopa monnieri)", dosage: "As per label", notes: "Memory enhancement" },
            { name: "Mandukaparni (Centella asiatica)", dosage: "As per label", notes: "Cognitive support" },
            { name: "Shankhpushpi", dosage: "1-2 g daily", notes: "Brain tonic" },
            { name: "Saraswatarishta", dosage: "15-30 ml twice daily", notes: "Memory support" },
        ],
        lifestyle: ["Mental stimulation", "Physical exercise", "Social interaction", "Structured routine", "Caregiver support"],
    },
    {
        id: "parkinsons-disease",
        name: "Parkinson's Disease",
        synonyms: ["parkinson", "kampavata", "tremor", "shaking disease", "movement disorder"],
        tags: ["neurological", "degenerative", "movement", "progressive", "tremor", "motor"],
        symptoms: ["tremor", "rigidity", "slow movement", "balance problems", "shuffling gait", "soft speech"],
        description: "A progressive neurological disorder affecting movement, causing tremors and rigidity.",
        image: "../diseases/parkinsons-disease.jpg",
        allopathic: [
            { name: "Levodopa + Carbidopa", dosage: "As prescribed", notes: "Gold standard treatment" },
            { name: "Pramipexole", dosage: "As prescribed", notes: "Dopamine agonist" },
            { name: "Rasagiline", dosage: "1 mg daily", notes: "MAO-B inhibitor" },
            { name: "Amantadine", dosage: "As prescribed", notes: "Dyskinesia management" },
        ],
        ayurvedic: [
            { name: "Ashwagandha", dosage: "1-2 g daily", notes: "Neuroprotective" },
            { name: "Brahmi (Bacopa monnieri)", dosage: "As per label", notes: "Neurological support" },
            { name: "Kapikacchu (Mucuna pruriens)", dosage: "As per label", notes: "Natural L-DOPA source" },
            { name: "Maharasnadi churna", dosage: "As per practitioner", notes: "Movement disorders" },
        ],
        lifestyle: ["Physical therapy", "Speech therapy", "Regular exercise", "Balanced diet", "Support groups"],
    },

    // Infectious Diseases
	{
		id: "dengue-fever",
		name: "Dengue Fever",
        synonyms: ["dengue", "breakbone fever", "viral fever", "dengue bukhar", "haddi tutne wala bukhar"],
        tags: ["viral", "mosquito-borne", "serious", "seasonal", "tropical", "aedes", "hemorrhagic"],
        symptoms: ["high fever", "severe headache", "joint pain", "muscle pain", "skin rash", "bleeding", "low platelet count"],
        description: "A mosquito-borne viral infection causing severe flu-like symptoms and potential complications.",
		image: "../diseases/Dengue.png",
		allopathic: [
			{ name: "Paracetamol 500 mg", dosage: "1 tab every 6 hours", notes: "Fever and pain relief", otc: true },
            { name: "ORS solution", dosage: "Frequent small sips", notes: "Prevent dehydration", otc: true },
            { name: "Platelet transfusion", dosage: "If count <10,000", notes: "Severe thrombocytopenia" },
            { name: "IV fluids", dosage: "As needed", notes: "Severe dehydration" },
		],
		ayurvedic: [
            { name: "Giloy (Tinospora cordifolia)", dosage: "As per label", notes: "Immunity booster, fever reducer" },
            { name: "Papaya leaf extract", dosage: "30-60 ml twice daily", notes: "Platelet count support" },
            { name: "Tulsi tea", dosage: "2-3 cups daily", notes: "Natural fever management" },
            { name: "Amrita (Tinospora cordifolia)", dosage: "As per label", notes: "Immunomodulatory" },
        ],
        lifestyle: ["Complete bed rest", "Adequate hydration", "Mosquito control", "Monitor platelet count", "Avoid aspirin"],
	},
	{
		id: "malaria",
		name: "Malaria",
        synonyms: ["malaria", "plasmodium infection", "malaria fever", "jungle fever", "swamp fever"],
        tags: ["parasitic", "mosquito-borne", "serious", "tropical", "anopheles", "protozoal", "febrile"],
        symptoms: ["fever with chills", "sweating", "headache", "muscle pain", "fatigue", "nausea", "anemia"],
        description: "A life-threatening parasitic infection transmitted by female Anopheles mosquitoes.",
		image: "../diseases/Malaria.jpg",
		allopathic: [
            { name: "Artemether + Lumefantrine", dosage: "As per weight-based dosing", notes: "First-line combination therapy" },
            { name: "Chloroquine 500 mg", dosage: "As prescribed", notes: "For sensitive strains" },
            { name: "Doxycycline 100 mg", dosage: "1 tab daily", notes: "Prophylaxis in endemic areas" },
            { name: "Quinine + Doxycycline", dosage: "As prescribed", notes: "Severe malaria" },
		],
		ayurvedic: [
            { name: "Neem (Azadirachta indica)", dosage: "As per label", notes: "Antimalarial properties" },
			{ name: "Tulsi extract", dosage: "As per label", notes: "Fever management" },
            { name: "Giloy powder", dosage: "1-2 g with water twice daily", notes: "Immunity support" },
            { name: "Chirayata (Swertia chirayita)", dosage: "As per label", notes: "Bitter tonic, fever reducer" },
        ],
        lifestyle: ["Use mosquito nets", "Insect repellent", "Complete treatment course", "Early diagnosis", "Avoid stagnant water"],
    },
    {
        id: "chikungunya",
        name: "Chikungunya",
        synonyms: ["chikungunya fever", "joint fever", "viral arthritis", "chikungunya virus"],
        tags: ["viral", "mosquito-borne", "joint-pain", "tropical", "aedes", "arthralgia", "epidemic"],
        symptoms: ["high fever", "severe joint pain", "muscle pain", "headache", "fatigue", "skin rash", "joint swelling"],
        description: "A viral infection transmitted by Aedes mosquitoes, causing severe joint pain and fever.",
        image: "../diseases/chikungunya.png",
        allopathic: [
            { name: "Paracetamol 500 mg", dosage: "1 tab every 6-8 hours", notes: "Pain and fever relief", otc: true },
            { name: "Ibuprofen 400 mg", dosage: "1 tab 3x daily with food", notes: "Anti-inflammatory", otc: true },
            { name: "Topical analgesics", dosage: "Apply to affected joints", notes: "Local pain relief", otc: true },
            { name: "Physiotherapy", dosage: "As recommended", notes: "Joint mobility" },
        ],
        ayurvedic: [
            { name: "Giloy (Tinospora cordifolia)", dosage: "As per label", notes: "Immunity and fever control" },
            { name: "Nirgundi (Vitex negundo)", dosage: "External application", notes: "Joint pain relief" },
            { name: "Dashmoola kwath", dosage: "50 ml twice daily", notes: "Anti-inflammatory" },
            { name: "Maharasnadi kwath", dosage: "As per practitioner", notes: "Joint disorders" },
        ],
        lifestyle: ["Rest and joint protection", "Gentle stretching", "Mosquito control", "Hydration", "Avoid overexertion"],
    },
    {
        id: "typhoid-fever",
		name: "Typhoid Fever",
        synonyms: ["typhoid", "enteric fever", "salmonella infection", "typhoid bukhar", "aantrik jwara"],
        tags: ["bacterial", "water-borne", "serious", "infectious", "salmonella", "enteric", "systemic"],
        symptoms: ["high fever", "headache", "abdominal pain", "diarrhea", "constipation", "rose spots", "weakness"],
        description: "A serious bacterial infection caused by Salmonella typhi, transmitted through contaminated food and water.",
		image: "../diseases/Typhoid.png",
		allopathic: [
            { name: "Ciprofloxacin 500 mg", dosage: "1 tab twice daily for 7-10 days", notes: "First-line antibiotic" },
            { name: "Azithromycin 500 mg", dosage: "1 tab daily for 5-7 days", notes: "Alternative antibiotic" },
            { name: "Ceftriaxone 1g", dosage: "IV daily", notes: "Severe cases" },
            { name: "ORS solution", dosage: "Frequent intake", notes: "Prevent dehydration", otc: true },
		],
		ayurvedic: [
            { name: "Kutaj (Holarrhena antidysenterica)", dosage: "As per label", notes: "Anti-diarrheal, antibacterial" },
			{ name: "Bilva (Aegle marmelos)", dosage: "As per label", notes: "Digestive support" },
            { name: "Ginger tea", dosage: "2-3 cups daily", notes: "Nausea relief, digestion" },
            { name: "Musta (Cyperus rotundus)", dosage: "As per label", notes: "Fever reduction" },
        ],
        lifestyle: ["Safe drinking water", "Food hygiene", "Complete antibiotic course", "Rest", "Vaccination for travelers"],
    },
    

    // Musculoskeletal Disorders
    {
        id: "arthritis",
        name: "Arthritis",
        synonyms: ["joint pain", "sandhi shool", "joint inflammation", "ganthiya", "jodon mein dard"],
        tags: ["joints", "chronic", "painful", "inflammatory", "musculoskeletal", "degenerative", "autoimmune"],
        symptoms: ["joint pain", "stiffness", "swelling", "reduced range of motion", "fatigue", "morning stiffness", "joint deformity"],
        description: "Inflammation of one or more joints causing pain, stiffness, and reduced mobility.",
        image: "../diseases/arthritis.png",
		allopathic: [
            { name: "Ibuprofen 400 mg", dosage: "1-2 tabs 3x daily with food", notes: "NSAID for pain and inflammation", otc: true },
            { name: "Diclofenac 50 mg", dosage: "1 tab twice daily", notes: "NSAID" },
            { name: "Methotrexate 7.5 mg", dosage: "Weekly", notes: "DMARD for rheumatoid arthritis" },
            { name: "Glucosamine 1500 mg", dosage: "1 tab daily", notes: "Joint health supplement", otc: true },
		],
		ayurvedic: [
            { name: "Guggulu (Commiphora mukul)", dosage: "As per label", notes: "Anti-inflammatory, joint support" },
            { name: "Shallaki (Boswellia serrata)", dosage: "As per label", notes: "Natural anti-inflammatory" },
            { name: "Ashwagandha powder", dosage: "1-2 g with milk", notes: "Pain relief, strength" },
            { name: "Maharasnadi kwath", dosage: "50 ml twice daily", notes: "Joint disorders" },
        ],
        lifestyle: ["Regular gentle exercise", "Weight management", "Joint protection", "Heat/cold therapy", "Physical therapy"],
    },
    {
        id: "osteoporosis",
        name: "Osteoporosis",
        synonyms: ["bone loss", "weak bones", "asthi kshaya", "bone density loss", "brittle bones"],
        tags: ["bone", "chronic", "skeletal", "metabolic", "age-related", "fracture-risk"],
        symptoms: ["bone pain", "height loss", "stooped posture", "frequent fractures", "back pain"],
        description: "A condition where bones become weak and brittle, increasing fracture risk.",
        image: "../diseases/osteoporosis.png",
		allopathic: [
            { name: "Calcium 1000 mg + Vitamin D3 400 IU", dosage: "1 tab daily", notes: "Bone health support", otc: true },
            { name: "Alendronate 70 mg", dosage: "1 tab weekly", notes: "Bisphosphonate" },
            { name: "Calcitriol 0.25 mcg", dosage: "1 cap twice daily", notes: "Active vitamin D" },
            { name: "Strontium ranelate", dosage: "As prescribed", notes: "Bone formation stimulator" },
		],
		ayurvedic: [
            { name: "Laksha (Laccifer lacca)", dosage: "As per label", notes: "Bone strengthening" },
            { name: "Asthi Shrinkhala (Cissus quadrangularis)", dosage: "As per label", notes: "Bone healing" },
            { name: "Pravala bhasma", dosage: "As per practitioner", notes: "Calcium supplement" },
            { name: "Mukta bhasma", dosage: "As per practitioner", notes: "Bone mineralization" },
        ],
        lifestyle: ["Weight-bearing exercise", "Calcium-rich diet", "Vitamin D supplementation", "Fall prevention", "Avoid smoking"],
    },
    {
        id: "back-pain",
        name: "Lower Back Pain",
        synonyms: ["backache", "lumber pain", "kamar dard", "pith dard", "spine pain"],
        tags: ["musculoskeletal", "common", "painful", "mechanical", "spinal", "chronic"],
        symptoms: ["lower back pain", "muscle spasm", "stiffness", "limited mobility", "radiating pain", "numbness"],
        description: "Pain in the lower back region, often due to muscle strain, disc problems, or poor posture.",
        image: "../diseases/back-pain.png",
        allopathic: [
            { name: "Ibuprofen 400 mg", dosage: "1-2 tabs 3x daily", notes: "Anti-inflammatory", otc: true },
            { name: "Muscle relaxants (Thiocolchicoside)", dosage: "As prescribed", notes: "Muscle spasm relief" },
            { name: "Diclofenac gel", dosage: "Apply 3-4x daily", notes: "Topical pain relief", otc: true },
            { name: "Gabapentin", dosage: "As prescribed", notes: "Neuropathic pain" },
        ],
        ayurvedic: [
            { name: "Yograj Guggulu", dosage: "2 tabs twice daily", notes: "Musculoskeletal disorders" },
            { name: "Mahanarayana oil", dosage: "External massage", notes: "Pain relief massage oil" },
            { name: "Rasna (Pluchea lanceolata)", dosage: "As per label", notes: "Joint and muscle pain" },
            { name: "Dashmoola kwath", dosage: "50 ml twice daily", notes: "Back pain relief" },
        ],
        lifestyle: ["Proper posture", "Core strengthening", "Ergonomic workplace", "Hot/cold therapy", "Physical therapy"],
    },

    // Mental Health Disorders
    {
        id: "depression",
        name: "Major Depressive Disorder",
        synonyms: ["depression", "clinical depression", "vishada", "udaasinta", "mental depression"],
        tags: ["mental-health", "mood", "chronic", "serious", "psychological", "psychiatric"],
        symptoms: ["persistent sadness", "loss of interest", "fatigue", "sleep changes", "appetite changes", "suicidal thoughts", "guilt", "worthlessness"],
        description: "A serious mental health disorder characterized by persistent low mood and loss of interest in activities.",
        image: "../diseases/depression.png",
        allopathic: [
            { name: "Sertraline 50 mg", dosage: "1 tab daily in morning", notes: "SSRI antidepressant" },
            { name: "Escitalopram 10 mg", dosage: "1 tab daily", notes: "SSRI with fewer side effects" },
            { name: "Amitriptyline 25 mg", dosage: "1 tab at bedtime", notes: "Tricyclic antidepressant" },
            { name: "Venlafaxine 75 mg", dosage: "1 tab daily", notes: "SNRI antidepressant" },
        ],
        ayurvedic: [
            { name: "Brahmi (Bacopa monnieri)", dosage: "As per label", notes: "Cognitive support, mood stability" },
            { name: "Ashwagandha powder", dosage: "1-2 g with milk at bedtime", notes: "Stress relief, mood enhancement" },
            { name: "Jatamansi powder", dosage: "1/2 tsp with warm water", notes: "Natural sedative, calming" },
            { name: "Saraswatarishta", dosage: "15-30 ml twice daily", notes: "Mental health tonic" },
        ],
        lifestyle: ["Psychotherapy", "Regular exercise", "Social support", "Stress management", "Sleep hygiene"],
    },
    {
        id: "anxiety-disorders",
        name: "Anxiety Disorders",
        synonyms: ["anxiety", "generalized anxiety", "chinta", "ghabrahat", "panic disorder"],
        tags: ["mental-health", "anxiety", "chronic", "psychological", "panic", "phobia"],
        symptoms: ["excessive worry", "restlessness", "irritability", "sleep problems", "concentration issues", "panic attacks", "physical tension"],
        description: "A group of mental health conditions characterized by excessive worry, fear, and anxiety.",
        image: "../diseases/anxiety-disorders.png",
        allopathic: [
            { name: "Alprazolam 0.5 mg", dosage: "As needed, max 3x daily", notes: "Short-term benzodiazepine" },
            { name: "Sertraline 50 mg", dosage: "1 tab daily", notes: "SSRI for long-term treatment" },
            { name: "Propranolol 40 mg", dosage: "1 tab twice daily", notes: "Beta blocker for physical symptoms" },
            { name: "Buspirone 10 mg", dosage: "1 tab twice daily", notes: "Non-benzodiazepine anxiolytic" },
        ],
        ayurvedic: [
            { name: "Brahmi (Bacopa monnieri)", dosage: "As per label", notes: "Cognitive support, anxiety relief" },
            { name: "Jatamansi powder", dosage: "1/2 tsp with warm water twice daily", notes: "Natural anxiolytic" },
            { name: "Shankhpushpi powder", dosage: "1-2 g with milk", notes: "Brain tonic, stress relief" },
            { name: "Tagar (Valeriana wallichii)", dosage: "As per label", notes: "Natural sedative" },
        ],
        lifestyle: ["Cognitive behavioral therapy", "Meditation", "Regular exercise", "Breathing techniques", "Stress management"],
    },
    {
        id: "insomnia",
        name: "Insomnia",
        synonyms: ["sleep disorder", "sleeplessness", "anidra", "neend na aana", "sleep problem"],
        tags: ["sleep", "mental-health", "chronic", "lifestyle-related", "sleep-disorder"],
        symptoms: ["difficulty falling asleep", "frequent night wakings", "early morning awakening", "daytime fatigue", "concentration problems", "irritability"],
        description: "A sleep disorder characterized by difficulty falling asleep, staying asleep, or poor sleep quality.",
        image: "../diseases/Insomnia.png",
        allopathic: [
            { name: "Zolpidem 10 mg", dosage: "1 tab at bedtime", notes: "Short-term sleep aid" },
            { name: "Melatonin 3 mg", dosage: "1 tab 30 min before bed", notes: "Natural sleep hormone", otc: true },
            { name: "Diphenhydramine 25 mg", dosage: "1 tab at bedtime", notes: "Antihistamine with sedating effect", otc: true },
            { name: "Trazodone 50 mg", dosage: "1 tab at bedtime", notes: "Antidepressant with sedating properties" },
        ],
        ayurvedic: [
            { name: "Tagar (Valeriana wallichii)", dosage: "As per label before bed", notes: "Natural sleep inducer" },
            { name: "Jatamansi powder", dosage: "1/2 tsp with warm milk before bed", notes: "Calming, sleep-promoting" },
            { name: "Brahmi tea", dosage: "1 cup before bedtime", notes: "Relaxing effect" },
            { name: "Ashwagandha powder", dosage: "1-2 g with milk at bedtime", notes: "Stress relief, better sleep" },
        ],
        lifestyle: ["Sleep hygiene", "Regular sleep schedule", "Avoid screens before bed", "Cool, dark room", "Relaxation techniques"],
    },

    // Dermatological Conditions
    {
        id: "acne",
        name: "Acne Vulgaris",
        synonyms: ["pimples", "acne", "muhanse", "skin problem", "blackheads", "whiteheads"],
        tags: ["skin", "common", "hormonal", "adolescent", "inflammatory", "dermatological"],
        symptoms: ["pimples", "blackheads", "whiteheads", "inflammation", "scarring", "oily skin", "cysts"],
        description: "A common skin condition characterized by clogged pores, pimples, and inflammation, often during adolescence.",
        image: "../diseases/acne.png",
        allopathic: [
            { name: "Benzoyl peroxide 2.5%", dosage: "Apply once daily", notes: "Antimicrobial topical treatment", otc: true },
            { name: "Salicylic acid 2%", dosage: "Apply once daily", notes: "Exfoliating agent", otc: true },
            { name: "Clindamycin gel 1%", dosage: "Apply twice daily", notes: "Topical antibiotic" },
            { name: "Isotretinoin", dosage: "As prescribed", notes: "Severe cases only" },
        ],
        ayurvedic: [
            { name: "Neem paste", dosage: "Apply locally 2x daily", notes: "Antibacterial, anti-inflammatory" },
            { name: "Turmeric paste", dosage: "Apply locally every other day", notes: "Anti-inflammatory, healing" },
            { name: "Sandalwood paste", dosage: "Apply locally", notes: "Cooling, soothing effect" },
            { name: "Manjistha (Rubia cordifolia)", dosage: "As per label", notes: "Blood purification" },
        ],
        lifestyle: ["Gentle cleansing twice daily", "Avoid touching face", "Non-comedogenic products", "Healthy diet", "Stress management"],
    },
    {
        id: "eczema",
        name: "Atopic Dermatitis (Eczema)",
        synonyms: ["eczema", "atopic dermatitis", "skin allergy", "chamdi ki khujli", "vichaarchika"],
        tags: ["skin", "chronic", "allergic", "inflammatory", "atopic", "dermatitis"],
        symptoms: ["itchy skin", "red patches", "dry skin", "scaling", "cracking", "thickened skin", "oozing"],
        description: "A chronic inflammatory skin condition causing itchy, red, and inflamed patches.",
        image: "../diseases/eczema.png",
        allopathic: [
            { name: "Hydrocortisone cream 1%", dosage: "Apply twice daily", notes: "Mild topical steroid", otc: true },
            { name: "Betamethasone cream", dosage: "Apply once daily", notes: "Potent topical steroid" },
            { name: "Cetirizine 10 mg", dosage: "1 tab daily", notes: "Antihistamine for itching", otc: true },
            { name: "Moisturizer", dosage: "Apply frequently", notes: "Barrier repair", otc: true },
        ],
        ayurvedic: [
            { name: "Neem oil", dosage: "Apply locally", notes: "Anti-inflammatory, antimicrobial" },
            { name: "Coconut oil", dosage: "Apply daily", notes: "Moisturizing, barrier function" },
            { name: "Turmeric paste", dosage: "Apply locally", notes: "Anti-inflammatory" },
            { name: "Manjistha (Rubia cordifolia)", dosage: "As per label", notes: "Skin purification" },
        ],
        lifestyle: ["Avoid triggers", "Gentle skin care", "Cotton clothing", "Humidifier use", "Stress management"],
    },
    {
        id: "psoriasis",
        name: "Psoriasis",
        synonyms: ["psoriasis", "skin scaling", "kitibha", "chamdi ki bimari", "scaly skin"],
        tags: ["skin", "autoimmune", "chronic", "inflammatory", "scaling", "dermatological"],
        symptoms: ["red patches", "silvery scales", "dry cracked skin", "itching", "burning", "thick nails"],
        description: "A chronic autoimmune skin condition causing rapid skin cell turnover and scaling patches.",
        image: "../diseases/psoriasis.png",
        allopathic: [
            { name: "Betamethasone cream", dosage: "Apply once daily", notes: "Topical corticosteroid" },
            { name: "Calcipotriol cream", dosage: "Apply twice daily", notes: "Vitamin D analog" },
            { name: "Methotrexate", dosage: "Weekly, as prescribed", notes: "Systemic treatment for severe cases" },
            { name: "Coal tar shampoo", dosage: "2-3 times weekly", notes: "Scalp psoriasis", otc: true },
        ],
        ayurvedic: [
            { name: "Turmeric paste", dosage: "Apply locally", notes: "Anti-inflammatory" },
            { name: "Neem oil", dosage: "Apply daily", notes: "Skin healing" },
            { name: "Khadira (Acacia catechu)", dosage: "As per label", notes: "Skin disorders" },
            { name: "Panchatikta ghrita", dosage: "As per practitioner", notes: "Ayurvedic skin formulation" },
        ],
        lifestyle: ["Sun exposure (moderate)", "Moisturize regularly", "Stress management", "Avoid triggers", "Healthy diet"],
    },
    

    // Urological Disorders
	{
		id: "urinary-tract-infection",
		name: "Urinary Tract Infection (UTI)",
        synonyms: ["UTI", "bladder infection", "mutra rog", "urinary infection", "cystitis"],
        tags: ["urinary", "bacterial", "common", "infectious", "bladder", "kidney"],
        symptoms: ["frequent urination", "burning sensation", "cloudy urine", "lower abdominal pain", "fever", "urgency", "blood in urine"],
		description: "Bacterial infection of the urinary system, commonly affecting the bladder and urethra.",
        image: "../diseases/urinary-tract-infection.png",
		allopathic: [
            { name: "Ciprofloxacin 500 mg", dosage: "1 tab twice daily for 3-7 days", notes: "Fluoroquinolone antibiotic" },
            { name: "Nitrofurantoin 100 mg", dosage: "1 tab 4x daily for 7 days", notes: "Urinary-specific antibiotic" },
            { name: "Trimethoprim-sulfamethoxazole", dosage: "1 tab twice daily", notes: "First-line for simple UTI" },
            { name: "Paracetamol 500 mg", dosage: "For pain/fever", notes: "Symptom relief", otc: true },
		],
		ayurvedic: [
            { name: "Gokshura (Tribulus terrestris)", dosage: "As per label", notes: "Urinary tract health" },
            { name: "Punarnava (Boerhavia diffusa)", dosage: "As per label", notes: "Natural diuretic" },
            { name: "Cranberry juice", dosage: "250 ml daily", notes: "UTI prevention and support" },
            { name: "Chandraprabha vati", dosage: "2 tabs twice daily", notes: "Urogenital disorders" },
        ],
        lifestyle: ["Adequate hydration", "Complete urination", "Good perineal hygiene", "Avoid holding urine", "Cotton underwear"],
    },
    {
        id: "kidney-stones",
        name: "Nephrolithiasis (Kidney Stones)",
        synonyms: ["kidney stones", "renal stones", "ashmari", "pathri", "kidney stone disease"],
        tags: ["urological", "painful", "metabolic", "recurrent", "renal", "calculi"],
        symptoms: ["severe flank pain", "blood in urine", "nausea", "vomiting", "frequent urination", "painful urination"],
        description: "Hard deposits of minerals and salts that form in the kidneys, causing severe pain.",
        image: "../diseases/Nephrolithiasis.png",
		allopathic: [
            { name: "Diclofenac 50 mg", dosage: "1 tab 3x daily", notes: "Pain relief and stone passage" },
            { name: "Tamsulosin 0.4 mg", dosage: "1 cap daily", notes: "Helps stone passage" },
            { name: "Allopurinol 100 mg", dosage: "1 tab daily", notes: "Prevent uric acid stones" },
            { name: "Lithotripsy", dosage: "As needed", notes: "Break up large stones" },
		],
		ayurvedic: [
            { name: "Gokshura (Tribulus terrestris)", dosage: "As per label", notes: "Kidney stone dissolution" },
            { name: "Punarnava (Boerhavia diffusa)", dosage: "As per label", notes: "Kidney health" },
            { name: "Varuna (Crataeva nurvala)", dosage: "As per label", notes: "Kidney stone treatment" },
            { name: "Chandraprabha vati", dosage: "2 tabs twice daily", notes: "Urinary tract disorders" },
        ],
        lifestyle: ["High fluid intake", "Low sodium diet", "Limit oxalate foods", "Regular exercise", "Monitor calcium intake"],
    },
    {
        id: "benign-prostatic-hyperplasia",
        name: "Benign Prostatic Hyperplasia (BPH)",
        synonyms: ["enlarged prostate", "BPH", "prostate enlargement", "prostate gland ki sujan"],
        tags: ["urological", "male", "age-related", "benign", "prostatic", "obstructive"],
        symptoms: ["frequent urination", "weak urine stream", "difficulty starting urination", "incomplete bladder emptying", "nocturia"],
        description: "Non-cancerous enlargement of the prostate gland, common in older men.",
        image: "../diseases/benign-prostatic-hyperplasia.png",
		allopathic: [
            { name: "Tamsulosin 0.4 mg", dosage: "1 cap daily", notes: "Alpha-blocker" },
            { name: "Finasteride 5 mg", dosage: "1 tab daily", notes: "5-alpha reductase inhibitor" },
            { name: "Dutasteride 0.5 mg", dosage: "1 cap daily", notes: "Dual 5-alpha reductase inhibitor" },
            { name: "Saw palmetto extract", dosage: "320 mg daily", notes: "Herbal supplement", otc: true },
		],
		ayurvedic: [
            { name: "Gokshura (Tribulus terrestris)", dosage: "As per label", notes: "Urogenital health" },
            { name: "Varuna (Crataeva nurvala)", dosage: "As per label", notes: "Prostate support" },
            { name: "Shilajit", dosage: "As per label", notes: "Male reproductive health" },
            { name: "Chandraprabha vati", dosage: "2 tabs twice daily", notes: "Urinary disorders" },
        ],
        lifestyle: ["Regular exercise", "Healthy diet", "Limit fluid before bedtime", "Regular medical check-ups", "Avoid decongestants"],
    },

    // Hematological Disorders
    {
        id: "iron-deficiency-anemia",
        name: "Iron Deficiency Anemia",
        synonyms: ["anemia", "iron deficiency", "low hemoglobin", "pandu rog", "khoon ki kami"],
        tags: ["blood", "nutritional", "chronic", "common", "hematological", "deficiency"],
        symptoms: ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "cold hands and feet", "brittle nails"],
        description: "A condition where the body lacks sufficient healthy red blood cells due to iron deficiency.",
        image: "../diseases/iron-deficiency-anemia.png",
		allopathic: [
            { name: "Ferrous sulfate 200 mg", dosage: "1 tab twice daily on empty stomach", notes: "Iron supplement" },
            { name: "Folic acid 5 mg", dosage: "1 tab daily", notes: "Supports red blood cell formation" },
            { name: "Vitamin B12 1000 mcg", dosage: "1 tab daily", notes: "Megaloblastic anemia prevention" },
            { name: "Vitamin C 500 mg", dosage: "1 tab with iron", notes: "Enhances iron absorption", otc: true },
		],
		ayurvedic: [
            { name: "Navayasa loha", dosage: "As per practitioner", notes: "Ayurvedic iron preparation" },
            { name: "Punarnava mandura", dosage: "As per label", notes: "Iron and kidney support" },
            { name: "Amla juice", dosage: "30 ml daily", notes: "Natural vitamin C source" },
            { name: "Lauh bhasma", dosage: "As per practitioner", notes: "Processed iron preparation" },
        ],
        lifestyle: ["Iron-rich foods", "Vitamin C with iron", "Avoid tea/coffee with meals", "Cook in iron pans", "Regular blood tests"],
    },
    {
        id: "thalassemia",
        name: "Thalassemia",
        synonyms: ["thalassemia", "inherited anemia", "mediterranean anemia", "genetic blood disorder"],
        tags: ["blood", "genetic", "inherited", "chronic", "hematological", "hemoglobin"],
        symptoms: ["fatigue", "weakness", "pale skin", "facial bone deformities", "slow growth", "abdominal swelling"],
        description: "An inherited blood disorder causing reduced hemoglobin production and chronic anemia.",
        image: "../diseases/thalassemia.png",
		allopathic: [
            { name: "Blood transfusion", dosage: "Regular, as needed", notes: "Primary treatment for major thalassemia" },
            { name: "Deferasirox", dosage: "As prescribed", notes: "Iron chelation therapy" },
            { name: "Folic acid 5 mg", dosage: "1 tab daily", notes: "Support red blood cell production" },
            { name: "Bone marrow transplant", dosage: "One-time procedure", notes: "Curative treatment" },
		],
		ayurvedic: [
            { name: "Punarnava mandura", dosage: "As per practitioner", notes: "Blood disorders" },
            { name: "Amla (Emblica officinalis)", dosage: "As per label", notes: "Antioxidant support" },
            { name: "Mandukparni (Centella asiatica)", dosage: "As per label", notes: "Blood purification" },
            { name: "Sarivadi vati", dosage: "As per practitioner", notes: "Blood disorders" },
        ],
        lifestyle: ["Regular medical monitoring", "Avoid iron supplements", "Genetic counseling", "Vaccinations", "Avoid infections"],
    },

    // Nutritional Deficiencies
    {
        id: "vitamin-d-deficiency",
        name: "Vitamin D Deficiency",
        synonyms: ["vitamin D deficiency", "sunshine vitamin deficiency", "rickets", "osteomalacia"],
        tags: ["nutritional", "common", "lifestyle-related", "bone-health", "metabolic", "deficiency"],
        symptoms: ["bone pain", "muscle weakness", "fatigue", "mood changes", "frequent infections", "dental problems"],
        description: "Insufficient levels of vitamin D, essential for bone health, immune function, and overall wellness.",
        image: "../diseases/vitamin-d-deficiency.png",
		allopathic: [
            { name: "Vitamin D3 1000 IU", dosage: "1 tab daily", notes: "Maintenance dose", otc: true },
            { name: "Vitamin D3 60,000 IU", dosage: "Weekly for 8 weeks", notes: "Loading dose for deficiency" },
            { name: "Calcium 500 mg + Vitamin D3", dosage: "1 tab twice daily", notes: "Combined supplement", otc: true },
            { name: "Calcitriol 0.25 mcg", dosage: "As prescribed", notes: "Active vitamin D for severe cases" },
		],
		ayurvedic: [
            { name: "Sesame seeds (til)", dosage: "1 tbsp daily", notes: "Natural calcium and healthy fats" },
            { name: "Almonds", dosage: "5-7 soaked almonds daily", notes: "Calcium and vitamin E" },
            { name: "Mushroom powder", dosage: "As per label", notes: "Natural vitamin D source" },
            { name: "Cod liver oil", dosage: "1 tsp daily", notes: "Vitamin D and A source" },
        ],
        lifestyle: ["Daily sun exposure 15-30 min", "Vitamin D-rich foods", "Regular exercise", "Maintain healthy weight", "Regular testing"],
    },
    {
        id: "vitamin-b12-deficiency",
        name: "Vitamin B12 Deficiency",
        synonyms: ["B12 deficiency", "pernicious anemia", "cobalamin deficiency", "megaloblastic anemia"],
        tags: ["nutritional", "neurological", "hematological", "deficiency", "vitamin-B", "metabolic"],
        symptoms: ["fatigue", "weakness", "nerve problems", "memory issues", "pale skin", "tongue soreness", "balance problems"],
        description: "Deficiency of vitamin B12, essential for nerve function, red blood cell formation, and DNA synthesis.",
        image: "../diseases/vitamin-b12-deficiency.png",
		allopathic: [
            { name: "Vitamin B12 1000 mcg", dosage: "1 tab daily", notes: "Oral supplementation", otc: true },
            { name: "Vitamin B12 injection", dosage: "1000 mcg weekly", notes: "For severe deficiency or absorption issues" },
            { name: "Methylcobalamin 1500 mcg", dosage: "1 tab daily", notes: "Active form of B12", otc: true },
		],
		ayurvedic: [
            { name: "Amla (Emblica officinalis)", dosage: "30 ml juice daily", notes: "Enhances B12 absorption" },
            { name: "Liver extract supplements", dosage: "As per label", notes: "Natural B12 source" },
            { name: "Nutritional yeast", dosage: "2 tbsp daily", notes: "B12-fortified yeast" },
            { name: "Spirulina", dosage: "As per label", notes: "Algae-based B vitamin source" },
        ],
        lifestyle: ["B12-rich foods", "Regular monitoring", "Address underlying causes", "Avoid alcohol", "Consider injections if needed"],
    },

    // Ophthalmological Disorders
    {
        id: "conjunctivitis",
        name: "Conjunctivitis (Pink Eye)",
        synonyms: ["pink eye", "eye infection", "red eye", "netra abhishyanda", "aankh ki sujan"],
        tags: ["eye", "infectious", "inflammatory", "contagious", "acute", "ophthalmological"],
        symptoms: ["red eyes", "eye discharge", "itching", "burning sensation", "tearing", "light sensitivity", "gritty feeling"],
        description: "Inflammation of the conjunctiva, the thin membrane covering the eye and inner eyelid.",
        image: "../diseases/conjunctivitis.png",
		allopathic: [
            { name: "Chloramphenicol eye drops", dosage: "1-2 drops every 2-4 hours", notes: "Bacterial conjunctivitis" },
            { name: "Olopatadine eye drops", dosage: "1 drop twice daily", notes: "Allergic conjunctivitis", otc: true },
            { name: "Artificial tears", dosage: "As needed", notes: "Comfort and lubrication", otc: true },
            { name: "Antihistamine tablets", dosage: "As per label", notes: "Allergic symptoms", otc: true },
		],
		ayurvedic: [
            { name: "Triphala eye wash", dosage: "Rinse 2x daily", notes: "Eye cleansing and healing" },
            { name: "Rose water", dosage: "Apply with cotton pad", notes: "Cooling and soothing" },
            { name: "Honey drops (diluted)", dosage: "1 drop diluted honey", notes: "Antimicrobial properties" },
            { name: "Aloe vera gel", dosage: "Apply around eyes", notes: "Anti-inflammatory" },
        ],
        lifestyle: ["Good hand hygiene", "Avoid touching eyes", "Clean towels daily", "Replace eye makeup", "Cold compresses"],
    },
    {
        id: "glaucoma",
        name: "Glaucoma",
        synonyms: ["eye pressure", "vision loss", "timira", "netra roga", "kala motia"],
        tags: ["eye", "chronic", "serious", "progressive", "vision-threatening", "ophthalmological"],
        symptoms: ["gradual vision loss", "eye pain", "headaches", "rainbow halos", "nausea", "tunnel vision"],
        description: "A group of eye diseases causing progressive damage to the optic nerve, often due to increased eye pressure.",
        image: "../diseases/glaucoma.png",
		allopathic: [
            { name: "Timolol eye drops", dosage: "1 drop twice daily", notes: "Beta-blocker for eye pressure" },
            { name: "Latanoprost eye drops", dosage: "1 drop at bedtime", notes: "Prostaglandin analog" },
            { name: "Dorzolamide eye drops", dosage: "1 drop 3x daily", notes: "Carbonic anhydrase inhibitor" },
            { name: "Trabeculectomy", dosage: "Surgical procedure", notes: "Advanced cases" },
		],
		ayurvedic: [
            { name: "Triphala churna", dosage: "1-2 g twice daily", notes: "Eye health support" },
            { name: "Bilberry extract", dosage: "As per label", notes: "Vision support" },
            { name: "Ginkgo biloba", dosage: "As per label", notes: "Circulation improvement" },
            { name: "Netra basti", dosage: "Specialized treatment", notes: "Consult Ayurvedic specialist" },
        ],
        lifestyle: ["Regular eye exams", "Eye pressure monitoring", "Avoid head-down positions", "Gentle exercise", "Stress management"],
    },
    {
        id: "cataracts",
        name: "Cataracts",
        synonyms: ["lens clouding", "vision blur", "dhusara motia", "safed motia", "lens opacity"],
        tags: ["eye", "age-related", "degenerative", "vision-impairment", "surgical", "ophthalmological"],
        symptoms: ["blurred vision", "light sensitivity", "night vision problems", "seeing halos", "faded colors", "double vision"],
        description: "Clouding of the natural lens of the eye, causing vision problems and potential blindness if untreated.",
        image: "../diseases/cataracts.png",
		allopathic: [
            { name: "Cataract surgery", dosage: "Outpatient procedure", notes: "Definitive treatment" },
            { name: "Artificial lens implant", dosage: "During surgery", notes: "Replace cloudy lens" },
            { name: "Anti-inflammatory eye drops", dosage: "Post-surgery", notes: "Prevent complications" },
            { name: "Protective eyewear", dosage: "Daily use", notes: "UV protection" },
		],
		ayurvedic: [
            { name: "Triphala churna", dosage: "1-2 g twice daily", notes: "Eye health and antioxidants" },
            { name: "Honey eye drops", dosage: "1 drop diluted honey", notes: "Traditional remedy" },
            { name: "Carrot juice", dosage: "1 glass daily", notes: "Beta-carotene for eye health" },
            { name: "Bilberry extract", dosage: "As per label", notes: "Antioxidant support" },
        ],
        lifestyle: ["UV protection", "Regular eye exams", "Antioxidant-rich diet", "Quit smoking", "Control diabetes"],
    },
    {
        id: "dry-eyes",
        name: "Dry Eye Syndrome",
        synonyms: ["dry eyes", "keratoconjunctivitis sicca", "aankh mein sukhapan", "netra shushkata"],
        tags: ["eye", "chronic", "common", "tear-film", "comfort", "ophthalmological"],
        symptoms: ["dry sensation", "burning eyes", "itching", "redness", "blurred vision", "eye fatigue", "tearing"],
        description: "A condition where eyes don't produce enough tears or the tears evaporate too quickly.",
        image: "../diseases/dry-eyes.png",
		allopathic: [
            { name: "Artificial tears", dosage: "4-6 times daily", notes: "Lubricating eye drops", otc: true },
            { name: "Cyclosporine eye drops", dosage: "1 drop twice daily", notes: "Prescription anti-inflammatory" },
            { name: "Punctal plugs", dosage: "Minor procedure", notes: "Block tear drainage" },
            { name: "Omega-3 supplements", dosage: "1000 mg daily", notes: "Improve tear quality", otc: true },
		],
		ayurvedic: [
            { name: "Ghee eye drops", dosage: "1 drop at bedtime", notes: "Nourishing and lubricating" },
            { name: "Rose water", dosage: "Apply with cotton pad", notes: "Cooling and hydrating" },
            { name: "Castor oil", dosage: "1 drop at bedtime", notes: "Moisturizing" },
            { name: "Netra basti", dosage: "Professional treatment", notes: "Specialized eye therapy" },
        ],
        lifestyle: ["Humidify environment", "Take screen breaks", "Blink exercises", "Avoid wind/smoke", "Stay hydrated"],
    },

    // Gynecological Disorders
    {
        id: "pcos",
        name: "Polycystic Ovary Syndrome (PCOS)",
        synonyms: ["PCOS", "polycystic ovaries", "PCOD", "hormonal imbalance", "garbhashaya granthi"],
        tags: ["gynecological", "hormonal", "metabolic", "reproductive", "chronic", "endocrine"],
        symptoms: ["irregular periods", "weight gain", "acne", "excessive hair growth", "hair loss", "difficulty conceiving", "mood changes"],
        description: "A hormonal disorder affecting women of reproductive age, characterized by enlarged ovaries with small cysts.",
        image: "../diseases/pcos.png",
		allopathic: [
            { name: "Metformin 500 mg", dosage: "1 tab twice daily", notes: "Insulin resistance" },
            { name: "Oral contraceptives", dosage: "As prescribed", notes: "Regulate periods" },
            { name: "Spironolactone 50 mg", dosage: "1 tab twice daily", notes: "Reduce androgen effects" },
            { name: "Clomiphene citrate", dosage: "As prescribed", notes: "Fertility treatment" },
		],
		ayurvedic: [
            { name: "Shatavari powder", dosage: "1-2 g with milk twice daily", notes: "Female reproductive health" },
            { name: "Ashwagandha", dosage: "1-2 g daily", notes: "Hormonal balance" },
            { name: "Cinnamon powder", dosage: "1/2 tsp with warm water", notes: "Insulin sensitivity" },
            { name: "Chandraprabha vati", dosage: "2 tabs twice daily", notes: "Reproductive disorders" },
        ],
        lifestyle: ["Weight management", "Regular exercise", "Low-GI diet", "Stress reduction", "Regular monitoring"],
    },
    {
        id: "menstrual-disorders",
        name: "Menstrual Disorders",
        synonyms: ["irregular periods", "heavy bleeding", "rajahpradara", "masik dharm ki samasya", "period problems"],
        tags: ["gynecological", "reproductive", "hormonal", "menstrual", "women-health"],
        symptoms: ["irregular cycles", "heavy bleeding", "painful periods", "missed periods", "spotting", "mood changes"],
        description: "Various abnormalities in the menstrual cycle including irregular, heavy, or painful periods.",
        image: "../diseases/menstrual-disorders.png",
        allopathic: [
            { name: "Hormonal contraceptives", dosage: "As prescribed", notes: "Cycle regulation" },
            { name: "Tranexamic acid 500 mg", dosage: "3x daily during periods", notes: "Heavy bleeding" },
            { name: "NSAIDs", dosage: "As needed", notes: "Pain relief", otc: true },
            { name: "Iron supplements", dosage: "As needed", notes: "Prevent anemia" },
        ],
        ayurvedic: [
            { name: "Ashoka (Saraca asoca)", dosage: "As per label", notes: "Menstrual disorders" },
            { name: "Lodhra (Symplocos racemosa)", dosage: "As per label", notes: "Heavy bleeding" },
            { name: "Shatavari powder", dosage: "1-2 g with milk", notes: "Hormonal balance" },
            { name: "Pushyanuga churna", dosage: "As per practitioner", notes: "Menstrual irregularities" },
        ],
        lifestyle: ["Stress management", "Regular exercise", "Healthy diet", "Adequate sleep", "Track menstrual cycle"],
    },
    {
        id: "urinary-incontinence",
        name: "Urinary Incontinence",
        synonyms: ["bladder control", "urine leakage", "mutra asandam", "peshab ka rukna", "bladder weakness"],
        tags: ["urological", "gynecological", "age-related", "pelvic", "bladder", "incontinence"],
        symptoms: ["urine leakage", "frequent urination", "urgency", "nocturia", "bladder spasms"],
        description: "Loss of bladder control causing involuntary urine leakage, common in older adults and post-childbirth women.",
        image: "../diseases/urinary-incontinence.png",
        allopathic: [
            { name: "Solifenacin 5 mg", dosage: "1 tab daily", notes: "Overactive bladder" },
            { name: "Mirabegron 50 mg", dosage: "1 tab daily", notes: "Beta-3 agonist" },
            { name: "Pelvic floor exercises", dosage: "Daily routine", notes: "Strengthen muscles" },
            { name: "Bladder training", dosage: "Behavioral therapy", notes: "Improve control" },
        ],
        ayurvedic: [
            { name: "Gokshura (Tribulus terrestris)", dosage: "As per label", notes: "Bladder strength" },
            { name: "Shilajit", dosage: "As per label", notes: "Urogenital health" },
            { name: "Chandraprabha vati", dosage: "2 tabs twice daily", notes: "Urinary disorders" },
            { name: "Varuna (Crataeva nurvala)", dosage: "As per label", notes: "Bladder support" },
        ],
        lifestyle: ["Kegel exercises", "Bladder training", "Fluid management", "Weight control", "Avoid bladder irritants"],
    },

    // Pediatric Conditions
    
    {
        "id": "obesity",
        "name": "Obesity",
        "synonyms": ["overweight", "excess weight", "motapa", "body fat accumulation"],
        "tags": ["metabolic", "lifestyle-related", "nutritional", "chronic", "behavioral"],
        "symptoms": [
            "excess weight",
            "difficulty breathing",
            "sleep problems",
            "joint pain",
            "low self-esteem",
            "fatigue",
            "reduced mobility"
        ],
        "description": "A condition characterized by excessive accumulation of body fat that presents health risks and can lead to various medical and social complications.",
        "image": "../diseases/Obesity.png",
        "allopathic": [
            { "name": "Lifestyle modification", "dosage": "Comprehensive program", "notes": "Primary approach to management" },
            { "name": "Dietary counseling", "dosage": "Regular sessions", "notes": "Personalized nutritional advice" },
            { "name": "Physical activity plan", "dosage": "150 min/week moderate activity", "notes": "Adjust according to age and ability" },
            { "name": "Pharmacotherapy", "dosage": "As prescribed", "notes": "For cases unresponsive to lifestyle changes" },
            { "name": "Bariatric surgery", "dosage": "As per specialist evaluation", "notes": "For severe obesity with complications" }
        ],
        "ayurvedic": [
            { "name": "Triphala churna", "dosage": "1/2 tsp with warm water", "notes": "Supports digestion and detox" },
            { "name": "Honey lemon water", "dosage": "1 glass morning", "notes": "Promotes metabolism" },
            { "name": "Guggulu", "dosage": "As per practitioner", "notes": "Fat metabolizer and anti-inflammatory" },
            { "name": "Medohar churna", "dosage": "As per practitioner", "notes": "Helps manage obesity" }
        ],
        "lifestyle": [
            "Balanced, calorie-controlled diet",
            "Regular physical activity",
            "Limit processed and sugary foods",
            "Reduce screen time and sedentary behavior",
            "Stress management and sleep hygiene",
            "Family and social support"
        ]
    }
,    
    {
        id: "attention-deficit-hyperactivity-disorder",
        name: "Attention Deficit Hyperactivity Disorder (ADHD)",
        synonyms: ["ADHD", "hyperactivity", "attention deficit", "dhyan ki kami", "behavioral disorder"],
        tags: ["pediatric", "neurological", "behavioral", "developmental", "attention", "hyperactivity"],
        symptoms: ["inattention", "hyperactivity", "impulsiveness", "difficulty focusing", "restlessness", "academic problems"],
        description: "A neurodevelopmental disorder characterized by persistent patterns of inattention and/or hyperactivity-impulsivity.",
        image: "../diseases/attention-deficit-hyperactivity-disorder.png",
        allopathic: [
            { name: "Methylphenidate", dosage: "As prescribed", notes: "Stimulant medication" },
            { name: "Atomoxetine", dosage: "As prescribed", notes: "Non-stimulant option" },
            { name: "Behavioral therapy", dosage: "Regular sessions", notes: "Skill development" },
            { name: "Educational support", dosage: "School coordination", notes: "Academic accommodations" },
        ],
        ayurvedic: [
            { name: "Brahmi (Bacopa monnieri)", dosage: "Child-appropriate dose", notes: "Cognitive support" },
            { name: "Shankhpushpi syrup", dosage: "5-10 ml twice daily", notes: "Brain tonic" },
            { name: "Jatamansi", dosage: "As per practitioner", notes: "Calming effect" },
            { name: "Saraswatarishta", dosage: "Age-appropriate", notes: "Mental development" },
        ],
        lifestyle: ["Structured routine", "Behavioral interventions", "Educational support", "Physical activity", "Limit sugar/additives"],
    },

    // Geriatric Conditions
    {
        id: "dementia",
        name: "Dementia",
        synonyms: ["memory loss", "cognitive decline", "smriti bhransh", "bhoolne ki bimari", "alzheimer type"],
        tags: ["geriatric", "neurological", "degenerative", "progressive", "cognitive", "memory"],
        symptoms: ["memory loss", "confusion", "difficulty with daily tasks", "personality changes", "disorientation", "language problems"],
        description: "A syndrome characterized by progressive decline in cognitive function affecting daily life activities.",
        image: "../diseases/dementia.png",
        allopathic: [
            { name: "Donepezil 5-10 mg", dosage: "1 tab daily", notes: "Cholinesterase inhibitor" },
            { name: "Memantine 10 mg", dosage: "1 tab twice daily", notes: "NMDA receptor antagonist" },
            { name: "Antipsychotics", dosage: "As needed", notes: "Behavioral symptoms only" },
            { name: "Multivitamins", dosage: "Daily", notes: "Nutritional support", otc: true },
        ],
        ayurvedic: [
            { name: "Brahmi (Bacopa monnieri)", dosage: "As per label", notes: "Memory enhancement" },
            { name: "Mandukaparni (Centella asiatica)", dosage: "As per label", notes: "Cognitive support" },
            { name: "Shankhpushpi", dosage: "1-2 g daily", notes: "Brain tonic" },
            { name: "Medhya rasayana", dosage: "As per practitioner", notes: "Brain rejuvenation" },
        ],
        lifestyle: ["Mental stimulation", "Physical exercise", "Social engagement", "Structured environment", "Caregiver support"],
    },
    {
        id: "osteoarthritis",
        name: "Osteoarthritis",
        synonyms: ["degenerative joint disease", "wear and tear arthritis", "sandhi vata", "jodon ka ghisna"],
        tags: ["geriatric", "joints", "degenerative", "age-related", "chronic", "painful"],
        symptoms: ["joint pain", "stiffness", "reduced mobility", "joint swelling", "bone spurs", "muscle weakness"],
        description: "Degenerative joint disease causing cartilage breakdown and bone changes, common in aging.",
        image: "../diseases/osteoarthritis.png",
        allopathic: [
            { name: "Paracetamol 500 mg", dosage: "1-2 tabs 4x daily", notes: "First-line pain relief", otc: true },
            { name: "Topical NSAIDs", dosage: "Apply 3-4x daily", notes: "Localized treatment", otc: true },
            { name: "Hyaluronic acid injections", dosage: "Intra-articular", notes: "Severe cases" },
            { name: "Glucosamine 1500 mg", dosage: "1 tab daily", notes: "Joint health support", otc: true },
        ],
        ayurvedic: [
            { name: "Yograj Guggulu", dosage: "2 tabs twice daily", notes: "Joint disorders" },
            { name: "Mahanarayana oil", dosage: "External massage", notes: "Pain relief massage" },
            { name: "Ashwagandha", dosage: "1-2 g daily", notes: "Anti-inflammatory" },
            { name: "Rasna (Pluchea lanceolata)", dosage: "As per label", notes: "Joint pain relief" },
        ],
        lifestyle: ["Low-impact exercise", "Weight management", "Physical therapy", "Joint protection", "Heat therapy"],
    },

    // Additional Common Conditions
    {
        id: "food-poisoning",
        name: "Food Poisoning",
        synonyms: ["food-borne illness", "gastroenteritis", "aahar vish", "khaane se bimari", "stomach infection"],
        tags: ["digestive", "infectious", "acute", "food-borne", "bacterial", "toxin"],
        symptoms: ["nausea", "vomiting", "diarrhea", "abdominal cramps", "fever", "headache", "dehydration"],
        description: "Illness caused by consuming contaminated food or water containing harmful bacteria, viruses, or toxins.",
        image: "../diseases/food-poisoning.png",
        allopathic: [
            { name: "ORS solution", dosage: "Frequent small sips", notes: "Prevent dehydration", otc: true },
            { name: "Loperamide 2 mg", dosage: "As needed for diarrhea", notes: "Not if fever present", otc: true },
            { name: "Probiotics", dosage: "As per label", notes: "Restore gut flora", otc: true },
            { name: "Antibiotics", dosage: "Only if prescribed", notes: "Severe bacterial cases only" },
        ],
        ayurvedic: [
            { name: "Kutaj (Holarrhena antidysenterica)", dosage: "As per label", notes: "Natural anti-diarrheal" },
            { name: "Bilva (Aegle marmelos)", dosage: "As per label", notes: "Digestive disorders" },
            { name: "Ginger tea", dosage: "2-3 cups daily", notes: "Nausea relief" },
            { name: "Mint tea", dosage: "As needed", notes: "Stomach soothing" },
        ],
        lifestyle: ["Rest", "Gradual rehydration", "BRAT diet", "Avoid dairy initially", "Food safety measures"],
    },
    {
        id: "heat-stroke",
        name: "Heat Stroke",
        synonyms: ["heat exhaustion", "sun stroke", "garmi ki maar", "dhoop ki maar", "heat illness"],
        tags: ["emergency", "heat-related", "environmental", "serious", "thermoregulation", "acute"],
        symptoms: ["high fever", "hot dry skin", "confusion", "nausea", "rapid pulse", "headache", "loss of consciousness"],
        description: "A serious heat-related illness where the body overheats and cannot cool down effectively.",
        image: "../diseases/heat-stroke.jpg",
        allopathic: [
            { name: "Immediate cooling", dosage: "Ice packs, cool water", notes: "Emergency treatment" },
            { name: "IV fluids", dosage: "Hospital treatment", notes: "Severe dehydration" },
            { name: "Electrolyte replacement", dosage: "As needed", notes: "Correct imbalances" },
            { name: "Temperature monitoring", dosage: "Continuous", notes: "Prevent complications" },
        ],
        ayurvedic: [
            { name: "Coconut water", dosage: "Frequent intake", notes: "Natural electrolytes" },
            { name: "Watermelon juice", dosage: "Fresh juice", notes: "Cooling and hydrating" },
            { name: "Mint sherbet", dosage: "Cool drink", notes: "Body cooling" },
            { name: "Coriander water", dosage: "Soaked overnight", notes: "Cooling effect" },
        ],
        lifestyle: ["Immediate shade/AC", "Remove excess clothing", "Cool water application", "Seek emergency care", "Prevention measures"],
    },
    {
        id: "motion-sickness",
        name: "Motion Sickness",
        synonyms: ["travel sickness", "car sickness", "sea sickness", "safar ki bimari", "chakkar aana"],
        tags: ["travel", "vestibular", "nausea", "acute", "motion", "sensory"],
        symptoms: ["nausea", "vomiting", "dizziness", "sweating", "headache", "fatigue", "salivation"],
        description: "Nausea and discomfort caused by motion during travel in cars, boats, planes, or other vehicles.",
        image: "../diseases/motion-sickness.png",
        allopathic: [
            { name: "Dimenhydrinate 50 mg", dosage: "1 tab 30 min before travel", notes: "Antihistamine", otc: true },
            { name: "Meclizine 25 mg", dosage: "1 tab before travel", notes: "Anti-nausea", otc: true },
            { name: "Scopolamine patch", dosage: "Apply behind ear", notes: "Long-acting prevention" },
            { name: "Ginger capsules 500 mg", dosage: "1-2 caps before travel", notes: "Natural remedy", otc: true },
        ],
        ayurvedic: [
            { name: "Fresh ginger", dosage: "Small piece to chew", notes: "Natural anti-nausea" },
            { name: "Mint tea", dosage: "Before and during travel", notes: "Stomach soothing" },
            { name: "Lemon drops", dosage: "Suck during travel", notes: "Nausea relief" },
            { name: "Fennel seeds", dosage: "Chew small amount", notes: "Digestive support" },
        ],
        lifestyle: ["Look at horizon", "Fresh air", "Avoid reading", "Light meals", "Front seat travel"],
	},
];

export function searchByName(query: string): Disease[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return diseases.filter((d) =>
		[d.name, ...(d.synonyms || [])]
			.join(" ")
			.toLowerCase()
			.includes(q)
	);
}

export function searchBySymptoms(input: string): Disease[] {
	const tokens = input
		.toLowerCase()
		.split(/[\,\n\s]+/)
		.map((t) => t.trim())
		.filter(Boolean);
	if (tokens.length === 0) return [];
    return diseases.filter((d) => 
        tokens.every((t) => 
            d.symptoms.some((s) => s.toLowerCase().includes(t))
        )
    );
}

export function searchByTags(tags: string[]): Disease[] {
	if (tags.length === 0) return [];
	const tagSet = new Set(tags.map((t) => t.toLowerCase()));
    return diseases.filter((d) => 
        d.tags?.some((tag) => tagSet.has(tag.toLowerCase()))
    );
}

export function getAllDiseases(): Disease[] {
    return diseases;
}

export function getDiseaseById(id: string): Disease | undefined {
    return diseases.find((d) => d.id === id);
}

export function searchMultiple(query: string, symptoms: string[], tags: string[]): Disease[] {
    let results: Disease[] = [];
    
    // Search by name/synonyms
    if (query) {
        results = [...results, ...searchByName(query)];
    }
    
    // Search by symptoms
    if (symptoms.length > 0) {
        results = [...results, ...searchBySymptoms(symptoms.join(' '))];
    }
    
    // Search by tags
    if (tags.length > 0) {
        results = [...results, ...searchByTags(tags)];
    }
    
    // Remove duplicates based on ID
    const uniqueResults = results.filter((disease, index, self) => 
        index === self.findIndex((d) => d.id === disease.id)
    );
    
    return uniqueResults;
}

export function getRandomDiseases(count: number = 6): Disease[] {
    const shuffled = diseases.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function getDiseasesByCategory(category: string): Disease[] {
    return diseases.filter((d) => 
        d.tags?.some((tag) => tag.toLowerCase().includes(category.toLowerCase()))
    );
}
