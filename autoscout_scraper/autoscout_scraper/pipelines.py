import pymongo

class MongoDBPipeline:
    def open_spider(self, spider):
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.db = self.client["autoscout24_db"]
        self.collection = self.db["annonces"]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.collection.insert_one(dict(item))
        return item