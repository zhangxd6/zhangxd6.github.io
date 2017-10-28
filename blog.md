---
layout: default
---

<!-- Main -->
<div >
    <section >
        {% for post in site.posts %}
            <div class="well">
            <header class="major">
                <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
                <p class="post-meta">{{ post.date | date: "%b %-d, %Y" }}{% if post.author %} • {{ post.author }}{% endif %}{% if page.meta %} • {{ page.meta }}{% endif %}</p>
            </header>

            <section>
                {{ post.excerpt }}
            </section>

            <div class="">
                {% for tag in post.tags %}
                
                        <span class="label label-info">{{ tag }}</span>
                    
                {% endfor %}
            </div>
            </div>
        {% endfor %}
    </section>

</div>
