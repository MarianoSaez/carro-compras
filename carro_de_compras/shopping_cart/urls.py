from django.urls import path, include
from .views import *
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('get-token/', CreateToken.as_view()),
    path('validate-token/', ValidateToken.as_view()),
    path('review/', ModificarCarroCompras.as_view()),
    path('payment-info/', RealizarVentaDatosCliente.as_view()),
    path('add-product/', AgregarProducto.as_view()),
    path('add-shopping-cart/', AgregarCarrito.as_view()),
    path('list-shopping-cart/', ListarProductosCarro.as_view()),
    path('clear-shopping-cart/', VaciarCarroCompras.as_view()),
    path('user-profile/', VistaUsuario.as_view()),
    path('client-profile/', VistaCliente.as_view()),
    path('user-sellings/', ListarVentasUsuario.as_view()),
    path('user-selling-detail/<int:pk>', ListarDetalleVentaUsuario.as_view()),
    path('admin/<int:pk>', AdminUsuariosView.as_view()),
    path('admin/', AdminUsuariosView.as_view()),
    path('sellings-report/<int:pk>/<lowerDate>&<upperDate>', AdminReporteVentas.as_view()),
    path('clients-report/', AdminReporteClientes.as_view()),
    path('clients-report/sellings/<int:pk>/<lowerDate>&<upperDate>', AdminReporteClientesVentas.as_view()),
]