import Sale from '../../models/Sale.js';
import Inventory from '../../models/Inventory.js';
import Product from '../../models/Product.js';
import PDFDocument from 'pdfkit';

// Renderizar la vista de ventas (sales.hbs)
export const renderSalesPage = async (req, res) => {
  try {
    const { branch } = req.user; // Filtrar ventas por sucursal del usuario loggeado
    const sales = await Sale.find({ branch });
    res.render('supervisor/sales', { sales });
  } catch (error) {
    console.error('Error al cargar las ventas:', error);
    res.status(500).send('Error al cargar las ventas');
  }
};

export const renderSalesPageE = async (req, res) => {
  try {
    const { branch } = req.user; // Filtrar ventas por sucursal del usuario loggeado
    const sales = await Sale.find({ branch });
    res.render('employees/sales', { sales });
  } catch (error) {
    console.error('Error al cargar las ventas:', error);
    res.status(500).send('Error al cargar las ventas');
  }
};

// Renderizar la página de creación de venta (createSale.hbs)
export const renderCreateSalePage = async (req, res) => {
  try {
      const { user } = req; // Usuario autenticado
      const inventory = await Inventory.find({ branch: user.branch }); // Filtrar productos por sucursal

      // Construir lista de productos con datos combinados de Inventory y Product
      const products = await Promise.all(
          inventory.map(async (item) => {
              const productDetails = await Product.findOne({ name: item.name }); // Buscar detalles en Product.js
              if (!productDetails) return null; // Ignorar productos no encontrados en Product.js

              return {
                  id: item._id, // ID del inventario
                  name: productDetails.name,
                  supplier: productDetails.supplier,
                  classification: productDetails.classification,
                  salePrice: productDetails.salePrice,
                  quantity: item.quantity, // Del inventario
              };
          })
      );

      // Filtrar productos nulos (aquellos que no existen en Product.js)
      const filteredProducts = products.filter((product) => product !== null);

      res.render('supervisor/createSale', {
          generatedSaleNumber: `SALE-${Date.now()}`, // Número único de venta
          seller: `${user.name} ${user.paternal}`, // Nombre completo
          branch: user.branch, // Sucursal
          products: filteredProducts, // Lista de productos
      });
  } catch (error) {
      console.error('Error al renderizar la página de creación de venta:', error);
      res.status(500).send('Error al cargar la página de creación de venta.');
  }
};

export const renderCreateSalePageE = async (req, res) => {
  try {
      const { user } = req; // Usuario autenticado
      const inventory = await Inventory.find({ branch: user.branch }); // Filtrar productos por sucursal

      // Construir lista de productos con datos combinados de Inventory y Product
      const products = await Promise.all(
          inventory.map(async (item) => {
              const productDetails = await Product.findOne({ name: item.name }); // Buscar detalles en Product.js
              if (!productDetails) return null; // Ignorar productos no encontrados en Product.js

              return {
                  id: item._id, // ID del inventario
                  name: productDetails.name,
                  supplier: productDetails.supplier,
                  classification: productDetails.classification,
                  salePrice: productDetails.salePrice,
                  quantity: item.quantity, // Del inventario
              };
          })
      );

      // Filtrar productos nulos (aquellos que no existen en Product.js)
      const filteredProducts = products.filter((product) => product !== null);

      res.render('employees/createSale', {
          generatedSaleNumber: `SALE-${Date.now()}`, // Número único de venta
          seller: `${user.name} ${user.paternal}`, // Nombre completo
          branch: user.branch, // Sucursal
          products: filteredProducts, // Lista de productos
      });
  } catch (error) {
      console.error('Error al renderizar la página de creación de venta:', error);
      res.status(500).send('Error al cargar la página de creación de venta.');
  }
};


// Crear una nueva venta
export const createSale = async (req, res) => {
  try {
      const { seller, branch, products } = req.body;

      if (!seller || !branch || !products) {
          return res.status(400).json({ error: 'Todos los campos son requeridos.' });
      }

      const parsedProducts = JSON.parse(products); // Parsear los productos enviados desde el formulario

      if (parsedProducts.length === 0) {
          return res.status(400).json({ error: 'Debes añadir al menos un producto.' });
      }

      let total = 0;
      const detailedProducts = [];

      for (const product of parsedProducts) {
          const inventoryItem = await Inventory.findById(product.id);
          if (!inventoryItem || inventoryItem.branch !== branch) {
              return res.status(404).json({ error: `Producto no encontrado en el inventario de la sucursal.` });
          }

          if (inventoryItem.quantity < product.quantity) {
              return res.status(400).json({ error: `Cantidad insuficiente para ${inventoryItem.name}.` });
          }

          // Buscar detalles del producto en Product.js
          const productDetails = await Product.findOne({ name: inventoryItem.name });
          if (!productDetails) {
              return res.status(404).json({ error: `Detalles no encontrados para ${inventoryItem.name}.` });
          }


          // Si el producto es controlado, validar los datos de receta médica
          if (productDetails.classification === 'Medicamento Controlado') {
            if (
              !product.details ||
              !product.details.patientName ||
              !product.details.doctorName ||
              !product.details.medicalLicense ||
              !product.details.doctorNumber ||
              !product.details.expirationDate
            ) {
              return res.status(400).json({
                error: `Faltan datos de receta médica para ${productDetails.name}.`,
              });
            }
          }

          // Registrar los detalles del producto
          const productToAdd = {
              name: productDetails.name,
              quantity: product.quantity,
              price: productDetails.salePrice,
              details: product.details || {},
          };


          detailedProducts.push(productToAdd);
          total += product.quantity * productDetails.salePrice;

          // Descontar del inventario
          inventoryItem.quantity -= product.quantity;
          await inventoryItem.save();
      }

      // Crear la venta
      const newSale = new Sale({
          saleNumber: `SALE-${Date.now()}`,
          seller,
          branch,
          products: detailedProducts,
          total,
      });

      await newSale.save();
      res.redirect('/supervisor/dashboard/sales');
  } catch (error) {
      console.error('Error al crear venta:', error);
      res.status(500).json({ error: 'Error al crear la venta.' });
  }
};

export const createSaleE = async (req, res) => {
  try {
      const { seller, branch, products } = req.body;

      if (!seller || !branch || !products) {
          return res.status(400).json({ error: 'Todos los campos son requeridos.' });
      }

      const parsedProducts = JSON.parse(products); // Parsear los productos enviados desde el formulario

      if (parsedProducts.length === 0) {
          return res.status(400).json({ error: 'Debes añadir al menos un producto.' });
      }

      let total = 0;
      const detailedProducts = [];

      for (const product of parsedProducts) {
          const inventoryItem = await Inventory.findById(product.id);
          if (!inventoryItem || inventoryItem.branch !== branch) {
              return res.status(404).json({ error: `Producto no encontrado en el inventario de la sucursal.` });
          }

          if (inventoryItem.quantity < product.quantity) {
              return res.status(400).json({ error: `Cantidad insuficiente para ${inventoryItem.name}.` });
          }

          // Buscar detalles del producto en Product.js
          const productDetails = await Product.findOne({ name: inventoryItem.name });
          if (!productDetails) {
              return res.status(404).json({ error: `Detalles no encontrados para ${inventoryItem.name}.` });
          }


          // Si el producto es controlado, validar los datos de receta médica
          if (productDetails.classification === 'Medicamento Controlado') {
            if (
              !product.details ||
              !product.details.patientName ||
              !product.details.doctorName ||
              !product.details.medicalLicense ||
              !product.details.doctorNumber ||
              !product.details.expirationDate
            ) {
              return res.status(400).json({
                error: `Faltan datos de receta médica para ${productDetails.name}.`,
              });
            }
          }

          // Registrar los detalles del producto
          const productToAdd = {
              name: productDetails.name,
              quantity: product.quantity,
              price: productDetails.salePrice,
              details: product.details || {},
          };


          detailedProducts.push(productToAdd);
          total += product.quantity * productDetails.salePrice;

          // Descontar del inventario
          inventoryItem.quantity -= product.quantity;
          await inventoryItem.save();
      }

      // Crear la venta
      const newSale = new Sale({
          saleNumber: `SALE-${Date.now()}`,
          seller,
          branch,
          products: detailedProducts,
          total,
      });

      await newSale.save();
      res.redirect('/employees/dashboard/sales');
  } catch (error) {
      console.error('Error al crear venta:', error);
      res.status(500).json({ error: 'Error al crear la venta.' });
  }
};


// Renderizar los detalles de una venta (saleDetails.hbs)
export const renderSaleDetails = async (req, res) => {
  try {
      const { id } = req.params; // Obtén el ID de la venta
      const sale = await Sale.findById(id);

      if (!sale) {
          return res.status(404).render('supervisor/saleDetails', { error: 'Venta no encontrada.' });
      }

      // Renderiza la vista con los datos de la venta
      res.render('supervisor/saledetails', { 
          sale, 
          formatDate: (date) => moment(date).format('DD-MM-YYYY'), // Asegúrate de usar el helper
          calcTotal: (quantity, price) => (quantity * price).toFixed(2), // Para calcular el total
      });
  } catch (error) {
      console.error('Error al obtener detalles de la venta:', error);
      res.status(500).render('supervisor/saleDetails', { error: 'Error al obtener detalles de la venta.' });
  }
};

export const renderSaleDetailsE = async (req, res) => {
  try {
      const { id } = req.params; // Obtén el ID de la venta
      const sale = await Sale.findById(id);

      if (!sale) {
          return res.status(404).render('supervisor/saleDetails', { error: 'Venta no encontrada.' });
      }

      // Renderiza la vista con los datos de la venta
      res.render('employees/saledetails', { 
          sale, 
          formatDate: (date) => moment(date).format('DD-MM-YYYY'), // Asegúrate de usar el helper
          calcTotal: (quantity, price) => (quantity * price).toFixed(2), // Para calcular el total
      });
  } catch (error) {
      console.error('Error al obtener detalles de la venta:', error);
      res.status(500).render('supervisor/saleDetails', { error: 'Error al obtener detalles de la venta.' });
  }
};

// Generar PDF con detalles de la venta
export const generateSalePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).send('Venta no encontrada');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=venta-${sale.saleNumber}.pdf`);

    doc.text(`Número de Venta: ${sale.saleNumber}`);
    doc.text(`Vendedor: ${sale.seller}`);
    doc.text(`Sucursal: ${sale.branch}`);
    doc.text(`Total: $${sale.total}`);
    doc.text(`Fecha de Creación: ${sale.creationDate.toDateString()}`);
    doc.text('Productos:');
    sale.products.forEach((product) => {
      doc.text(`- ${product.name}: ${product.quantity} x $${product.price}`);
      if (product.details) {
        doc.text(`  Detalles del Medicamento Controlado:`);
        doc.text(`    Paciente: ${product.details.patientName}`);
        doc.text(`    Médico: ${product.details.doctorName}`);
        doc.text(`    Número de Médico: ${product.details.doctorNumber}`);
        doc.text(`    Cédula Médica: ${product.details.medicalLicense}`);
      }
    });

    doc.end();
    doc.pipe(res);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
};

export const renderBranchSales = async (req, res, branch) => {
  try {
    // Filtrar ventas por sucursal
    const sales = await Sale.find({ branch }).lean();

    // Agregar detalles de productos si es necesario
    const salesWithDetails = sales.map((sale) => ({
      ...sale,
      products: sale.products.map((product) => ({
        ...product,
        // Aquí puedes añadir más lógica para agregar detalles adicionales si los necesitas
      })),
    }));

    // Renderizar la vista
    res.render('admin/branchSales', {
      branch,
      sales: salesWithDetails,
    });
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).send('Error al cargar las ventas.');
  }
};
