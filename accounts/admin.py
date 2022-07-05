from django.contrib import admin
from django.contrib.auth.models import Permission
from simple_history.admin import SimpleHistoryAdmin

from accounts.models import PasswordHistory, User, UserProfile

# Register your models here.
admin.site.register(User, SimpleHistoryAdmin)
admin.site.register(UserProfile, SimpleHistoryAdmin)
admin.site.register(Permission, SimpleHistoryAdmin)
admin.site.register(PasswordHistory, SimpleHistoryAdmin)
