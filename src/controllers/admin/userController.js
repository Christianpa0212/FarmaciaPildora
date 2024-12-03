// Importar modelos
import User from '../../models/User.js';
import Branch from '../../models/Branch.js';
import moment from 'moment';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('branch');
    
    // Formatear la fecha de nacimiento
    const formattedUsers = users.map(user => ({
      ...user._doc,
      birthDate: moment(user.birthDate).format('DD MMMM YYYY') // Formato: 31 diciembre 2002
    }));

    const branches = await Branch.find();
    res.render('admin/users', { users: formattedUsers, branches });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    res.status(500).send("Error al cargar usuarios.");
  }
};

// Controlador para obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('branch'); // Busca el usuario por ID y popula la sucursal
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user); // Devuelve el usuario en formato JSON
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



export const createUser = async (req, res) => {
  try {
      const { name, paternal, maternal, email, password, phone, birthDate, role, branch, CLABE } = req.body;
      const picturePath = req.file ? `/img/employees/${req.file.filename}` : "/img/admin/users/pic1.png";

      // Crear un nuevo usuario con el nombre de la sucursal en lugar del ID
      const newUser = new User({
          name,
          paternal,
          maternal,
          email,
          password,
          phone,
          birthDate,
          role,
          branch,
          CLABE,
          picture: picturePath
      });

      await newUser.save();

      res.status(201).json(newUser); // Devuelve el usuario recién creado
  } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(400).json({ error: "Error al crear usuario. Verifique los datos enviados." });
  }
};




// Controlador para actualizar un usuario existente
export const updateUser = async (req, res) => {
  const { name, paternal, maternal, email, phone, role, branch, birthDate, CLABE} = req.body;
  const picturePath = req.file ? `/img/employees/${req.file.filename}` : undefined;

  try {
    if ((role === 'supervisor' || role === 'employee') && !branch) {
      return res.status(400).send("El campo 'branch' es requerido para supervisores y empleados.");
    }

    const updateData = {
      name,
      paternal,
      maternal,
      email,
      phone,
      birthDate,
      role: role === 'admin' ? null : role,
      branch: role === 'admin' ? null : branch,
      CLABE: role === 'admin' ? null : CLABE,
    };

    if (picturePath) updateData.picture = picturePath;

    await User.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/dashboard/users');
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).send("Error al actualizar usuario.");
  }
};

// Controlador para eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard/users');
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).send("Error al eliminar usuario.");
  }
};
