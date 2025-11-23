from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView   # <-- IMPORTANT

urlpatterns = [
    path('admin/', admin.site.urls),

    # Google verification file
    path('google6df42595b7db69b3.html',
         TemplateView.as_view(template_name='google6df42595b7db69b3.html')),

    # Core app
    path('', include('core.urls')),
]

# DEBUG mode for static/media
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
