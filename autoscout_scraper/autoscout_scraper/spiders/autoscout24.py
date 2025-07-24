import scrapy
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from scrapy.exceptions import CloseSpider

class Autoscout24Spider(scrapy.Spider):
    name = "autoscout24"
    allowed_domains = ["autoscout24.fr"]
    start_urls = [
        "https://www.autoscout24.fr/lst?sort=standard&desc=0&ustate=N,U&atype=C&cy=F&cat=&source=homepage_search-mask&page=1"
    ]

  
class Autoscout24Spider(scrapy.Spider):
    name = "autoscout24"
    allowed_domains = ["autoscout24.fr"]
    start_urls = [
        "https://www.autoscout24.fr/lst?sort=standard&desc=0&ustate=N,U&atype=C&cy=F&cat=&source=homepage_search-mask&page=1"
    ]

    def parse(self, response):
        # Extraction des URLs d'annonces et suivi pour extraction des détails
        found = False
        for idx, car in enumerate(response.css('article'), start=1):
            url = car.css('a.ListItem_title__ndA4s::attr(href)').get()
            if url:
                found = True
                yield response.follow(url, self.parse_car, cb_kwargs={'position_page': idx})

        if not found:
            self.logger.info("Aucune annonce trouvée sur la page, arrêt du spider.")
            raise CloseSpider('no_items_found')

        # Pagination dynamique : tant qu'il y a une page suivante, continuer
        next_page = response.css('a[aria-label="Aller à la page suivante"]::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
        else:
            # Fallback : pagination manuelle si le bouton n'est pas un <a>
            current_page = None
            parsed = urlparse(response.url)
            qs = parse_qs(parsed.query)
            if 'page' in qs:
                try:
                    current_page = int(qs['page'][0])
                except Exception:
                    pass
            if current_page:
                next_page_num = current_page + 1
                qs['page'] = [str(next_page_num)]
                next_query = urlencode(qs, doseq=True)
                next_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, '', next_query, ''))
                yield scrapy.Request(next_url, callback=self.parse)

    def parse_car(self, response, position_page=None):
        def extract_dt(label):
            # Cherche le dt correspondant au label, puis récupère le dd suivant
            for dt in response.css('dt.DataGrid_defaultDtStyle__soJ6R'):
                label_text = dt.xpath('normalize-space()').get(default='').strip().lower()
                if label_text == label.lower():
                    dd = dt.xpath('following-sibling::dd[1]/text()').get()
                    return dd.strip() if dd else ''
            # Fallback XPath
            return response.xpath(f'//dt[contains(text(), "{label}")]/following-sibling::dd[1]/text()').get(default='').strip()


        # def extract_first(*args):
        #     for selector in args:
        #         val = response.css(selector).get()
        #         if val:
        #             return val.strip()
        #     return ''
        def extract_first(selector):
            val = response.css(selector).get()
            return val.strip() if val else None


        yield {
            'URL': response.url,
            'Marque': extract_first('span.StageTitle_boldClassifiedInfo__sQb0l::text'),
            'Modèle': extract_first('div.StageTitle_modelVersion__Yof2Z::text'),
            'Prix': extract_first('span.PriceInfo_price__XU0aF *::text'),
            'Carrosserie': extract_dt('Carrosserie'),
            'Etat': extract_dt('État'),
            'Sieges': extract_dt('Sièges'),
            'Portes': extract_dt('Portes'),
            'Annonce ID': extract_dt("N° d'annonce"),
            'Garantie': extract_dt('Garantie'),
            'Kilometrage': response.xpath('//div[contains(text(), "km")]/text()').get(default='').strip(),
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
