from rest_framework import permissions

# 3rd party imports
import requests

VALIDATION_API = "http://carrocompras:8000/carrocompras"

class IsAdmin(permissions.BasePermission):
    """
    En esta clase se definen el permiso de administrador para
    poder acceder a funciones avanzadas del sistema, como:
        - Crear/Eliminar/modificar productos
        - Crear/Eliminar/modificar distribuidores
        - Consultar reportes
    A diferencia del servicio de Carro de compras, la API de productos
    no posee registro de los usuarios por si misma, y por lo tanto, tampoco
    Tokens asociados a los mismos, por lo que debe validar el token recibido
    en los requests contra la API que dispone de los recursos para validarlos,
    es decir, la API de carro de compras
    """
    def has_permission(self, request, view):
        # TODO: Checkear de forma local por permisos previamente guardados
        # Comprobar permisos contra la API capaz de hacerlo
        token = request.headers["Authorization"].split()[1]
        req = requests.post(f"{VALIDATION_API}/validate-token/", data={"key" : token})
        response = req.json()
        if response["is_valid"]:
            return True
        return False
