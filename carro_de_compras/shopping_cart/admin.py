from django.contrib import admin
from .models import Usuario, Cliente, Venta, ProductosComprados, CarroCompras, ListadoProductos


# Register your models here.
admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Venta)
admin.site.register(ProductosComprados)
admin.site.register(CarroCompras)
admin.site.register(ListadoProductos)
