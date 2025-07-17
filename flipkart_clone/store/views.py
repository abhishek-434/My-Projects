from django.shortcuts import render, get_object_or_404, redirect
from .models import Product, Offer, Category, Cart, Order
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required



def home(request):
    offers = Offer.objects.all()  
    categories = Category.objects.all()  
    products = Product.objects.all()  

    context = {
        'offers': offers,
        'categories': categories,
        'products': products,
    }
    return render(request, 'home.html', context)

def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'product_detail.html', {'product': product})


def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    cart.items.add(product)  
    cart.save()
    
    return redirect('cart_detail')

def remove_from_cart(request, product_id):
    cart_item = get_object_or_404(Cart, product_id=product_id)
    cart_item.delete()
    return redirect('cart_view')

def cart_view(request):
    return render(request, 'store/cart.html')

def checkout(request):
    if request.method == 'POST':
        name = request.POST['name']
        address = request.POST['address']
        phone = request.POST['phone']
        total_amount = sum(item.total_price() for item in Cart.objects.all())

        order = Order.objects.create(name=name, address=address, phone=phone, total_amount=total_amount)

        Cart.objects.all().delete()  
        messages.success(request, "Order placed successfully!")
        return redirect('home')

    return render(request, 'checkout.html')

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

@login_required
def order_history(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'order_history.html', {'orders': orders})