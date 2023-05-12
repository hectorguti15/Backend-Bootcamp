//@ts-check
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.productsList = [];
  }
  async getProducts() {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      return this.productsList;
    } catch (err) {
      console.log(err);
    }
  }
  async getProductById(id) {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      let findProduct = this.productsList.find((product) => product.id == id);
      if (!findProduct) {
        throw new Error("Producto no encontrado");
      }
      return findProduct;
    } catch (err) {
      throw new Error("Error al obtener el producto");
    }
  }
  
  #getId() {
    let id = 0;
    id = this.productsList.length;
    return ++id;
  }
  #checkProduct(product) {
    const verification = Object.values(product).some(
      (value) => value === null || value === undefined || value === ""
    );
    return verification;
  }
  #checkCode(productCode) {
    const verificationCode = this.productsList.some(
      (product) => product.code == productCode
    );
    return verificationCode;
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    this.productsList = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    let product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: this.#getId(),
    };
    if (this.#checkProduct(product)) {
      console.log("Insert the values again by completing all the fields");
      return false;
    } else {
      if (this.#checkCode(product.code)) {
        console.log("Insert another code, please");
      } else {
        this.productsList = [...this.productsList, product];
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.productsList)
        );
        console.log(
          "Updated file: ",
          await fs.promises.readFile(this.path, "utf-8")
        );

        return this.productsList;
      }
    }
  }

  async updateProduct(id, fieldToUpdate) {
    this.productsList = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    const index = this.productsList.findIndex((product) => product.id == id);

    if (Object.keys(fieldToUpdate).some((value) => value == "code")) {
      if (!this.#checkCode(fieldToUpdate.code)) {
        if (index === -1) {
          console.log("Product not found");
          return false;
        }

        const updatedProduct = {
          ...this.productsList[index],
          ...fieldToUpdate,
        };
        this.productsList[index] = updatedProduct;

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.productsList)
        );
        console.log("Updated");
        return true;
      } else {
        console.log("Insert another code");
        return false;
      }
    } else {
      if (index === -1) {
        console.log("Product not found");
        return false;
      }

      const updatedProduct = { ...this.productsList[index], ...fieldToUpdate };
      this.productsList[index] = updatedProduct;
      console.log("Updated");
      await fs.promises.writeFile(this.path, JSON.stringify(this.productsList));
      return true;
    }
  }

  async deleteProduct(id) {
    this.productsList = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    let findProduct = this.productsList.find((product) => product.id == id);
    let indexOfProduct = this.productsList.indexOf(findProduct);
    this.productsList.splice(indexOfProduct, 1);
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.productsList));
      console.log("Product deleted");
    } catch {
      console.log("Error in the process, try again");
    }

    return this.productsList;
  }
}

module.exports = ProductManager;
