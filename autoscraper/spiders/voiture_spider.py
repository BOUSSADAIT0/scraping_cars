#from urllib import response
import scrapy
from autoscraper.items import CarItem
import logging
from autoscraper.items import CarItem, CarItemLoader
import re

def extract_marque_modele(titre):
    if not titre:
        return "", ""
    # Découper le titre par espace
    parts = titre.split()
    if len(parts) >= 2:
        Marque = parts[0]
        Modèle = parts[1]
        return Marque, Modèle
    return "", ""


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('scrapy.middlewares')

class VoitureSpider(scrapy.Spider):
    name = "voiture"
    allowed_domains = ["automobile.fr"]
    #start_urls = ["https://www.automobile.fr/catégorie/voiture/vhc:car,dmg:false"]

    def start_requests(self):
        base_url = "https://www.automobile.fr/catégorie/voiture/vhc:car,dmg:false,pgn:{page},pgs:20"
        for page in range(1, 50):  
            url = base_url.format(page=page)
            yield scrapy.Request(url, callback=self.parse)



    def parse(self, response):
        for article in response.css('article.list-entry'):
            relative_url = article.css('a::attr(href)').get()
            if relative_url:
                url = response.urljoin(relative_url)
                yield response.follow(url, callback=self.parse_car)
        
        logger.info(f"Analyse de la page : {response.url}")
        logger.info(f"Nombre d'articles trouvés : {len(response.css('article.list-entry'))}")



    def parse_car(self, response):
        loader = CarItemLoader(item=CarItem(), response=response)
       
        #loader.add_value('titre', titre)

        # Extraire marque et modèle
        titre = response.css('h1::text').get()
        Marque, Modèle = extract_marque_modele(titre)
        loader.add_value('Marque', Marque)
        loader.add_value('Modèle', Modèle)
        loader.add_css('Etat', 'div.attributes-box > div:nth-child(1) p::text')
        loader.add_css('Prix', 'div.header-price-box p::text')
        loader.add_css('Kilométrage', 'div.attributes-box > div:nth-child(6) span:nth-of-type(2)::text')
        loader.add_css('Année', 'div.attributes-box > div:nth-child(3) span:nth-of-type(2)::text')
        loader.add_css('Transmission', 'div.attributes-box > div:nth-child(4) span:nth-of-type(2)::text')
        loader.add_css('Carburant', 'div.attributes-box > div:nth-child(5) span:nth-of-type(2)::text')
        loader.add_css('Puissance', 'div.attributes-box > div:nth-child(7) span:nth-of-type(2)::text')
        loader.add_xpath('Carrosserie', '//div[@class="further-tec-data g-col-12"]/div[span[contains(text(), "Carrosserie")]]/span[2]/text()')
        loader.add_xpath('Cylindrée', '//div[@class="further-tec-data g-col-12"]/div[span[contains(text(), "Cylindrée")]]/span[2]/text()')
        loader.add_xpath('Sieges', '//div[@class="further-tec-data g-col-12"]/div[span[contains(text(), "Nombre de places")]]/span[2]/text()')
        loader.add_xpath('Portes', '//div[@class="further-tec-data g-col-12"]/div[span[contains(text(), "Nombre de portes")]]/span[2]/text()')
        loader.add_xpath('Couleur', '//div[@class="further-tec-data g-col-12"]/div[span[contains(text(), "Couleur")]]/span[2]/text()')
        loader.add_xpath('CO2', '//div[@class="further-tec-data g-col-12"]/div[span[contains(text(), "CO")]]/span[2]/text()')

        # addr = response.css('div.seller-box div p:nth-of-type(3)::text').getall()
        # loader.add_value('lieu', addr)

        loader.add_value('URL', response.url)

        item = loader.load_item()


        yield item

