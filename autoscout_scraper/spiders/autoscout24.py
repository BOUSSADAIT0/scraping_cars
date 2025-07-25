import scrapy
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import json

class Autoscout24Spider(scrapy.Spider):
    name = "autoscout24"
    allowed_domains = ["autoscout24.fr"]
    
    # Charger le JSON des marques et modèles
    with open('car_models.json', 'r') as f:
        car_data = json.load(f)
    
    def start_requests(self):
        # Générer les URLs pour chaque marque et modèle
        for brand, data in self.car_data.items():
            for model in data['models']:
                # Nettoyer le nom du modèle pour l'URL (remplacer espaces par tirets, etc.)
                brand_clean = brand.lower().replace(' ', '-')
                model_clean = model.lower().replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '')
                url = f"https://www.autoscout24.fr/lst/{brand_clean}/{model_clean}?sort=standard&desc=0&ustate=N,U&atype=C&cy=F&page=1"
                yield scrapy.Request(url, callback=self.parse, meta={'brand': brand, 'model': model, 'page': 1})

    def parse(self, response):
        brand = response.meta['brand']
        model = response.meta['model']
        current_page = response.meta['page']

        # Extraction des URLs d'annonces et suivi pour extraction des détails
        for idx, car in enumerate(response.css('article'), start=1):
            url = car.css('a.ListItem_title__ndA4s::attr(href)').get()
            if url:
                yield response.follow(url, self.parse_car, cb_kwargs={'position_page': idx, 'brand': brand, 'model': model})

        # Vérifier la pagination
        next_page = response.css('a[aria-label="Aller à la page suivante"]::attr(href)').get()
        if next_page and current_page < 20:  # Limite à 20 pages
            yield response.follow(next_page, self.parse, meta={'brand': brand, 'model': model, 'page': current_page + 1})
        else:
            # Fallback : pagination manuelle
            parsed = urlparse(response.url)
            qs = parse_qs(parsed.query)
            if 'page' in qs:
                try:
                    current_page = int(qs['page'][0])
                except Exception:
                    current_page = 1
            if current_page < 20:  # Limite à 20 pages
                next_page_num = current_page + 1
                qs['page'] = [str(next_page_num)]
                next_query = urlencode(qs, doseq=True)
                next_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, '', next_query, ''))
                yield scrapy.Request(next_url, callback=self.parse, meta={'brand': brand, 'model': model, 'page': next_page_num})

    def parse_car(self, response, position_page=None, brand=None, model=None):
        def extract_dt(label):
            for dt in response.css('dt.DataGrid_defaultDtStyle__soJ6R'):
                if dt.xpath('normalize-space(text())').get('').strip().lower() == label.lower():
                    dd = dt.xpath('following-sibling::dd[1]/text()').get()
                    return dd.strip() if dd else ''
            return response.xpath(f"//dt[contains(text(), '{label}')]/following-sibling::dd[1]/text()").get(default='').strip()

        def extract_first(*args):
            for selector in args:
                val = response.css(selector).get()
                if val:
                    return val.strip()
            return ''

        yield {
            'URL': response.url,
            'Marque': brand or extract_first('span.StageTitle_makeModelContainer__ span::text'),
            'Modèle': model or extract_first('div.StageTitle_modelVersion__::text'),
            'Prix': extract_first('div.PriceInfo_price__XU0aF::text', 'div.PriceInfo_price__Yxk2Y::text', 'div.PriceInfo_price__pZq9J::text'),
            'Carrosserie': extract_dt('Carrosserie'),
            'Etat': extract_dt('État'),
            'Sieges': extract_dt('Sièges'),
            'Portes': extract_dt('Portes'),
            'Annonce ID': extract_dt("N° d'annonce"),
            'Garantie': extract_dt('Garantie'),
            'Kilometrage': extract_first('span.CarDetailsList_itemValue__q6r1H::text', 'span[data-item-name="mileage"]::text'),
            'Annee': extract_dt('Année') or extract_dt('Première immatriculation'),
            'Puissance': extract_dt('Puissance kW (CH)'),
            'Transmission': extract_dt('Transmission') or extract_dt('Boîte de vitesses'),
            'Cylindree': extract_dt('Cylindrée'),
            'Carburant': extract_dt('Carburant') or extract_dt('Type de carburant'),
            'CO2': extract_dt('Émissions de CO2') or extract_dt('Émission de CO₂'),
            'Couleur originale': extract_dt('Couleur originale') or extract_dt('Couleur'),
            'Type peinture': extract_dt('Type de peinture'),
            'Couleur interieur': extract_dt("La couleur de l'intérieur"),
            'position_page': position_page
        }