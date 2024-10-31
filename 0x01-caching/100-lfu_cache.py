#!/usr/bin/env python3
"""
LFU (Least Frequently Used) caching module
A class LFUCache that inherits from BaseCaching and is a caching system:
    - You must use self.cache_data - dictionary from the parent class
    BaseCaching
    - You can overload def __init__(self): but don’t forget to call the
    parent init: super().__init__()
    def put(self, key, item):
        * Must assign to the dictionary self.cache_data the item value
        for the key key.
        * If key or item is None, this method should not do anything.
        * If the number of items in self.cache_data is higher that
        BaseCaching.MAX_ITEMS:
            + you must discard the least frequency used item (LFU algorithm)
            + if you find more than 1 item to discard, you must use the LRU
            algorithm to discard only the least recently used
            + you must print DISCARD: with the key discarded and following by a
            new line
    - def get(self, key):
        * Must return the value in self.cache_data linked to key.
        * If key is None or if the key doesn’t exist in self.cache_data,
        return None.
"""
from base_caching import BaseCaching
from collections import defaultdict


class LFUCache(BaseCaching):
    """
    LFUCache defines a Least Frequently Used caching system
    If frequency is tied, uses LRU as a tiebreaker
    """

    def __init__(self):
        """
        Initialize the cache with parent's init method
        and set up tracking for frequency and usage order
        """
        super().__init__()
        # Track frequency of each key
        self.frequency = defaultdict(int)
        # Track the order of last use for each key
        self.use_order = []

    def put(self, key, item):
        """
        Add an item in the cache using LFU algorithm.
        If there's a frequency tie, uses LRU for tiebreaking.
        Args:
            key: key value to identify the item
            item: item to be stored
        """
        if key is None or item is None:
            return

        # If key exists, update value and increase frequency
        if key in self.cache_data:
            self.cache_data[key] = item
            self.frequency[key] += 1
            # Update use order
            self.use_order.remove(key)
            self.use_order.append(key)
            return

        # If cache is full, remove item
        if len(self.cache_data) >= self.MAX_ITEMS:
            min_freq = min(self.frequency.values()) if self.frequency else 0
            # Get all keys with minimum frequency
            lfu_keys = [k for k, v in self.frequency.items() if v == min_freq]

            # If multiple keys have same frequency, use LRU
            lru_key = None
            for key_order in self.use_order:
                if key_order in lfu_keys:
                    lru_key = key_order
                    break

            # Remove the selected key
            self.cache_data.pop(lru_key)
            self.frequency.pop(lru_key)
            self.use_order.remove(lru_key)
            print(f"DISCARD: {lru_key}")

        # Add new item
        self.cache_data[key] = item
        self.frequency[key] = 1
        self.use_order.append(key)

    def get(self, key):
        """
        Get an item by key and update frequency and usage
        Args:
            key: key value to identify the item
        Returns:
            value in self.cache_data linked to key
        """
        if key is None or key not in self.cache_data:
            return None

        # Update frequency and use order
        self.frequency[key] += 1
        self.use_order.remove(key)
        self.use_order.append(key)

        return self.cache_data[key]
