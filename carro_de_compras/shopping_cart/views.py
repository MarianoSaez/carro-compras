from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import *
from .serializers import *

# Authentication and Authorization imports
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .permissions import IsAdmin # Permiso customizado

# Password storage
from django.contrib.auth.hashers import make_password

# Timezone imports
from datetime import datetime
from dateutil.parser import isoparse
from django.utils.timezone import make_aware, make_naive

# 3rd Party imports
import requests

# TODO: LOGIN y LOGOUT
PRODUCT_API_URL = "http://productos:8000/productos/"

# Create your views here.

# Vista para creacion de tokens de usuarios y devolver roles habilitados
class CreateToken(ObtainAuthToken):
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token' : token.key,
            'is_admin' : user.is_admin,
            'is_superuser' : user.is_superuser,
        })

# Funcionalidad gral.
# Valida tokens recibidos por otras API's
class ValidateToken(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        try:
            token = Token.objects.get(key=request.data["key"])
        except Exception as e:
            print(e)
            return Response({"is_valid" : False}, status=500)
        if token.user.is_admin or token.user.is_superuser:
            return Response({"is_valid" : True}, status=200)
        else:
            return Response({"is_valid" : False}, status=403)


class AgregarCarrito(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    model = CarroCompras
    serializer_class = CarrosComprasSerializer

    def post(self, request):
        try:
            # Intentar encontrar el carro de compras
            carro = CarroCompras.objects.get(id_usuario=request.user.pk)
            return Response(CarrosComprasSerializer(carro).data, status=200)
        except:
            # En caso de no encontrarlo se crea uno nuevo
            data = {
                "id_usuario" : request.user.pk,
            }

            serializer = CarrosComprasSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=500)
            return Response(serializer.data, status=200)

 
class AgregarProducto(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    model = ListadoProductos
    serializer_class = ListadoProductosSerializer    

    def post(self, request):
        carro = CarroCompras.objects.get(id_usuario=request.user.pk)    # Encontrar el carrito del user

        datos = {   # Construir entidad para la DB
            'id_carro': carro.pk,
            'nombre': request.data['nombre'],
            'descripcion': request.data['descripcion'],
            'id_prodOriginal': request.data['id_prodOriginal'],
            'precio': request.data['precio'],
            'cantidad': request.data['cantidad'],
        }

        # Checkear si ya existe en el carro o es nuevo (2 del mismo prod.)
        listado = ListadoProductos.objects.filter(id_prodOriginal=datos['id_prodOriginal'], id_carro=datos['id_carro'])
        if listado:
            for i in listado:
                listado.update(cantidad=int(datos['cantidad']) + i.cantidad)
                return Response(status=200)
                
        serializer = ListadoProductosSerializer(data=datos)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=500)


    def get(self, request, pk):
        #id_user = CarroCompras.objects.get(id_usuario = request.user.pk)
    
        carro = CarroCompras.objects.get(id_usuario=pk)
        productos = ListadoProductos.objects.filter(id_carro=carro.pk)
        serialized = [ListadoProductosSerializer(producto).data for producto in productos]
        return Response(serialized, status=200)

# Funcionalidad no. 3
# Lista los productos de la tabla listado productos del carro correspondiente
class ListarProductosCarro(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ListadoProductosSerializer

    def get(self, request):
        #id_user = CarroCompras.objects.get(id_usuario = request.user.pk)
        carro = CarroCompras.objects.get(id_usuario=request.user.pk)
        productos = ListadoProductos.objects.filter(id_carro=carro.pk)
        serialized = [ListadoProductosSerializer(producto).data for producto in productos]
        return Response(serialized, status=200)

# Funcionalidad no. 4
# Modificar lista de productos en el carrito de compra
# NOTE: Decidir si se enviara desde el front solo la lista de editados
#       o si vendra la lista completa.
#       Decidir si se enviara peticiones individuales donde cada una se
#       se corresponda con el metodo HTTP o seguir con esta aproximacion
#       donde se envia todo de una bajo el metodo PATCH.
class ModificarCarroCompras(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get_object(self):
        # Obtener los objectos desde la BD
        # Hay dos aproximaciones posibles:
        #   1. Se conocen los ids de productos y es posible recuperarlos
        #      de la BD - En func. 2 (recuperar lista) se conocen los id
        #   2. Se conoce el id del carro de compras y se realiza una busqueda
        #      por todos los productos que posean una FK para ese id
        listaProductos = [i for i in self.request.data.keys()]
        # https://docs.djangoproject.com/en/3.2/topics/db/queries/#the-pk-lookup-shortcut
        return ListadoProductos.objects.filter(pk__in=listaProductos)
        
    # Para cambios en los input de las cantidades
    def patch(self, request):
        producto = ListadoProductos.objects.get(pk=int(request.data["pk"]))
        nuevaCantidad = int(request.data["cantidad"])        

        producto.cantidad = nuevaCantidad
        producto.save()
        return Response({"msg" : "Actualizado con exito!"}, status=200)

    # Para eliminaciones con el boton "ELIMINAR" de cada fila
    def delete(self, request):
        producto = ListadoProductos.objects.get(pk=request.data["pk"])
        producto.delete()

        return Response({"msg":"Borrado con exito!"}, status=200)


# Funcionalidad No. 5
# Realizar venta - Se recibe del frontend los datos de pago
# se almacenan en la DB de cliente para el usuario que realizo
# la compra. Posteriormente se "mueven" los registros del carro
# a la tabla ProductosVendidos. Por ultimo se envian los datos
# al servicio [PRODUCTOS] con el formato requerido para actualizar
# la estadisticas de ventas.

# Realizar venta : Datos cliente - Se recibe del frontend los datos de pago
# se almacenan en la DB de cliente para el usuario que realizo
# la compra.
class RealizarVentaDatosCliente(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    model = Cliente
    serializer_class = ClientesSerializer

    def post(self, request):
        # Obtener o crear entrada para cliente
        cliente, created = Cliente.objects.get_or_create(
            id_usuario=request.user, 
            direccion=request.data["direccion"],
            telefono=request.data["telefono"],
        )
        
        if created:
            msg = "Nueva informacion de pago"
        else:
            msg = "Se utilizo informacion existente"

        # Crear venta
        venta = Venta.objects.create(id_usuario=request.user, id_cliente=cliente)

        # Obtenemos los productos del carro de compras
        carro = CarroCompras.objects.get(id_usuario=request.user.pk)
        productos = ListadoProductos.objects.filter(id_carro=carro.pk)

        # Los campos son casi identicos
        productosVendidos = list()
        for producto in productos:
            productoComprado = ProductosComprados.objects.create(
                nombre=producto.nombre,
                descripcion=producto.descripcion,
                id_venta=venta,
                id_prodOriginal=producto.id_prodOriginal,
                precio=producto.precio,
                cantidad=producto.cantidad,
            )

        # Se construye el json para actualizar las estadisticas de venta y se envia
        payload = {producto.id_prodOriginal : producto.cantidad for producto in productos}
        requests.patch(f"{PRODUCT_API_URL}vendido/", data=payload)

        return Response({'client-info' : msg, 'products-info' : payload}, status=200)


# Funcionalidad gral.
# Vacia el carro de compras eliminando los productos de la tabla CarroCompras
class VaciarCarroCompras(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        # Obtener el carro de compras
        carro = CarroCompras.objects.get(id_usuario=request.user.pk)

        # Obtener los productos para el carro de compras obtenido
        productos = ListadoProductos.objects.filter(id_carro=carro.pk)

        # Eliminar los productos
        for producto in productos:
            producto.delete()

        return Response(status=200)

# Funcionalidad gral.
# Listar historial de ventas para un usuario determinado
class ListarVentasUsuario(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        # Obtener las ventas del usuario ordenadas por fecha descendente
        user = Usuario.objects.get(pk=request.user.pk)
        ventas = Venta.objects.filter(id_usuario=user).order_by('-fecha')

        # Agregar a la lista para el response
        data = list()
        for venta in ventas:
            data.append({
                "id" : venta.pk,
                "fecha" : venta.fecha,
                "total" : venta.precioTotal,
            })

        return Response(data, status=200)

# Funcionalidad gral.
# Obtener el detalle para una venta en particular
class ListarDetalleVentaUsuario(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, pk):
        # Obtener los productos para la venta del usuario
        venta = Venta.objects.get(pk=int(pk))
        productos = ProductosComprados.objects.filter(id_venta=venta)

        # Agregar productos a la lista para el response
        data = list()
        for producto in productos:
            p = ProductosCompradosSerializer(producto).data
            # p["direccion"] = venta.id_cliente.direccion
            # p["telefono"] = venta.id_cliente.telefono
            data.append(p)

        return Response(data, status=200)

# Funcionalidad gral.
# Obtener y modificar informacion de un usuario para mostrarla en el perfil
class VistaUsuario(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        user = Usuario.objects.get(pk=request.user.pk)
        return Response(UsuariosSerializer(user).data, status=200)

    def patch(self, request):
        user = Usuario.objects.get(pk=request.user.pk)
        serializer = UsuariosSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg' : 'Modificacion exitosa!'}, status=200)
        return Response({'msg' : serializer.errors}, status=500)

# Funcionalidad gral.
# Obtener y modificar informacion de cliente de un usuario
class VistaCliente(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        try:
            client = Cliente.objects.get(id_usuario=request.user)
            return Response(ClientesSerializer(client).data, status=200)
        except Exception as e:
            return Response({"direccion" : "", "telefono" : ""}, status=204)

    def patch(self, request):
        client = Cliente.objects.get(id_usuario=request.user)
        s = ClientesSerializer(client, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response({'msg' : 'Modificacion de cliente exitosa!'}, status=200)
        return Response({'msg' : s.errors}, status=500)



# Funcionalidad de administrador
# Lista y ABM de usuarios en la DB
class AdminUsuariosView(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def get(self, request, pk):
        if pk == 0:
            usuarios = Usuario.objects.all()
            data = [UsuariosSerializer(usuario).data for usuario in usuarios]
        else:
            usuario = Usuario.objects.get(pk=pk)
            data = UsuariosSerializer(usuario).data
        return Response(data, status=200)

    def post(self, request):
        request.data["password"] = make_password(request.data["password"])
        serializer = UsuariosSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            msg = "Usuario creado con exito!"
            result = serializer.data
            status = 200
        else:
            msg = "Error"
            result = serializer.errors
            status = 500

        # Agregarle un carrito de comrpas asociado al usuario
        carro = CarroCompras.objects.create(id_usuario=usuario)

        return Response({"msg" : msg, "usuario" : result, "status" : status})

    def patch(self, request):
        try:
            request.data["password"] = make_password(request.data["password"])
        except KeyError:
            pass
        usuario = Usuario.objects.get(pk=request.data["id"])
        serializer = UsuariosSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "msg" : "Modificacion de usuario existosa!",
                "usuario" : serializer.data,
                "status" : 200,
            }, status=200)
        return Response({
            "msg" : "Error",
            "log" : serializer.errors,
            "status" : 500,
        }, status=500)

    def delete(self, request):
        try:
            usuario = Usuario.objects.get(pk=request.data["id"])
            usuario.delete()
            return Response({"msg" : "Borrado de usuario exitoso!"}, status=200)
        except Exception as e:
            return Response({"msg" : e}, status=500)

# Funcionalidad de administrador
# Listar ventas y sus detalles
class AdminReporteVentas(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def get(self, request, pk, lowerDate, upperDate):
        # No aplicar filtros y devolver todo
        if lowerDate and upperDate == "0":
            ventas = Venta.objects.all().order_by('-fecha')

        # Aplicar filtros
        else:
            awareLowerDate = (isoparse(lowerDate))
            awareUpperDate = (isoparse(upperDate))
            ventas = Venta.objects.filter(fecha__range=[(awareLowerDate), (awareUpperDate)]).order_by('-fecha')

        data = list()
        for venta in ventas:
            data.append({
                "id" : venta.pk,
                "username" : venta.id_usuario.username,
                "first_name" : venta.id_usuario.first_name,
                "last_name" : venta.id_usuario.last_name,
                "direccion" : venta.id_cliente.direccion,
                "telefono" : venta.id_cliente.telefono,
                "fecha" : venta.fecha,
                "total" : venta.precioTotal,
            })

        return Response(data, status=200)


# Funcionalidad de administrador
# Listar clientes y ver sus ventas asociadas
class AdminReporteClientes(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def get(self, request):
        clientes = Cliente.objects.all()
        data = list()
        for cliente in clientes:
            data.append({
                "id" : cliente.pk,
                "username" : cliente.id_usuario.username,
                "first_name" : cliente.id_usuario.first_name,
                "last_name" : cliente.id_usuario.last_name,
                "direccion" : cliente.direccion,
                "telefono" : cliente.telefono,
            })

        return Response(data, status=200)


class AdminReporteClientesVentas(generics.GenericAPIView):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def get(self, request, pk, lowerDate, upperDate):
        cliente = Cliente.objects.get(pk=pk)
        usuario = cliente.id_usuario

        if lowerDate and upperDate == "0":
            ventas = usuario.venta_set.all().order_by("-fecha")
        else:
            awareLowerDate = (isoparse(lowerDate))
            awareUpperDate = (isoparse(upperDate))
            ventas = usuario.venta_set.filter(fecha__range=[(awareLowerDate), (awareUpperDate)]).order_by('-fecha') 

        data = list()
        for venta in ventas:
            data.append({
                "id" : venta.pk,
                "username" : usuario.username,
                "first_name" : usuario.first_name,
                "last_name" : usuario.last_name,
                "direccion" : cliente.direccion,
                "telefono" : cliente.telefono,
                "fecha" : venta.fecha,
                "total" : venta.precioTotal,
            })

        return Response(data, status=200)