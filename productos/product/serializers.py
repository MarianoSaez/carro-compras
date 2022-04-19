from rest_framework import serializers
from .models import Producto, Distribuidor
from django.contrib.auth.models import User


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio',
            'distribuidor',
            'cantidadVendido',
            'is_active',
        ]


class DistribuidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distribuidor
        fields = [
            'id',
            'nombre',
            'descripcion',
            'is_active',
        ]

class DefaultUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'password',
            'email',
            'is_active',
        ]
