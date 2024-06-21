#!/usr/bin/env python3
"""
Function named index_range that takes two integer arguments page and page_size.
The function should return a tuple of size two containing a start index and an
end index corresponding to the range of indexes to return in a list for those
particular pagination parameters.
Page numbers are 1-indexed, i.e. the first page is page 1.
"""
import csv
import math
from typing import List


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Retrieve a page of the dataset.
        """
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0
        start_index, end_index = index_range(page, page_size)
        dataset = self.dataset()
        if start_index >= len(dataset):
            return []
        return dataset[start_index:end_index]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """
        Retrieve a dictionary with pagination details.
        """
        dataset_page = self.get_page(page, page_size)
        total_items = len(self.dataset())
        total_pages = math.ceil(total_items / page_size)

        hyper = {
            'page_size': len(dataset_page),
            'page': page,
            'data': dataset_page,
            'next_page': page + 1 if (page + 1) * page_size <= total_items else None,  # noqa
            'prev_page': page - 1 if page > 1 else None,
            'total_pages': total_pages
        }
        return hyper


def index_range(page: int, page_size: int) -> tuple:
    """
    Calculate the start and end index for pagination.
    """
    end_index = page * page_size
    start_index = end_index - page_size
    return (start_index, end_index)
