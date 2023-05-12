//@ts-check

//instalamos express
const express = require("express");
const app = express();
const port = 3000;

//para leer archivos diferentes objetos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ProductManager = require("./productManager");
const productsList = new ProductManager("./data/products.json");

app.get("/products", (req, res) => {
  productsList
    .getProducts()
    .then((result) => {
      if (req.query.limit) {
        let products = result;
        if (products.length >= 1 && products.length >= req.query.limit) {
          let productsLimited = products.filter(
            (product) => product.id <= req.query.limit
          );
          res.status(200).json({
            status: "success",
            msg: "productos encontrados",
            data: productsLimited,
          });
        } else {
          res.status(404).json({
            status: "error",
            msg: "productos no encontrados o el limite es mayor al que hay en la lista",
            data: [],
          });
        }
      } else {
        if (result.length >= 1) {
          res.status(200).json({
            status: "success",
            msg: "productos encontrado",
            data: result,
          });
        } else {
          res.status(201).json({
            status: "success",
            msg: "no hay productos",
            data: result,
          });
        }
      }
    })
    .catch((result) =>
      res.status(404).json({
        status: "error",
        msg: "productos no encontrados",
        data: result,
      })
    );
});

app.get("/products/:pid", (req, res) => {
  let id = req.params.pid;
  productsList.getProductById(id)
    .then((result) => {
      res.status(200).json({
        status: "success",
        msg: "producto encontrado",
        data: result,
      });
    })
    .catch((result) =>
      res.status(404).json({
        status: "error",
        msg: "productos no encontrados",
        data: null,
      })
    );
    
});

app.listen(port, () => {
  console.log(`app is running out on port ${port}`);
});
