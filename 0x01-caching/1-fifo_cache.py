#!/usr/bin/env python3
"""
a class BasicCache that inherits from BaseCaching and is a caching system:

You must use self.cache_data - dictionary from the parent class BaseCaching
This caching system doesn’t have limit
def put(self, key, item):
Must assign to the dictionary self.cache_data the item value for the key key.
If key or item is None, this method should not do anything.
def get(self, key):
Must return the value in self.cache_data linked to key.
If key is None or if the key doesn’t exist in self.cache_data, return None.
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    FIFO Cache Class.
    """
    def __init__(self):
        """
        Initialize the FIFO cache.
        """
        super().__init__()

    def put(self, key, item):
        """
        Add an item to the cache using FIFO algorithm.
        """
        if key is not None and item is not None:
            if len(self.cache_data) >= self.MAX_ITEMS:
                oldest_key = next(iter(self.cache_data))
                print("DISCARD:", oldest_key)
                del self.cache_data[oldest_key]
            self.cache_data[key] = item

    def get(self, key):
        """
        Get an item from the cache.
        """
        return self.cache_data.get(key)
