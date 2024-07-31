#!/usr/bin/yarn dev
import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Create an array listProducts containing the list of the following products:
 * 	- Id: 1, name: Suitcase 250, price: 50, stock: 4
 * 	- Id: 2, name: Suitcase 450, price: 100, stock: 10
 * 	- Id: 3, name: Suitcase 650, price: 350, stock: 2
 * 	- Id: 4, name: Suitcase 1050, price: 550, stock: 5
 */
const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5
  },
];

/**
 * Create a function named getItemById:
 * 	- It will take id as argument
 * 	- It will return the item from listProducts with the same id
 */
const getItemById = (id) => {
  const item = listProducts.find(obj => obj.itemId === id);

  if (item) {
    return Object.fromEntries(Object.entries(item));
  }
};

/**
 * Create an express server listening on the port 1245.
 * (You will start it via: npm run dev 9-stock.js)
 */
const app = express();
const client = createClient();
const PORT = 1245;

/**
 * Write a function reserveStockById that will take itemId and stock as
 * arguments:
 * 	- It will set in Redis the stock for the key item.ITEM_ID
 */
const reserveStockById = async (itemId, stock) => {
  return promisify(client.SET).bind(client)(`item.${itemId}`, stock);
};

/**
 * Write an async function getCurrentReservedStockById, that will take itemId
 * as an argument:
 * 	- It will return the reserved stock for a specific item
 */
const getCurrentReservedStockById = async (itemId) => {
  return promisify(client.GET).bind(client)(`item.${itemId}`);
};

/**
 * Create the route GET /list_products that will return the list of every
 * available product with the following JSON format:
 */
app.get('/list_products', (_, res) => {
  res.json(listProducts);
});

/**
 * Create the route GET /list_products/:itemId, that will return the current
 * product and the current available stock (by using
 * getCurrentReservedStockById) with the following JSON format:
 */
app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      productItem.currentQuantity = productItem.initialAvailableQuantity - reservedStock;
      res.json(productItem);
    });
});

/**
 * Create the route GET /reserve_product/:itemId:
 * 	- If the item does not exist, it should return: Product not found
 *	- If the item exists, it should check that there is at least one stock
 *	available. If not it should return: Not enough stock available
 *	- If there is enough stock available, it should reserve one item
 *	(by using reserveStockById), and return: Reservation confirmed
 */
app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      if (reservedStock >= productItem.initialAvailableQuantity) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
      }
      reserveStockById(itemId, reservedStock + 1)
        .then(() => {
          res.json({ status: 'Reservation confirmed', itemId });
        });
    });
});

/**
 * Requirements:
 * 	- Make sure to use promisify with Redis
 * 	- Make sure to use the await/async keyword to get the value from Redis
 * 	- Make sure the format returned by the web application is always JSON
 * 	and not text
 */
const resetProductsStock = () => {
  return Promise.all(
    listProducts.map(
      item => promisify(client.SET).bind(client)(`item.${item.itemId}`, 0),
    )
  );
};

app.listen(PORT, () => {
  resetProductsStock()
    .then(() => {
      console.log(`API available on localhost port ${PORT}`);
    });
});

export default app;
