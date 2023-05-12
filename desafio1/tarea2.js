//@ts-check
const fs = require("fs")


class ProductManager{
    constructor(path){
        //path ==> la ruta ("products.json")
        this.path = path;
        const productsString = fs.readFileSync(this.path,"utf-8");
        const productsArray = JSON.parse(productsString);
        this.productsList = productsArray;
    }
    getProducts(){
        console.log(this.productsList);
        return this.productsList;
    }
    getProductById(id){
        const findProduct = this.productsList.find( product => product.id == id);
        return findProduct;
    }
    #getId(){
        let id = 0;
        id = this.productsList.length;
        return ++id;
    }
    #checkProduct(product){
        const verification = Object.values(product).some( value => value === null || value === undefined || value === "");
        return verification;
    }
    #checkCode(productCode){
        const verificationCode = this.productsList.some( item => item.code == productCode );
        return verificationCode;
    }
    async addProduct(title, description, price, thumbnail, code, stock){
        let product = {title, description,  price, thumbnail, code , stock, id: this.#getId()};
        if( this.#checkProduct(product) ){
            console.log("Insert the values again by completing all the fields");
            return false;
        }
        else{
            if(this.#checkCode(product.code)){
                console.log("Insert another code, please");
            }
            else{
                this.productsList = [...this.productsList, product];
                return this.productsList;
            }   
        }
    }
    updateProduct(id,fieldToUpdate){
        //{fieldToUpdate} ==> ejm: {title: a title, price: 20}
        this.productsList.map( product => {
            if( product.id == id){
                return {...product, ...fieldToUpdate};
            }
            else{
                console.log("Product not found ");
                return this.productsList;
            }
        })

    }
    deleteProduct(id){
        let findProduct = this.productsList.find( product => product.id == id);
        let indexOfProduct = this.productsList.indexOf(findProduct);
        this.productsList.splice(indexOfProduct,1);
        return this.productsList;
        
    }
}

const example1 = new ProductManager("products.json")
console.log(example1.getProducts());
example1.addProduct("hola", "prueba", 0, "imagen", "414B", 2)
console.log(example1.getProducts())
example1.updateProduct(1,{})