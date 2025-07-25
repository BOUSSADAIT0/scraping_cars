BOT_NAME = 'autoscraper'

SPIDER_MODULES = ['autoscraper.spiders']
NEWSPIDER_MODULE = 'autoscraper.spiders'

ROBOTSTXT_OBEY = False
DOWNLOAD_DELAY = 2
RANDOMIZE_DOWNLOAD_DELAY = True

ITEM_PIPELINES = {
   'autoscraper.pipelines.MongoPipeline': 300,
}

MONGO_URI = 'mongodb://akram:akram@localhost:27017/'
MONGO_DATABASE = 'BON_PLAN'
MONGO_COLLECTION = 'annonces'

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'

CLOSESPIDER_PAGECOUNT = 0       # Ne jamais s'arrêter après N pages (0 = désactivé)
DEPTH_LIMIT = 0                 # Désactive la profondeur max
LOG_LEVEL = 'INFO'              # Pour bien voir les logs que tu as ajoutés

RETRY_ENABLED = True
RETRY_TIMES = 3
