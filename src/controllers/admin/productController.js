import Product from '../../models/Product.js';
import Classification from '../../models/Classification.js';
import Supplier from '../../models/Provider.js';

export const renderProductsPage = async (req, res) => {
  try {
    const products = await Product.find(); // Obtiene todos los productos
    const classifications = await Classification.find({}, 'name'); // Obtiene solo el campo 'name'
    const suppliers = await Supplier.find({}, 'name'); // Obtiene solo el campo 'name'

    res.render('admin/products', { 
      products, 
      classifications, 
      suppliers 
    }); // Renderiza la vista con los datos
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error al cargar la página de productos.');
  }
};

export const renderEditProductPage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Busca el producto por ID
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('admin/editProduct', { product }); // Renderiza la vista de edición
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error);
    res.status(500).send('Error interno al cargar el formulario de edición');
  }
};


// Obtener todos los productos (para APIs o JSON)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Obtiene todos los productos
    res.status(200).json(products); // Responde con los productos en formato JSON
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos." });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Busca el producto por ID
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.status(200).json(product); // Devuelve el producto como JSON
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener el producto." });
  }
};

// Crear un producto
export const createProduct = async (req, res) => {
  try {
    const { name, classification, supplier, purchasePrice, salePrice } = req.body;

    // Validar que todos los campos estén presentes
    if (!name || !classification || !supplier || !purchasePrice || !salePrice) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    // Crear el producto
    const newProduct = new Product({
      name,
      classification,
      supplier,
      purchasePrice,
      salePrice,
    });

    await newProduct.save();
    res.redirect('/admin/dashboard/inventory/products'); // Redirige a la página de productos
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(400).send("Error al crear el producto.");
  }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
  try {
    const { name, classification, supplier, purchasePrice, salePrice } = req.body;

    // Actualizar el producto
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, classification, supplier, purchasePrice, salePrice },
      { new: true } // Devuelve el producto actualizado
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado para actualizar." });
    }

    res.redirect('/admin/dashboard/inventory/products'); // Redirige a la página de productos
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(400).send("Error al actualizar el producto.");
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id); // Elimina el producto por ID
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.redirect('/admin/dashboard/inventory/products');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error interno al eliminar el producto');
  }
};

