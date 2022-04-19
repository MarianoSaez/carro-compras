from rest_framework import serializers
from .models import Usuario, Cliente, ProductosComprados, Venta, CarroCompras, ListadoProductos


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class ProductosCompradosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductosComprados
        fields = '__all__'

class VentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'

class CarrosComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarroCompras
        fields = '__all__'

class ListadoProductosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListadoProductos
        fields = '__all__'