from datetime import date
from django.shortcuts import render

all_posts = [
    {
        "slug": "hike-in-the-mountains",
        "image": "mountains.jpg",
        "author": "Abhishek",
        "date": date(2021, 12, 29),
        "title": "Mountain Hiking",
        "excerpt": "There's nothing like the views you get when hiking in the mountains! And I wasn't even prepared for what happened whilst I was enjoying the view!",
        "content": """
          Mountain climbing has fascinated the adventure seekers since a long time. With more and more mountain climbing sights being developed, people these days are getting greater chance to experience this exciting sport.
          Those who aren’t daring enough to go mountaineering but still yearn to experience similar thrill can go for a mini version of it that is rock climbing. While mountain climbing is more challenging and dangerous and requires greater focus and conviction, rock climbing is less risky as the person is required to climb a cliff which is not as high as a mountain.
          Rock climbing doesn’t require much skill and can be done with the help of the guide’s instructions even if you do not have any prior knowledge about the sport. However, those planning to go for mountain climbing must gather information about how this sport is carried out and the risks involved. It is also important to ensure that you are physically fit to indulge in this sport. It is advisable to speak to someone who can render first-hand experience of mountain climbing before planning to take up this adventure sport.
        I have tried rock climbing and the experience was awesome. I would also like to try mountain climbing but I need to gather enough courage for it first.
        """
    },
    {
        "slug": "programming-is-fun",
        "image": "coding.jpg",
        "author": "Abhishek",
        "date": date(2022, 3, 10),
        "title": "Programming Is Great!",
        "excerpt": "Did you ever spend hours searching that one error in your code? Yep - that's what happened to me yesterday...",
        "content": """
          Computer programming is the lifeblood of modern life. Imagine for a moment what would happen if all computers suddenly disappeared tomorrow. No internet. No data. No connection. No convenience. 
          Computer programming is a fundamental skill for so many different applications, not just software development or cutting-edge research into artificial intelligence. It makes banking more accessible, smooths out supply lines, and creates those fantastic online experiences we love. Programming means your favorite jeans are one click away, and governments can open services faster and more efficiently during a crisis.
        """
    },
    {
        "slug": "into-the-woods",
        "image": "woods.jpg",
        "author": "Abhishek",
        "date": date(2020, 8, 5),
        "title": "Nature At Its Best",
        "excerpt": "Nature is amazing! The amount of inspiration I get when walking in nature is incredible!",
        "content": """
          Nature is the ultimate source of our living. Both living and non-living things include nature, and everyone is interdependent, which helps maintain the ecosystem. Plants, animals, and humans all depend on nature for their survival. It supplies oxygen, sunlight, soil, water, and other necessary components. But deforestation has been the primary cause of global warming, destroying nature. In addition to exploiting excessive natural resources, other industries pollute the environment with toxic gases and chemicals. It is now essential to reduce biological damage, reuse things, and recycle existing materials to create new ones. People from all over the world should join forces to relieve pressure on the environment and restore its balance. It is now the essential aim to serve nature with utmost care to save our nature from hazards and threats.
        """
    }
]

def get_date(post):
  return post['date']

# Create your views here.


def starting_page(request):
    sorted_posts = sorted(all_posts, key=get_date)
    latest_posts = sorted_posts[-3:]
    return render(request, "blog/index.html", {
      "posts": latest_posts
    })


def posts(request):
    return render(request, "blog/all-posts.html", {
      "all_posts": all_posts
    })


def post_detail(request, slug):
    identified_post = next(post for post in all_posts if post['slug'] == slug)
    return render(request, "blog/post-detail.html", {
      "post": identified_post
    })