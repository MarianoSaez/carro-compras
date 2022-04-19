from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.ProductoView.as_view()),
    path('vendido/', views.ProductoVendidoView.as_view()),
    path('get-product/<id>/', views.ProductoEspecificoView.as_view()),
    path('admin-prod/<int:pk>', views.AdminProductoView.as_view()),
    path('admin-prod/', views.AdminProductoView.as_view()),
    path('distribuidores/<int:pk>', views.AdminDistribuidoresView.as_view()),
    path('distribuidores/', views.AdminDistribuidoresView.as_view()),
    path('distribuidor-report/', views.AdminReporteDistribuidores.as_view()),
]
