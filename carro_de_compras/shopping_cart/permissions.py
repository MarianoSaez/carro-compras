from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    En esta clase se definen el permiso de administrador para
    poder acceder a funciones avanzadas del sistema, como:
        - Crear/Eliminar/modificar productos
        - Crear/Eliminar/modificar distribuidores
        - Consultar reportes
    """
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        
        if request.user.is_admin:
            return True

        return False