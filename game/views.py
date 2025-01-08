from django.shortcuts import render
import os

def index(request):
    # 添加调试信息
    template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'game', 'templates', 'game', 'index.html')
    print(f"Looking for template at: {template_dir}")
    print(f"File exists: {os.path.exists(template_dir)}")
    
    return render(request, 'game/index.html')