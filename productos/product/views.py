from django.http import response
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .serializers import *
from .models import *
from django.contrib.auth.models import User


# Authentication and Authorization imports
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .permissions import IsAdmin


# Create your views here.

# Esta vista solo implementa el metodo GET dado
# que solo requiere devolver un listado de los productos
# disponibles
class ProductoView(generics.ListAPIView):
    model = Producto
    queryset = Producto.objects.filter(is_active=True)
    serializer_class = ProductoSerializer


# Se recibe la lista de ventas completa y se actualizan
# en tanda todos los productos vendidos
# 
# Carro de compras ->
# {
#   "85" : 3,
#   "63" : 1,
#   "10" : 20, 
# }
# -> Producto


class ProductoVendidoView(generics.GenericAPIView):
    serializer_class = ProductoSerializer

    def get_queryset(self):
        listaProductos = [i for i in self.request.data.keys()]
        # https://docs.djangoproject.com/en/3.2/topics/db/queries/#the-pk-lookup-shortcut
        return Producto.objects.filter(pk__in=listaProductos)

    def get_object(self):
        return self.get_queryset()

    def patch(self, request):
        productosVendidos = self.get_object()
        updateDict = self.request.data
        for producto in productosVendidos:
            data = {
                "cantidadVendido" : int(updateDict[str(producto.pk)]) + int(producto.cantidadVendido)
            }
            serializer = ProductoSerializer(producto, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=500)
        return Response({"msg" : "Sold products have been updated"}, status=200)


class ProductoEspecificoView(generics.ListAPIView):

    serializer_class = ProductoSerializer

    def get(self, request, id):
        
        producto = Producto.objects.get(pk=id)
        serialized = ProductoSerializer(producto).data
        return Response(serialized, status=200)

class AdminProductoView(generics.GenericAPIView):

    permission_classes = [
        IsAdmin,
    ]
    serializer_class = ProductoSerializer
    def get(self, request, pk):
        if pk == 0:
            productos = Producto.objects.all()
            data = [ProductoSerializer(producto).data for producto in productos]
        else:
            producto = Producto.objects.get(pk=pk)
            data = ProductoSerializer(producto).data
        return Response(data, status=200)

    def post(self, request):
        #dist = Distribuidor.objects.get(nombre=request.data['distribuidor'])
        datos = {
            'nombre': request.data['nombre'],
            'descripcion': request.data['descripcion'],
            'precio': request.data['precio'],
            'distribuidor': request.data['distribuidor'],
        }
        serializer = ProductoSerializer(data=datos)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg": "Producto agregado exitosamente",
                "producto": serializer.data
                }, status=200)
        else:
            return Response(serializer.errors, status=500)

    def patch(self, request):
        producto = Producto.objects.get(pk=request.data["id"])
        serializer = ProductoSerializer(producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg" : "Modificacion del producto existosa!",
                "producto" : serializer.data,
                "status" : 200,
            }, status=200)
        return Response({
            "msg" : "Error",
            "log" : serializer.errors,
            "status" : 500,
        }, status=500)

    def delete(self, request):
        try:
            producto = Producto.objects.get(pk=request.data["id"])
            producto.delete()
            return Response({"msg" : "Borrado de producto exitoso!"}, status=200)
        except Exception as e:
            return Response({"msg" : e}, status=500)
# Funcionalidad de administrador
# Lista y ABM de distribuidores en la DB
class AdminDistribuidoresView(generics.GenericAPIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request, pk):
        if pk == 0:
            distribuidores = Distribuidor.objects.all()
            data = [DistribuidorSerializer(distribuidor).data for distribuidor in distribuidores]
        else:
            distribuidor = Distribuidor.objects.get(pk=pk)
            data = DistribuidorSerializer(distribuidor).data
        return Response(data, status=200)

    def post(self, request):
        
        serializer = DistribuidorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            msg = "Distribuidor almacenado con exito!"
            result = serializer.data
            status = 200
        else:
            msg = "Error"
            result = serializer.errors
            status = 500

        return Response({
            "msg" : msg,
            "result" : result,
            "status" : status,
        })

    def patch(self, request):
        distribuidor = Distribuidor.objects.get(pk=request.data["id"])
        serializer = DistribuidorSerializer(distribuidor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            msg = "Distribuidor modificado con exito!"
            result = serializer.data
            status = 200
        else:
            msg = "Error"
            result = serializer.errors
            status = 500

        return Response({
            "msg" : msg,
            "result" : result,
            "status" : status,
        })

    def delete(self, request):
        try:
            distribuidor = Distribuidor.objects.get(pk=request.data["id"])
            distribuidor.delete()
            return Response({"msg" : "Borrado de usuario exitoso!"}, status=200)
        except Exception as e:
            return Response({"msg" : e}, status=500)

class AdminReporteDistribuidores(generics.ListAPIView):

    def get(self, request):
        distribuidores = Distribuidor.objects.all()
        distribuidores = [DistribuidorSerializer(distribuidor).data for distribuidor in distribuidores]
        data = list()

        for i in distribuidores:
            productos = Producto.objects.filter(distribuidor=i['id'])
            productos = [ProductoSerializer(producto).data for producto in productos]

            data.append({
                'distribuidor': i,
                'productos': productos
            })
        return Response(data, status=200)
