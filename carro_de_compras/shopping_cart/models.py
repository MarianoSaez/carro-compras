from django.db import models
from django.contrib.auth.models import AbstractUser

# Usuario(id, nombre, apellido, email, clave, tipo)
# Cliente(id, direccion, telefono)
# Ventas(id, {id_usuario}, fechaVenta, precioTotal)
# ProductosComprados(id, {id_venta}, nombre, descripcion, idProdOrg, precio, cant)
# CarroCompras(id, {id_usuario}, precioTotal)
# ListadoProductos(id, {id_carroCompras}, nombre, descripcion, idProdOrg, precio, cant)

# Create your models here.
class Usuario(AbstractUser):
    # Usuario basico | Administrador
    is_admin = models.BooleanField(default=False)



class Cliente(models.Model):
    direccion = models.CharField(max_length=120, default="N/A")
    telefono = models.IntegerField(default=0)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return self.direccion


class Venta(models.Model):
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now=False, auto_now_add=True)
        
    @property
    def precioTotal(self):
        productos = self.productoscomprados_set.all() 
        return sum([producto.get_subtotal for producto in productos])


class ProductosComprados(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=280)
    # Clave del producto en la base de datos de Productos
    id_venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    id_prodOriginal = models.IntegerField()
    precio = models.FloatField()
    cantidad = models.IntegerField()

    @property
    def get_subtotal(self):
        return self.cantidad * self.precio


class CarroCompras(models.Model):
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    
    @property
    def precioTotal(self):
        productos = self.listadoproductos_set.all() 
        return sum([producto.get_subtotal for producto in productos])


class ListadoProductos(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=280)
    # Clave del producto en la base de datos de Productos
    id_carro = models.ForeignKey(CarroCompras, on_delete=models.CASCADE)
    id_prodOriginal = models.IntegerField()
    precio = models.FloatField()
    cantidad = models.IntegerField()

    def __str__(self):
        return self.nombre
    
    @property
    def get_subtotal(self):
        return self.cantidad * self.precio
        
