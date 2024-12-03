import Inventory from '../../models/Inventory.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';

// Controlador para crear un nuevo pedido
export const createOrder = async (req, res) => {
  try {
    const { supervisorName, branch, products } = req.body;

    if (!supervisorName || !branch || !products || products.length === 0) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Calcular el total del pedido
    let total = 0;
    const detailedProducts = [];

    for (const product of products) {
      const productData = await Product.findOne({ name: product.name });
      if (!productData) {
        return res.status(404).json({ error: `Producto ${product.name} no encontrado` });
      }
      detailedProducts.push({
        name: productData.name,
        quantity: product.quantity,
        price: productData.salePrice,
      });
      total += product.quantity * productData.salePrice;
    }

    // Crear el pedido
    const newOrder = new Order({
      orderNumber: `ORD-${Date.now()}`,
      supervisorName,
      branch,
      products: detailedProducts,
      total,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Pedido creado exitosamente', order: newOrder });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

// Controlador para obtener pedidos por sucursal
export const getOrdersByBranch = async (req, res) => {
  try {
    const { branch } = req.user; // Suponiendo que el branch está en el token del usuario
    const orders = await Order.find({ branch });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Controlador para obtener todos los pedidos (solo para admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Controlador para actualizar el estatus de un pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendiente', 'rechazado', 'aceptado', 'recibido'].includes(status)) {
      return res.status(400).json({ error: 'Estatus inválido' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Actualizar el estatus y la fecha de recepción si es 'recibido'
    order.status = status;
    if (status === 'recibido') {
      order.receptionDate = Date.now();

      // Registrar productos en el inventario de la sucursal
      for (const product of order.products) {
        const existingProduct = await Inventory.findOne({
          branch: order.branch,
          name: product.name,
        });

        if (existingProduct) {
          // Actualizar cantidad y fecha de caducidad si es necesario
          existingProduct.quantity += product.quantity;
          existingProduct.expirationDate = product.expirationDate || existingProduct.expirationDate;
          await existingProduct.save();
        } else {
          // Crear nuevo registro en el inventario
          const newInventoryItem = new Inventory({
            branch: order.branch,
            name: product.name,
            quantity: product.quantity,
            expirationDate: product.expirationDate, // Si la fecha está incluida en el pedido
          });
          await newInventoryItem.save();
        }
      }
    }

    await order.save();
    res.status(200).json({ message: 'Estatus actualizado y productos registrados en inventario', order });
  } catch (error) {
    console.error('Error al actualizar estatus del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar estatus' });
  }
};
