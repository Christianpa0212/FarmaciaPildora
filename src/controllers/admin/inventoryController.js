import Inventory from '../../models/Inventory.js';
import Product from '../../models/Product.js';
// Renderizar inventario de una sucursal específica
export const renderBranchInventory = async (req, res, branch) => {
    try {
      // Obtenemos los productos del inventario de la sucursal
      const inventory = await Inventory.find({ branch }).lean();
  
      // Enriquecemos los datos del inventario con detalles del producto
      const inventoryWithDetails = await Promise.all(
        inventory.map(async (item) => {
          const productDetails = await Product.findOne({ name: item.name }).lean();
  
          if (productDetails) {
            return {
              ...item, // Mantiene los datos originales del inventario
              supplier: productDetails.supplier, // Agrega el proveedor
              salePrice: productDetails.salePrice, // Agrega el precio de venta
            };
          }
  
          return item; // Si no encuentra el producto, retorna el inventario básico
        })
      );
  
      // Renderiza la vista con los datos del inventario
      res.render('admin/branchInventory', {
        branch,
        inventory: inventoryWithDetails,
      });
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      res.status(500).send('Error al cargar el inventario.');
    }
  };

  export const renderbyBranchInventory = async (req, res, branch) => {
    try {

        const { branch } = req.user;
      // Obtenemos los productos del inventario de la sucursal
      const inventory = await Inventory.find({ branch }).lean();
  
      // Enriquecemos los datos del inventario con detalles del producto
      const inventoryWithDetails = await Promise.all(
        inventory.map(async (item) => {
          const productDetails = await Product.findOne({ name: item.name }).lean();
  
          if (productDetails) {
            return {
              ...item, // Mantiene los datos originales del inventario
              supplier: productDetails.supplier, // Agrega el proveedor
              salePrice: productDetails.salePrice, // Agrega el precio de venta
            };
          }
  
          return item; // Si no encuentra el producto, retorna el inventario básico
        })
      );
  
      // Renderiza la vista con los datos del inventario
      res.render('admin/branchInventory', {
        branch,
        inventory: inventoryWithDetails,
      });
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      res.status(500).send('Error al cargar el inventario.');
    }
  };