import Inventory from '../../models/Inventory.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import PDFDocument from 'pdfkit';

export const renderAdminOrdersPage = async (req, res) => {
  try {
      const orders = await Order.find(); // Obtiene todos los pedidos
      res.render('admin/adminOrders', { orders }); // Renderiza la vista 'orders.hbs' con los datos
  } catch (error) {
      console.error('Error al renderizar la página de pedidos:', error);
      res.status(500).send('Error al cargar la página de pedidos');
  }
};

// Renderizar la página de creación de pedido
export const renderCreateOrderPage = async (req, res) => {
  try {
    const { user } = req; // Usuario autenticado
    const products = await Product.find({}, 'name purchasePrice'); // Obtener solo nombre y precio

    res.render('supervisor/createOrder', {
      generatedOrderNumber: `ORD-${Date.now()}`, // Generar número único de pedido
      supervisorName: `${user.name} ${user.paternal}`, // Nombre completo
      branch: user.branch, // Sucursal
      products, // Productos disponibles
    });
  } catch (error) {
    console.error('Error al renderizar la página de creación de pedido:', error);
    res.status(500).send('Error al cargar la página de creación de pedido');
  }
};


// Controlador para procesar la creación del pedido
export const createOrder = async (req, res) => {
  try {
      const { supervisorName, branch, products } = req.body;

      if (!supervisorName || !branch || !products) {
          return res.status(400).json({ error: 'Todos los campos son requeridos.' });
      }

      const parsedProducts = JSON.parse(products); // Parsear el JSON enviado desde el formulario

      if (parsedProducts.length === 0) {
          return res.status(400).json({ error: 'Debes añadir al menos un producto.' });
      }

      let total = 0;
      const detailedProducts = [];

      for (const product of parsedProducts) {
          const productData = await Product.findById(product.id);
          if (!productData) {
              return res.status(404).json({ error: `Producto ${product.name} no encontrado.` });
          }

          detailedProducts.push({
              name: productData.name,
              quantity: product.quantity,
              price: productData.purchasePrice,
          });

          total += product.quantity * productData.purchasePrice;
      }

      const newOrder = new Order({
          orderNumber: `ORD-${Date.now()}`,
          supervisorName,
          branch,
          products: detailedProducts,
          total,
          status: 'pendiente',
      });

      await newOrder.save();
      res.redirect('/supervisor/dashboard/orders');
  } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({ error: 'Error al crear pedido.' });
  }
};



// Obtener pedidos por sucursal (Supervisor)
export const getOrdersByBranch = async (req) => {
  try {
      const { branch } = req.user;
      const orders = await Order.find({ branch });
      return orders; // Devuelve los datos en lugar de enviar una respuesta.
  } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw new Error('Error al obtener pedidos'); // Lanza un error en lugar de manejarlo aquí.
  }
};


// Obtener detalles de un pedido para supervisor
export const getOrderDetailsForSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch } = req.user; // Suponiendo que la sucursal está asociada al usuario

    const order = await Order.findOne({ _id: id, branch });

    if (!order) {
      return res.status(404).render('supervisor/orderDetails', { error: 'Pedido no encontrado o no pertenece a su sucursal.' });
    }

    res.render('supervisor/orderDetails', { order });
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    res.status(500).render('supervisor/orderDetails', { error: 'Error al obtener detalles del pedido.' });
  }
};



// Marcar pedido como recibido (Supervisor)
export const markOrderAsReceived = async (req, res) => {
  try {
    const { id } = req.params;
    const { products } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).render('supervisor/orderDetails', { error: 'Pedido no encontrado' });
    }

    if (order.status !== 'aceptado') {
      return res.status(400).render('supervisor/orderDetails', { error: 'Solo los pedidos aceptados pueden ser marcados como recibidos' });
    }

    order.status = 'recibido';
    order.receptionDate = Date.now();

    for (const product of products) {
      const orderProduct = order.products.find((p) => p.name === product.name);

      if (!orderProduct) {
        return res.status(400).render('supervisor/orderDetails', { error: `Producto ${product.name} no encontrado en el pedido` });
      }

      if (!product.expirationDate) {
        return res.status(400).render('supervisor/orderDetails', { error: `La fecha de caducidad es requerida para el producto ${product.name}` });
      }

      // Verificar si existe un producto con la misma sucursal, nombre y fecha de vencimiento
      const existingProduct = await Inventory.findOne({
        branch: order.branch,
        name: product.name,
        expirationDate: new Date(product.expirationDate),
      });

      if (existingProduct) {
        // Actualizar solo la cantidad
        existingProduct.quantity += orderProduct.quantity;
        await existingProduct.save();
      } else {
        // Crear un nuevo registro si no existe
        const newInventoryItem = new Inventory({
          branch: order.branch,
          name: product.name,
          quantity: orderProduct.quantity,
          expirationDate: new Date(product.expirationDate),
        });
        await newInventoryItem.save();
      }
    }

    await order.save();
    res.redirect('/supervisor/dashboard/orders');
  } catch (error) {
    console.error('Error al marcar pedido como recibido:', error);
    res.status(500).render('supervisor/orderDetails', { error: 'Error al marcar pedido como recibido' });
  }
};


/** -------------------- Controladores para Admin -------------------- **/

// Obtener todos los pedidos (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Ver detalles de un pedido específico (Admin)
export const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.render('admin/orderdetails', { order });
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    res.status(500).json({ error: 'Error al obtener detalles del pedido' });
  }
};

// Actualizar el estatus de un pedido (Admin)
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

    order.status = status;

    if (status === 'recibido') {
      order.receptionDate = Date.now();
    }

    await order.save();
    res.redirect('/admin/dashboard/orders');
  } catch (error) {
    console.error('Error al actualizar estatus del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar estatus del pedido' });
  }
};

export const generateOrderPDF = async (req, res) => {
  try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
          return res.status(404).send('Pedido no encontrado');
      }

      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=pedido-${order.orderNumber}.pdf`);

      doc.text(`Número de Pedido: ${order.orderNumber}`);
      doc.text(`Supervisor: ${order.supervisorName}`);
      doc.text(`Sucursal: ${order.branch}`);
      doc.text(`Total: $${order.total}`);
      doc.text(`Estatus: ${order.status}`);
      doc.text(`Fecha de Creación: ${order.creationDate.toDateString()}`);
      doc.text(`Fecha de Recepción: ${order.receptionDate ? order.receptionDate.toDateString() : 'Pendiente'}`);
      doc.text('Productos:');
      order.products.forEach((product) => {
          doc.text(`- ${product.name}: ${product.quantity} x $${product.price}`);
      });

      doc.end();
      doc.pipe(res);
  } catch (error) {
      console.error('Error al generar PDF:', error);
      res.status(500).send('Error al generar PDF');
  }
};