from scrapy import Item, Field
from scrapy.loader import ItemLoader
from itemloaders.processors import TakeFirst, MapCompose, Join
import re

def clean_text(text):
    return text.strip()

def remove_nbsp(text):
    return text.replace('\xa0', ' ').strip()

class CarItem(Item):
    # titre = Field()
    URL = Field()
    Marque = Field()
    Modèle = Field()
    Prix = Field()
    Etat = Field()
    Sieges = Field()
    Portes = Field()
    Kilométrage = Field()
    Année = Field()
    Puissance = Field()
    Transmission = Field()
    Cylindrée = Field()
    CO2 = Field()
    Carburant = Field()
    Carrosserie = Field()
    Couleur = Field()
   
    
    

class CarItemLoader(ItemLoader):
    default_output_processor = TakeFirst()
    default_input_processor = MapCompose(str.strip, remove_nbsp)
    lieu_out = Join(' ')
