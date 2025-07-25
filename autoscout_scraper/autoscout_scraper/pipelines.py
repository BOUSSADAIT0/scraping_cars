import pymongo
import re

class MongoDBPipeline:
    def open_spider(self, spider):
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.db = self.client["autoscout24_db"]
        self.collection = self.db["annonces"]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        item = dict(item)

        # 1. Prix
        prix = item.get('Prix', '')
        prix_num = 0
        if prix:
            try:
                prix_num = int(prix.replace('€', '').replace('\u202f', '').replace(' ', '').strip())
            except:
                prix_num = 0
        item['Prix €'] = prix_num
        item.pop('Prix', None)

        # 2. Kilométrage
        km = item.get('Kilometrage', '')
        km_num = 0
        if km:
            try:
                km_num = int(km.replace('km', '').replace('\u202f', '').replace(' ', '').strip())
            except:
                km_num = 0
        item['Kilometrage_km'] = km_num
        item.pop('Kilometrage', None)

        # 3. Puissance (CH)
        puissance = item.get('Puissance', '')
        ch = 0
        if puissance:
            match = re.search(r'\(\s*(\d+)\s*CH\s*\)', puissance)
            if match:
                ch = int(match.group(1))
        item['Puissance_CH'] = ch
        item.pop('Puissance', None)

        # 4. Supprimer URL et position
        item.pop('URL', None)
        item.pop('position_page', None)

        # 5. Cylindrée
        cyl_str = item.get('Cylindrée', '')
        cylindrée = 0
        if cyl_str:
            match = re.search(r'(\d+)\s*cm³', cyl_str)
            if match:
                cylindrée = int(match.group(1))
        item['Cylindrée_cm³'] = cylindrée
        item.pop('Cylindrée', None)

        # 6. CO2
        co2_str = item.get('CO2', '')
        CO2_num = 0
        if co2_str:
            match = re.search(r'(\d+)\s*g/km', co2_str)
            if match:
                CO2_num = int(match.group(1))
        item['CO2_g/km'] = CO2_num
        item.pop('CO2', None)

        # 7. Garantie
        garantie_str = item.get('Garantie', '')
        Garantie_num = 0
        if garantie_str:
            match = re.search(r'(\d+)\s*mois', garantie_str)
            if match:
                Garantie_num = int(match.group(1))
        item['Garantie_mois'] = Garantie_num
        item.pop('Garantie', None)

        # 8. Année
        annee_str = item.get('Annee', '')
        Annee_num = 0
        if annee_str:
            match = re.search(r'\b(\d{4})\b', annee_str)
            if match:
                Annee_num = int(match.group(1))
        item['Annee'] = Annee_num
        

        # 9. Sieges
        sieges_str = item.get('Sieges', '')
        Sieges_num = 0
        try:
            Sieges_num = int(sieges_str)
        except:
            Sieges_num = 0
        item['Sieges'] = Sieges_num

        # 10. Portes
        portes_str = item.get('Portes', '')
        Portes_num = 0
        try:
            Portes_num = int(portes_str)
        except:
            Portes_num = 0
        item['Portes'] = Portes_num

        # 11. Remplacement valeurs vides
        for k, v in item.items():
            if v is None or (isinstance(v, str) and v.strip() == ''):
                if k in ['Prix €', 'Kilometrage_km', 'Puissance_CH', 'Sieges', 'Portes', 'Annee', 'Cylindrée_cm³', 'CO2_g/km', 'Garantie_mois']:
                    item[k] = 0
                else:
                    item[k] = 'NON'

        self.collection.insert_one(item)
        return item
